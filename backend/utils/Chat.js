const DB = require("./DatabaseManager");
const { EventQueue, Event, BLOCK_EVENT } = require('./Events');

class Message {
	constructor(user, msg, timestamp) {
		this.user = user;
		this.msg = msg;
		this.timestamp = timestamp;
	}
}

/**
 * @param {String} user1 E-mail for one of the users participating in the chat session
 * @param {String} user2 E-mail for the other user participating in the chat session
 * @param {Boolean} active Whether this chat is active or not. It may not be active if one 
 * 						   user blocks the other user
 * @param {Array<Message>} messages List of messages in this chat
 * Initialize the chat between user1 and user2
 */
class Chat {
	
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

module.exports.Chat = Chat;
