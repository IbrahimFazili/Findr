require("dotenv").config();
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const DB = require("./utils/DatabaseManager");
const AWS_Presigner = require("./utils/AWSPresigner");
const { bindSocketListeners, Chat } = require("./utils/Chat");
const matcher = new (require("./utils/Matcher").Matcher)();
const { EventQueue } = require('./utils/Events');
const { CallbackQueue } = require("./utils/DataStructures");
const { 
	blockUser, 
	deleteUser,
	leftSwipe,
	rightSwipe,
	updateKeywords,
	signUp
} = require('./utils/Handlers').functions;
const { SUPPORTED_UNIVERSITIES } = require("./vars");

const callbackQueue = new CallbackQueue();
const CONNECTIONS_CHUNK_SIZE = 25;
const MESSAGES_CHUNK_SIZE = 50;
var isServerOutdated = false;

app.use(bodyParser.json());

app.get("/", (req, res) => {
	if (!isServerOutdated) {
		res.status(200).send((process.env.NODE_ENV === "test") ? "Test Server is Alive"
				     : "Server is Alive");
	} else {
		res.status(503).send("Server is updating...");
	}
});

app.get("/user/:user_email", async (req, res) => {
	const projection = process.env.NODE_ENV !== "test" ? {
		_id: 0,
		password: 0,
		chats: 0,
		blueConnections: 0,
		greenConnections: 0,
		eventQueue: 0,
		verificationHash: 0
	} : {};

	try {
		const users = await DB.fetchUsers({ email: req.params.user_email }, { projection });
		if (users.length === 0) {
			res.status(404).send("user not found");
			return;
		}

		const user = users[0];
		if (process.env.NODE_ENV !== "test") {
			user.image = await AWS_Presigner.generateSignedGetUrl(
				"user_images/" + user.email
			);
		}

		res.status(200).send(user);
	} catch (error) {
		console.log(error);
		res.status(500).send("Database Fetch Error");
	}
});

app.post("/fetchUsers", (req, res) => {
	const projection = process.env.NODE_ENV !== "test" ? {
		_id: 0,
		password: 0,
		chats: 0,
		blueConnections: 0,
		greenConnections: 0,
		eventQueue: 0,
		verificationHash: 0
	} : {};
	DB.fetchUsers({ email: { $in: req.body.emails } }, { projection })
		.then(async function (result) {
			if (process.env.NODE_ENV !== "test") {
				for (var i = 0; i < result.length; i++) {

					result[i].image = await AWS_Presigner.generateSignedGetUrl(
						"user_images/" + result[i].email
					);
				}	
			}

			res.status(200).send(result);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send("Database Fetch Error");
		});
});

app.get("/user/:user_email/matches", (req, res) => {
	matcher.getMatches(req.params.user_email)
		.then((matches) => {
			const projection = {
				_id: 0,
				password: 0,
				chats: 0,
				blueConnections: 0,
				greenConnections: 0,
				eventQueue: 0,
				verificationHash: 0
			};
			DB.fetchUsers({ _id: { $in: matches } }, { projection })
				.then(async (users) => {
					if (process.env.NODE_ENV !== "test") {
						for (var i = 0; i < users.length; i++) {

							users[i].image = await AWS_Presigner.generateSignedGetUrl(
								"user_images/" + users[i].email
							);
						}
					}
					

					res.status(200).send(users);
				})
				.catch((err) => {
					console.log(err);
					res.status(500).send("Database Fetch Error");
				});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send("Server Error");
		});
});

app.get("/user/:user_email/connections", (req, res) => {
	var projection = {
		_id: 0,
		password: 0,
		chats: 0,
		blueConnections: { $slice: CONNECTIONS_CHUNK_SIZE },
		greenConnections: 0,
		eventQueue: 0,
		verificationHash: 0
	};
	DB.fetchUsers({ email: req.params.user_email }, { projection })
		.then((result) => {
			
			if (result.length === 0) {
				console.log(`No user with email ${req.body.email}`);
				res.status(404).send(
					"404: User with email " +
						req.body.email +
						" couldn't be found"
				);
				return;
			}

			const user = result[0];
			let ids = [];
			user.blueConnections.forEach(element => {
				ids.push(element._id);
			});

			projection = {
				_id: 0,
				password: 0,
				chats: 0,
				blueConnections: 0,
				greenConnections: 0,
				eventQueue: 0,
				verificationHash: 0
			};
			DB.fetchUsers({ _id: { $in: ids } }, { projection })
				.then(async (connections) => {
					for (let i = 0; i < connections.length; i++) {
						const element = connections[i];

						if (process.env.NODE_ENV !== "test") {
							element.image = await AWS_Presigner.generateSignedGetUrl(
								"user_images/" + element.email
							);
						}
					}

					res.status(200).send(connections);
				})
				.catch((err) => {
					console.log(err);
					res.status(500).send("Server Error");
				});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send("Server Error");
		});
});

