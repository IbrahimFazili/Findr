require("dotenv").config();
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const DB = require("./utils/DatabaseManager");
const AWS_Presigner = require("./utils/AWSPresigner");
const Chat = require("./utils/Chat").Chat;
const matcher = new (require("./utils/Matcher").Matcher)();

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

app.post("/new-user", urlEncodedParser, (req, res) => {
	const requestData = {
		name: req.body.name,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 10),
		gender: req.body.gender,
		uni: req.body.uni,
		major: req.body.major,
		age: Number(req.body.age),
		chats: [],
		keywords: [],
		bio: "",
		blueConnections: [],
		greenConnections: [],
	};

	DB.insertUser(requestData)
		.then(async (result) => {
			// sendEmail(requestData);
			matcher.generateGraph(requestData.email);

			res.status(201).send(
				JSON.stringify({
					signedPutUrl: await AWS_Presigner.generateSignedPutUrl("user_images/" + requestData.email),
				})
			);
		})
		.catch((err) => {
			// unsuccessful insert, reply back with unsuccess response code
			console.log(err);
			res.status(500).send("Insert Failed");
		});
});

app.post("/login", urlEncodedParser, (req, res) => {
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

app.post("/update", urlEncodedParser, (req, res) => {
	const isMaster = req.body.ref === "refs/heads/master";
	if (isMaster) {
		isServerOutdated = true;
	}

	res.status(200);
	res.end();
});

// DB.fetchUsers({}).then(async (users) => {
//     // users.forEach((user) => {
// 	// 	user.blueConnections = [];
// 	// 	user.greenConnections = [];

//     //     DB.updateUser(user, {email:user.email}).then((res) => {
//     //         console.log(`${user.email} updated`);
//     //     });
//     // });
// 	for (let i = 0; i < users.length; i++) {
// 		const result = await matcher.generateGraph(users[i].email);
//         console.log(`Graph generation for ${users[i].name} ${result ? "successful" : "failed"}`);
// 	}
// });

function addDummyUser() {
	const requestData = {
		name: "Sheldon Cooper",
		email: "sheldon.cooper@caltech.edu",
		password: bcrypt.hashSync("Cooper73", 10),
		gender: "M",
		uni: "California Institute of Technology",
		major: "Physics",
		age: 40,
		chats: [],
		keywords: ["CSC209", "MAT224", "PHY136"],
		bio:
			"One cries because one is sad. I cry because others are stupid and that makes me sad",
		blueConnections: [],
		greenConnections: [],
	};

	DB.insertUser(requestData)
		.then(async (result) => {
			// sendEmail(requestData);
			matcher.generateGraph(requestData.email).then((res) => {
				console.log(`${requestData.name} ${res ? "added" : "failed"}`);
			});
		})
		.catch((err) => {
			// unsuccessful insert, reply back with unsuccess response code
			console.log(err);
		});
}
// addDummyUser();

/* Socket Listeners for chat */

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

				for (let i = 0; i < user.chats.length && !msgHandled; i++) {
					try {
						chat = (await DB.fetchChat(user.chats[i]))[0].chat;
						
						if (chat.user1 === msg.to || chat.user2 === msg.to) {
							chat = Chat.parseJSON(chat);

							chat.newMessage(msg.from, msg.content, msg.time);
							msgHandled = true;

							try {
								await DB.updateChat(chat, {
									_id: user.chats[i],
								});
								socket.to(msg.to).emit("new msg", msg);
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

				if (!msgHandled) {
					const chat = new Chat(msg.from, msg.to);
					chat.newMessage(msg.from, msg.content, msg.time);

					DB.insertChat({ chat })
						.then((result) => {
							console.log(result.ops[0]);

							user.chats.push(result.ops[0]._id);
							DB.updateUser(
								{ chats: user.chats },
								{ email: user.email }
							)
								.then((value) => {
									socket.to(msg.to).emit("new msg", msg);
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

									DB.updateUser(
										{ chats: user.chats },
										{ email: user.email }
									)
										.then((value) => {
											socket
												.to(msg.to)
												.emit("new msg", msg);
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
			})
			.catch((err) => {
				socket.emit("server error");
			});
	});
});

http.listen(3000, () => {
	console.log("Server is running");
});
