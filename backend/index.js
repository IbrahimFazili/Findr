require("dotenv").config();
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const DB = require("./utils/DatabaseManager");
const AWS_Presigner = require("./utils/AWSPresigner");
const { bindSocketListeners } = require("./utils/Chat");
const matcher = new (require("./utils/Matcher").Matcher)();
const { EventQueue } = require('./utils/Events');
const sendEmail = require("./utils/emailer").sendEmail;
const { CallbackQueue } = require("./utils/DataStructures");

const callbackQueue = new CallbackQueue();
const CONNECTIONS_CHUNK_SIZE = 25;
var isServerOutdated = false;

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

function signUp(requestData, res, oncomplete){
	DB.insertUser(requestData)
		.then(async (result) => {
			if (process.env.NODE_ENV !== "test") {
				sendEmail(requestData.email, requestData.verificationHash);
			}

			await matcher.generateGraph(requestData.email);
			process.env.NODE_ENV === "test" ? res.status(201).send(requestData.verificationHash)
			: res.status(201).send("success");
			oncomplete();
		})
		.catch((err) => {
			// unsuccessful insert, reply back with unsuccess response code
			console.log(err);
			res.status(500).send("Insert Failed");
			oncomplete();
		});
}

function updateKeywords(email, keywords, res, oncomplete){
	// TODO: don't fetch irrelevant fields
	DB.fetchUsers({ email }).then((users) => {
		const oldKeywords = users[0].keywords;

		DB.updateUser({ keywords }, { email })
			.then((updateRes) => {
				matcher.updateGraph(email, oldKeywords).then((value) => {
					value ? res.status(201).send("success") : res.status(500).send("Server Error");
					oncomplete();
				}).catch((err) => {
					console.log(err);
					res.status(500).send("Server Error");
					oncomplete();
				})
			})
			.catch((err) => {
				console.log(err);
				res.status(500).send("Database Update Error");
				oncomplete();
			});
	}).catch((err) => {
		console.log(err);
		res.status(500).send("Database Fetch Error");
		oncomplete();
	})
}

async function rightSwipe(srcUser, targetUser, res, oncomplete) {
	try {
		const swipeResult = await matcher.handleRightSwipe(srcUser, targetUser);
		if (swipeResult.success) res.status(201).send({ isMatch: swipeResult.isMatch });
		else res.status(500).send("Right Swipe Failed");

		oncomplete();

	} catch (error) {
		console.log(error);
		res.status(500).send("Server Error");
		oncomplete();
	}
	
}

async function leftSwipe(srcUser, targetUser, res, oncomplete) {
	try {
		const success = await matcher.handleLeftSwipe(srcUser, targetUser);
		if (success) res.status(201).end();
		else res.status(500).send("Left Swipe Failed");

		oncomplete();

	} catch (error) {
		console.log(error);
		res.status(500).send("Server Error");
		oncomplete();
	}
	
}

async function deleteUser(email, res, oncomplete) {
	try {
		const success = await matcher.deleteUser(email);
		if (success) res.status(201).end();
		else res.status(500).send("Delete User Failed");
		oncomplete();

	} catch (eror) {
		console.log(error);
		res.status(500).send("Server Error");
		oncomplete();
	}

}

app.use(bodyParser.json());

app.get("/", (req, res) => {
	if (!isServerOutdated) {
		res.status(200).send("Server is Alive");
	} else {
		res.status(503).send("Server is updating...");
	}
});

app.get("/fetchUsers", (req, res) => {
	const projection = process.env.NODE_ENV !== "test" ? {
		_id: 0,
		password: 0,
		chats: 0,
		blueConnections: 0,
		greenConnections: 0,
		eventQueue: 0,
		verificationHash: 0
	} : {};
	DB.fetchUsers({ email: req.query.email }, { projection })
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

app.get("/fetchMatches", (req, res) => {
	matcher.getMatches(req.query.email)
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

app.get("/fetchConnections", (req, res) => {
	var projection = {
		_id: 0,
		password: 0,
		chats: 0,
		blueConnections: { $slice: CONNECTIONS_CHUNK_SIZE },
		greenConnections: 0,
		eventQueue: 0,
		verificationHash: 0
	};
	DB.fetchUsers({ email: req.query.email }, { projection })
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
	const projection = { chats: 1 };
	DB.fetchUsers({ email: req.query.from }, { projection })
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
	var projection = { chats: 1, email: 1 };

	DB.fetchUsers({ email: req.query.email }, { projection })
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
	const projection = { eventQueue: 1 };
	DB.fetchUsers({ email: req.query.email }, { projection })
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
		eventQueue: { events: [] },
		active: false,
		verificationHash: bcrypt.hashSync(req.body.email + generateRandomNumber(), 3)
	};
	
	callbackQueue.enqueue(signUp, requestData, res);
	
});

app.get("/verifyUserEmail", (req, res) => {
	const projection = { email: 1, active: 1  };
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

/* Socket Listeners for chat */
bindSocketListeners(io);

http.listen(3000, () => {
	console.log("Server is running");
});