app.get("/fetchChatData", (req, res) => {
	const MSG_TO = req.query.to;
	var projection = { chats: 1 };
	const skipCount = Number(req.query.skipCount);
	DB.fetchUsers({ email: req.query.from }, { projection })
		.then(async (users) => {
			const user = users[0];
			var chatFound = false;
			let chat = null;

			for (let i = 0; i < user.chats.length && !chatFound; i++) {
				try {
					projection = { 'chat.user1': 1, 'chat.user2': 1 };
					chat = (await DB.fetchChat(user.chats[i], { projection }))[0].chat;

					if (chat.user1 === MSG_TO || chat.user2 === MSG_TO) {
						chatFound = true;
						projection = { "chat.messages": { $slice: [ -skipCount - MESSAGES_CHUNK_SIZE, MESSAGES_CHUNK_SIZE] } }
						// projection = { chat: { messages: { $slice: [ -skipCount, MESSAGES_CHUNK_SIZE] } } };
						chat = (await DB.fetchChat(user.chats[i], { projection }))[0].chat;
						res.status(200).send(JSON.stringify(chat));
						break;
					}
				} catch (err) {
					console.log("err fetching chats");
					console.log(err);
					res.status(500).send("Server Error");
				}
			}

			if (!chatFound) {
				res.status(404).send("chat data DNE");
			}
		})
		.catch((err) => {
			res.status(500).send("Server Error");
		});
});

app.get('/user/:user_email/chats', (req, res) => {
	var projection = { chats: 1, email: 1 };

	DB.fetchUsers({ email: req.params.user_email }, { projection })
	  .then(async (users) => {
		const user = users[0];
		let chat_emails = [];
		for (let i = 0; i < user.chats.length; i++) {
		  const chat = (await DB.fetchChat(user.chats[i]))[0];
		  chat_emails.push(
			chat.chat.user1 === user.email ? chat.chat.user2 : chat.chat.user1
		  );
		}
		
		projection = { name: 1, email: 1 };
		DB.fetchUsers({ email: { $in: chat_emails } }, { projection })
		  .then(async (chat_users) => {
			let chats = [];
			for (let i = 0; i < chat_users.length; i++) {
			  const element = chat_users[i];
			  chats.push({
				name: element.name,
				email: element.email,
				image: await AWS_Presigner.generateSignedGetUrl(
				  'user_images/' + element.email
				),
			  });
			}
  
			res.status(200).send(chats);
		  })
		  .catch((err) => {
			console.log(err);
			res.status(500).send('Database Fetch Error');
		  });
	  })
	  .catch((err) => {
		console.log(err);
		res.status(500).send('Database Fetch Error');
	  });
});

app.get("/chat_media/:mediaName", async (req, res) => {
	try {
		const downUrl = await AWS_Presigner.generateSignedGetUrl("chat_media/" + req.params.mediaName, 30);
		res.status(200).send(downUrl);
	} catch (error) {
		console.log(error);
		res.status(404).send("media not found");
	}
});

app.get("/user/:user_email/notifications", (req, res) => {
	const projection = { eventQueue: 1 };
	DB.fetchUsers({ email: req.params.user_email }, { projection })
		.then(async (users) => {
			const user = users[0];
			const userEventQueue = new EventQueue(user.eventQueue.events);

			res.status(200).send(userEventQueue.dequeueAll());
			
			DB.updateUser({ eventQueue: userEventQueue }, { email: req.query.email });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send("Database Fetch Error");
		});
});

app.post("/updateKeywords", (req, res) => {
	let keywords = req.body.keywords;
	for (let i = 0; i < keywords.length; i++) {
		keywords[i] = String(keywords[i]).toLowerCase();
	}

	callbackQueue.enqueue(updateKeywords, req.body.email, keywords, res);
});

app.post("/updateUserInfo", (req, res) => {
	const user = req.body.user;
	if (user.email === undefined || user.email === null) {
		res.status(400).send("missing user email");
		return;
	}
	if (user.keywords) delete user.keywords;
	if (user.gender) {
		if (user.gender !== 'M' && user.gender !== 'F' &&
		user.gender !== 'O' && user.gender !== 'P') {
			delete user.gender;
		}
	}

	const projection = { password: 1 };
	DB.fetchUsers({ email: user.email }, { projection }).then(async (users) => {

		if (user.password !== undefined) {
			if (!validatePassword(user.password) || !bcrypt.compareSync(user.oldPassword, users[0].password)) {
				res.status(406).send("invalid password");
				return;
			}
	
			user.password = bcrypt.hashSync(user.password, 10);
		}

		await DB.updateUser(user, { email: user.email });
		res.status(201).send("success");

	}).catch((err) => {
		console.log(err);
		res.status(500).send('Database Fetch Error');
	})
	
});

