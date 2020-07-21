const AWS_Presigner = require("./AWSPresigner");
const DB = require('./DatabaseManager');
const { EventQueue, Event, MESSAGE_EVENT, BLOCK_EVENT } = require('./Events');

class Message {
	constructor(user, msg, timestamp, media) {
		this.user = user;
		this.msg = msg;
		this.timestamp = timestamp;
		this.media = media;
	}

	async generateMediaTokens() {
		var date = new Date();
		var token = "";
		var mediaToken = []
		for (var i = 0; i < this.media.length; i++ ){
			token = this.user + date.getTime() + i
			mediaToken.push(token);
		}

		var URLS = {};
		for (var i = 0; i < this.media.length; i++ ){
			var url = await AWS_Presigner.generateSignedPutUrl("chat_media/" + mediaToken[i], this.media[i].type);
			URLS[this.media[i].name] = url;
		}

		this.media = mediaToken;
		return URLS;
	}

}

class Chat {
	/**
	 * @param {String} user1 E-mail for one of the users participating in the chat session
	 * @param {String} user2 E-mail for the other user participating in the chat session
	 * @param {Boolean} active Whether this chat is active or not. It may not be active if one 
	 * 						   user blocks the other user
	 * @param {Array<Message>} messages List of messages in this chat
	 * Initialize the chat between user1 and user2
	 */
	constructor(user1, user2) {
		this.user1 = user1;
		this.user2 = user2;
		this.active = true;
		this.user1_public_key = null;
		this.user2_public_key = null;
		this.messages = [];
	}

	static parseJSON(obj) {
		const chat = new Chat(obj.user1, obj.user2);
		chat.messages = obj.messages;

		return chat;
	}

	newMessage(user, msg, timestamp, media, public_key=null) {
		const newMsg = new Message(user, msg, timestamp, media);
		this.messages.push(newMsg);
		if (public_key === null) return newMsg.generateMediaTokens();

		if (this.user === this.user1 && this.user1_public_key !== null) this.user1_public_key = public_key;
		else if (this.user2_public_key !== null) this.user2_public_key = public_key;

		return newMsg.generateMediaTokens();
	}

	async disableChat(blockedEmail) {
		this.active = false;
		try {
			const blockedUser = (await DB.fetchUsers({ email: blockedEmail }))[0];
			blockedUser.eventQueue = new EventQueue(blockedUser.eventQueue.events);
			const srcEmail = (blockedUser === this.user1) ? this.user2 : this.user1;
			blockedUser.eventQueue.enqueue(
				new Event(BLOCK_EVENT, {email : srcEmail})
			);
	
			return true;
		} catch (fetchErr) {
			console.log(fetchErr);
			return false;
		}
	}
}

