const DB = require('./DatabaseManager');
const { EventQueue, Event, MESSAGE_EVENT } = require('./Events');

const MAX_N = 1024;
const MIN_N = 512;
/**
 * 1) On new chat: init generator & cyclic group (Z mod(n))
 * 2) Users get their private keys (0 <= key < n) & store them locally
 * 3) 
 */
class Message {
	constructor(user, msg, timestamp) {
		this.user = user;
		this.msg = msg;
		this.timestamp = timestamp;
	}
}

class Chat {
	constructor(user1, user2) {
		this.user1 = user1;
		this.user2 = user2;
		// generate cyclic group
		this.cyclic_group = Math.floor(Math.random() * (MAX_N - MIN_N + 1)) + MIN_N;
		// generate the generator
		this.generator = Math.floor(Math.random() * (this.cyclic_group));

		this.user1_public_key = null;
		this.user2_public_key = null;
		this.messages = [];
	}

	static parseJSON(obj) {
		const chat = new Chat(obj.user1, obj.user2);
		chat.messages = obj.messages;

		return chat;
	}

	newMessage(user, msg, timestamp, public_key=null) {
		this.messages.push(new Message(user, msg, timestamp));
		if (public_key === null) return;

		if (this.user === this.user1 && this.user1_public_key !== null) this.user1_public_key = public_key;
		else if (this.user2_public_key !== null) this.user2_public_key = public_key;
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
	
					for (let i = 0; i < user.chats.length && !msgHandled; i++) {
						try {
							chat = (await DB.fetchChat(user.chats[i]))[0].chat;
							
							if (chat.user1 === msg.to || chat.user2 === msg.to) {
								chat = Chat.parseJSON(chat);
	
								chat.newMessage(msg.from, msg.content, msg.time, msg.public_key);
								msgHandled = true;
	
								try {
									await DB.updateChat(chat, {
										_id: user.chats[i],
									});
	
									if (receiverIsReachable) {
										socket.to(msg.to).emit("new msg", msg);
									} else {
										// store message event in eventQueue to notify user later
										DB.fetchUsers({ email: msg.to }).then((receiver) => {
											receiver = receiver[0];
											receiver.eventQueue = new EventQueue(receiver.eventQueue.events);
											receiver.eventQueue.enqueue(new Event(MESSAGE_EVENT, {
												from: msg.from,
												content: msg.content,
												time: msg.time
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
						} catch (err) {
							console.log(err);
							socket.emit("server error");
							msgHandled = true;
						}
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
	});
}

function initNewChat(socket, user, msg, receiverIsReachable) {
	const chat = new Chat(msg.from, msg.to);
	chat.newMessage(msg.from, msg.content, msg.time, msg.public_key);

	DB.insertChat({ chat })
		.then((result) => {

			user.chats.push(result.ops[0]._id);
			DB.updateUser({ chats: user.chats }, { email: user.email })
				.then((value) => {
					// socket.to(msg.to).emit("new msg", msg);
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
										content: msg.content,
										time: msg.time
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

module.exports.Chat = Chat;
module.exports.bindSocketListeners = bindSocketListeners;