app.get("/rightSwipe", (req, res) => {
	const srcUser = req.query.src;
	const targetUser = req.query.target;

	callbackQueue.enqueue(rightSwipe, srcUser, targetUser, res);
});

app.get("/leftSwipe", (req, res) => {
	const srcUser = req.query.src;
	const targetUser = req.query.target;

	callbackQueue.enqueue(leftSwipe, srcUser, targetUser, res);
});

app.get("/blockUser", async (req, res) => {
	const srcUser = req.query.src;
	const targetUser = req.query.target;

	callbackQueue.enqueue(blockUser, srcUser, targetUser, res);

	try {
		const user = (await DB.fetchUsers({ email: srcUser }))[0];

		for (let i = 0; i < user.chats.length; i++) {
			const chat = (await DB.fetchChat(user.chats[i]))[0].chat;
			if (chat.user1 === targetUser || chat.user2 === targetUser) {
				chat = Chat.parseJSON(chat);
				chat.disableChat(targetUser);
				break;
			}
		}
	} catch (error) {
		console.log(error);
	}
});

app.get("/deleteUser", (req, res) => {
	const email = req.query.email;
	callbackQueue.enqueue(deleteUser, email, res);
});

app.get("/user/:user_email/updateProfilePicture", async (req, res) => {
	const email = req.params.user_email;
	var url = await AWS_Presigner.generateSignedPutUrl("user_images/" + email, req.query.type);
	res.status(200).send(url);
});

app.get("/supportedUniversities", (req, res) => {
	res.status(200).send(SUPPORTED_UNIVERSITIES);
});

app.post("/signup", (req, res) => {
	if (process.env.NODE_ENV === "test") {
		for (let i = 0; i < req.body.keywords.length; i++) {
			req.body.keywords[i] = req.body.keywords[i].toLowerCase();
		}
	}
	
	const requestData = {
		name: req.body.name,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 10),
		gender: '',
		uni: req.body.uni,
		major: req.body.major,
		age: req.body.age,
		clubs: [],
		projects: [],
		experience: [],
		chats: [],
		keywords: process.env.NODE_ENV === "test" ? req.body.keywords : [],
		bio: "",
		blueConnections: [],
		greenConnections: [],
		blockedUsers: [],
		eventQueue: { events: [] },
		active: false,
		verificationHash: generateVerificationHash(req.body.email)
	};
	
	callbackQueue.enqueue(signUp, requestData, res);
	
});

app.get("/verifyUserEmail", (req, res) => {
	const projection = { email: 1, active: 1  };
	if (!req.query.key){
		res.status(400).send("Verfication key missing");
		return;
	}
	DB.fetchUsers({ verificationHash: req.query.key }, { projection })
		.then(async (users) => {
			if (users.length === 0) {
				res.status(404).send("User doesn't exist");
				return;
			}

			const user = users[0];
			user.active = true;
			DB.updateUser({ active: user.active, verificationHash: null }, { email: user.email });
			res.status(200).send("Email Successfully Verified");
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send("Database Fetch Error");
		});
});

app.post("/login", (req, res) => {
	const requestData = {
		email: req.body.email,
		password: req.body.password,
	};

	const projection = { 
		_id: 0,
		chats: 0,
		blueConnections: 0,
		greenConnections: 0,
		eventQueue: 0,
		verificationHash: 0
	};
	DB.fetchUsers({ email: requestData.email }, { projection })
		.then((users) => {
			if (users.length < 1) {
				res.status(401).send("Invalid Email");
				return;
			}

			let user = users[0];
			if (bcrypt.compareSync(requestData.password, user.password)) {
				// Passwords match
				delete user.password;
				res.status(200).send(user);
			} else {
				// Passwords don't match
				res.status(401).send("Invalid password");
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send("Server error");
		});
});

app.post("/update", (req, res) => {
	const isMaster = req.body.ref === "refs/heads/master";
	if (isMaster) {
		isServerOutdated = true;
	}

	res.status(200);
	res.end();
});

function validatePassword(password) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/;
    return regex.test(password);
}

function generateRandomNumber() {
	var randomNumber = "";
	var i = 0;
	for (i = 0; i < 8; i++){
		randomDigit = Math.floor(Math.random() * 10);
		randomNumber = randomNumber + randomDigit;
	}
	return randomNumber;
}

function generateVerificationHash(email) {
	let hash = bcrypt.hashSync(email + generateRandomNumber(), 3);
	while (hash.endsWith('.')) {
		hash = hash.substr(0, hash.length - 1);
	}

	return hash;
}

/* Socket Listeners for chat */
bindSocketListeners(io);

const port = (process.env.NODE_ENV === "test") ? 8100 : 3000;
http.listen(port, () => {
	console.log("Server is running");
});
