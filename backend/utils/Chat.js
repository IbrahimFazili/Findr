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
}

module.exports.Chat = Chat;