/* Socket Listeners for chat */
function bindSocketListeners(io) {
	io.on("connection", (socket) => {
		socket
			.join(socket.handshake.query.name)
			.to(socket.handshake.query.name)
			.emit("joined chat room" + socket.rooms);
		console.log(`${socket.handshake.query.name} Connected`);
	
		socket.on("new msg", (msg) => {
			DB.fetchUsers({ email: msg.from })
				.then(async (users) => {
					const user = users[0];
					let chat = null;
					var msgHandled = false;
					const receiverIsReachable = io.sockets.adapter.rooms[msg.to] && io.sockets.adapter.rooms[msg.to].length > 0;
	
					try {
						chat = await findChat(user, msg.to);

						if (chat !== null) {
							const chat_id = chat._id;
							chat = chat.chat;
							const mediaUploadUrls = await chat.newMessage(msg.from, msg.msg, msg.time, msg.media, msg.public_key);

							msg.media = chat.messages[chat.messages.length - 1].media;
							if (msg.public_key) delete msg.public_key;
							msgHandled = true;

							try {
								await DB.updateChat(chat, {
									_id: chat_id,
								});
								socket.emit("upload urls", mediaUploadUrls);

								if (receiverIsReachable) {
									socket.to(msg.to).emit("new msg", msg);
								} else {
									// store message event in eventQueue to notify user later
									DB.fetchUsers({ email: msg.to }).then((receiver) => {
										receiver = receiver[0];
										receiver.eventQueue = new EventQueue(receiver.eventQueue.events);
										receiver.eventQueue.enqueue(new Event(MESSAGE_EVENT, {
											from: msg.from,
											content: msg.msg,
											time: msg.time,
											media: msg.media
										}));

										DB.updateUser({ eventQueue: receiver.eventQueue }, { email: msg.to });

									}).catch((reason) => {
										console.log(reason);
									})
								}
							} catch (err_nested) {
								console.log(err_nested);
								socket.emit("send failed");
							}
						}
					} catch (findChatError) {
						console.log(findChatError);
						msgHandled = true;
						socket.emit("server error");
					}
					// no existing chat b/w users, so create a new one
					if (!msgHandled) {
						initNewChat(socket, user, msg, receiverIsReachable);
					}
				})
				.catch((err) => {
					socket.emit("server error");
				});
		});

		socket.on("request public key", (src_email, target_email) => {
				DB.fetchUsers({ email: src_email })
				.then(async (users) => {
					const user = users[0];
					chat = await findChat(user, target_email);
					if (chat !== null){
						if (chat.user1 === user){
							socket.emit("public key", {
								user: chat.user2,
								public_key: chat.user2_public_key
							});
						}
						else {
							socket.emit("public key", {
								user: chat.user1,
								public_key: chat.user1_public_key
							});
						}	
					}
					else{
						socket.emit("chat doesn't exist");
					}
				})
				.catch((err) => {
					socket.emit("server error");
				});
		});

		socket.on("delete media", (mediaArray) => {
			for (var i = 0; i < mediaArray.length; i++){
				const path = "chat_media/" + mediaArray[i];
				AWS_Presigner.deleteMedia(path);
			}
		});

	});
}

async function initNewChat(socket, user, msg, receiverIsReachable) {
	const chat = new Chat(msg.from, msg.to);
	const mediaUploadUrls = await chat.newMessage(msg.from, msg.msg, msg.time, msg.media, msg.public_key);
	msg.media = chat.messages[chat.messages.length - 1].media;

	DB.insertChat({ chat })
		.then((result) => {

			user.chats.push(result.ops[0]._id);
			DB.updateUser({ chats: user.chats }, { email: user.email })
				.then((value) => {
					socket.emit("upload urls", mediaUploadUrls);
				})
				.catch((reason) => {
					socket.emit("send failed");
					DB.deleteChat(result.ops[0]._id);
					console.log(reason);
				});

			DB.fetchUsers({ email: msg.to })
				.then((res) => {
					let user = res[0];
					user.chats.push(result.ops[0]._id);

					DB.updateUser({ chats: user.chats }, { email: user.email })
						.then((value) => {
							if (receiverIsReachable) {
								socket.to(msg.to).emit("new msg", msg);
							} else {
								// store message event in eventQueue to notify user later
								DB.fetchUsers({ email: msg.to }).then((receiver) => {
									receiver = receiver[0];
									receiver.eventQueue = new EventQueue(receiver.eventQueue.events);
									receiver.eventQueue.enqueue(new Event(MESSAGE_EVENT, {
										from: msg.from,
										msg: msg.msg,
										time: msg.time,
										media: msg.media
									}));

									DB.updateUser({ eventQueue: receiver.eventQueue }, { email: msg.to });
								}).catch((reason) => {
									console.log(reason);
								});
							}
						})
						.catch((reason) => {
							console.log(reason);
						});
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.catch((err) => {
			socket.emit("send failed");
			console.log(err);
		});
}

async function findChat(user, target) {
	for (let i = 0; i < user.chats.length; i++) {
		try {
			const DBchat = (await DB.fetchChat(user.chats[i]))[0];
			const chat = {
				chat: DBchat.chat,
				_id: DBchat._id
			}

			if (chat.chat.user1 === target || chat.chat.user2 === target) {
				chat.chat = Chat.parseJSON(chat.chat);
				return chat;
			}
		} catch (error) {
			console.log(error);
			return null;
		}
		
	}
	return null;
}


module.exports.Chat = Chat;
module.exports.bindSocketListeners = bindSocketListeners;
