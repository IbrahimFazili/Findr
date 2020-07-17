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
} = require('./utils/handlers').functions;

const callbackQueue = new CallbackQueue();
var isServerOutdated = false;

app.use(bodyParser.json());

app.get("/", (req, res) => {
	if (!isServerOutdated) {
		res.status(200).send("Server is Alive");
	} else {
		res.status(503).send("Server is updating...");
	}
});

app.get("/fetchUsers", (req, res) => {
	DB.fetchUsers({ email: req.query.email })
		.then(async function (result) {
			if (process.env.NODE_ENV !== "test") {
				for (var i = 0; i < result.length; i++) {
					delete result[i].password;
					delete result[i].chats;
					delete result[i].blueConnections;
					delete result[i].greenConnections;
					delete result[i].verificationHash;

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

app.get("/fetchMatches", (req, res) => {
	matcher
		.getMatches(req.query.email)
		.then((matches) => {
			DB.fetchUsers({ _id: { $in: matches } })
				.then(async (users) => {
					if (process.env.NODE_ENV !== "test") {
						for (var i = 0; i < users.length; i++) {
							delete users[i].password;
							delete users[i].chats;
							delete users[i].blueConnections;
							delete users[i].greenConnections;
							delete users[i].verificationHash;

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

app.get("/fetchConnections", (req, res) => {
	DB.fetchUsers({ email: req.query.email })
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
			DB.fetchUsers({ _id: { $in: ids } })
				.then(async (connections) => {
					for (let i = 0; i < connections.length; i++) {
						const element = connections[i];

						delete element.password;
						delete element.chats;
						delete element.blueConnections;
						delete element.greenConnections;
						delete element.verificationHash;

						if (process.env.NODE_ENV !== "test") {
							element.image = await AWS_Presigner.generateSignedGetUrl(
								"user_images/" + element.email
							);
						}
					}

					res.status(200).send(JSON.stringify(connections));
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
	DB.fetchUsers({ email: req.query.from })
		.then(async (users) => {
			const user = users[0];
			var chatFound = false;
			let chat = null;

			for (let i = 0; i < user.chats.length && !chatFound; i++) {
				try {
					chat = (await DB.fetchChat(user.chats[i]))[0].chat;

					if (chat.user1 === MSG_TO || chat.user2 === MSG_TO) {
						chatFound = true;
						res.status(200).send(JSON.stringify(chat));
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

app.get('/fetchChats', (req, res) => {
	DB.fetchUsers({ email: req.query.email })
	  .then(async (users) => {
		const user = users[0];
		let chat_emails = [];
		for (let i = 0; i < user.chats.length; i++) {
		  const chat = (await DB.fetchChat(user.chats[i]))[0];
		  chat_emails.push(
			chat.chat.user1 === user.email ? chat.chat.user2 : chat.chat.user1
		  );
		}
  
		DB.fetchUsers({ email: { $in: chat_emails } })
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

app.get("/fetchChatMedia", async (req, res) => {
	try {
		const downUrl = await AWS_Presigner.generateSignedGetUrl("chat_media/" + req.query.name, 30);
		res.status(200).send(downUrl);
	} catch (error) {
		console.log(error);
		res.status(404).send("media not found");
	}
});

app.get("/fetchNotifications", (req, res) => {
	DB.fetchUsers({ email: req.query.email })
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

	DB.fetchUsers({ email: user.email }).then(async (users) => {

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

app.get("/updateProfilePicture", async (req, res) => {
	const email = req.query.email;
	var url = await AWS_Presigner.generateSignedPutUrl("user_images/" + email);
	res.status(200).send(url);
});

app.post("/new-user", (req, res) => {
	if (process.env.NODE_ENV === "test") {
		for (let i = 0; i < req.body.keywords.length; i++) {
			req.body.keywords[i] = req.body.keywords[i].toLowerCase();
		}
	}
	
	const requestData = {
		name: req.body.name,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 10),
		gender: req.body.gender,
		uni: req.body.uni,
		major: req.body.major,
		age: Number(req.body.age),
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
		verificationHash: bcrypt.hashSync(req.body.email + generateRandomNumber(), 3)
	};
	
	callbackQueue.enqueue(signUp, requestData, res);
	
});

app.get("/verifyUserEmail", (req, res) => {
	DB.fetchUsers({ verificationHash: req.query.key })
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

	DB.fetchUsers({ email: requestData.email })
		.then((users) => {
			if (users.length < 1) {
				res.status(401).send("Invalid Email");
				return;
			}

			let user = users[0];
			if (bcrypt.compareSync(requestData.password, user.password)) {
				// Passwords match
				res.status(200).send(JSON.stringify(user));
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

/* Socket Listeners for chat */
bindSocketListeners(io);

http.listen(3000, () => {
	console.log("Server is running");
});
