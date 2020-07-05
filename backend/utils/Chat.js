const AWS_Presigner = require("./AWSPresigner");

class Message {
	constructor(user, msg, timestamp, media) {
		this.user = user;
		this.msg = msg;
		this.timestamp = timestamp;
		this.media = media;
	}

	async generateMediaTokens () {
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

	newMessage(user, msg, timestamp, media) {
		this.messages.push(new Message(user, msg, timestamp, media));
		return this.messages[this.messages.length - 1].generateMediaTokens();
	}
}

module.exports.Chat = Chat;