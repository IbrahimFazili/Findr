const { EventQueue, Event, BLOCK_EVENT } = require('./Events');

class Message {
	constructor(user, msg, timestamp) {
		this.user = user;
		this.msg = msg;
		this.timestamp = timestamp;
	}
}

class Chat {
	/**
	 * @param {String} user1 E-mail for one of the users participating in the chat session
	 * @param {String} user2 E-mail for the other user participating in the chat session
	 * 
	 * Initialize the chat between user1 and user2
	 */
	constructor(user1, user2) {
		this.user1 = user1;
		this.user2 = user2;
		this.active = true;
		this.messages = [];
	}

	static parseJSON(obj) {
		const chat = new Chat(obj.user1, obj.user2);
		chat.messages = obj.messages;

		return chat;
	}

	newMessage(user, msg, timestamp) {
		this.messages.push(new Message(user, msg, timestamp));
	}

	disableChat(blockedEmail){
		this.active = false;
		try {
			const blockedUser = (await DB.fetchUsers({ email: blockedEmail }))[0];
			blockedUser.eventQueue = new EventQueue(blockedUser.eventQueue.events);
			const srcEmail = (blockedUser === this.user1) ? this.user2 : this.user1;
			blockedUser.eventQueue.enqueue(
				new Event(BLOCK_EVENT, {email : srcEmail})
			);
		} catch (fetchErr) {
            console.log(fetchErr);
            return false;
        }
	}
}

module.exports.Chat = Chat;
