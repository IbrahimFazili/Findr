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

			for (var i = 0; i < result.length; i++) {
				result[i].image = await AWS_Presigner.generateSignedGetUrl(
					"user_images/" + result[i].email
				);
			}

			res.send(result);
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
					for (var i = 0; i < users.length; i++) {
						users[i].image = await AWS_Presigner.generateSignedGetUrl(
							"user_images/" + users[i].email
						);
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

						element.image = await AWS_Presigner.generateSignedGetUrl(
							"user_images/" + element.email
						);
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
})

app.post("/updateKeywords", (req, res) => {
	let keywords = req.body.keywords;
	for (let i = 0; i < keywords.length; i++) {
		keywords[i] = String(keywords[i]).toLowerCase();
	}

	DB.fetchUsers({ email: req.body.email }).then((users) => {
		const oldKeywords = users[0].keywords;

		DB.updateUser({ keywords }, { email: req.body.email })
			.then((updateRes) => {
				matcher.updateGraph(req.body.email, oldKeywords).then((value) => {
					value ? res.status(201).send("success") : res.status(500).send("Server Error");
				}).catch((err) => {
					console.log(err);
					res.status(500).send("Server Error");
				})
			})
			.catch((err) => {
				console.log(err);
				res.status(500).send("Database Update Error");
			});
	}).catch((err) => {
		console.log(err);
		res.status(500).send("Database Fetch Error");
	})
});

app.post("/updateUserInfo", (req, res) => {
	const user = req.body.user;

	DB.fetchUsers({ email: user.email }).then(async (users) => {

		if (user.password !== undefined) {
			if (!validatePassword(user.password) && bcrypt.compareSync(user.oldPassword, users[0].password)) {
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

app.get("/updateProfilePicture", async (req, res) => {
	const email = req.query.email;
	var url = await AWS_Presigner.generateSignedPutUrl("user_images/" + email);
	res.status(200).send(url);
});

app.post("/new-user", (req, res) => {
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
		keywords: [],
		bio: "",
		blueConnections: [],
		greenConnections: [],
		active: false,
		verificationHash: bcrypt.hashSync(req.body.email + generateRandomNumber(), 3)
	};

	DB.insertUser(requestData)
		.then(async (result) => {
			sendEmail(requestData.email, requestData.verificationHash);
			matcher.generateGraph(requestData.email);

			res.status(201).send("Success");
		})
		.catch((err) => {
			// unsuccessful insert, reply back with unsuccess response code
			console.log(err);
			res.status(500).send("Insert Failed");
		});
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

/* Socket Listeners for chat */
bindSocketListeners(io);

http.listen(3000, () => {
	console.log("Server is running");
});
