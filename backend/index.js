require('dotenv').config();
const app = require("express")();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
// const sendEmail = require("./utils/emailer").sendEmail;
const DatabaseManager = require("./utils/DatabaseManager");
const ObjectId = require("objectid");
const AWS_Presigner = require('./utils/AWSPresigner');
const Chat = require('./utils/Chat').Chat;

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.status(200).sendFile(__dirname + "/test_html_files/user.html");
});

app.get("/search", (req, res) => {
    res.status(200).sendFile(__dirname + "/test_html_files/search.html");
});

app.get("/pcard", (req, res) => {
    res.status(200).sendFile(__dirname + "/test_html_files/profile-card.html");
});

app.get("/close", (req, res) => {
    DatabaseManager.closeConnection();
    res.status(200).redirect("/");
});

app.get("/fetchUsers", (req, res) => {
    DatabaseManager.fetchUsers({ email: req.query.email }).then(async function(result) {
        for(var i = 0; i < result.length; i++) {
            result[i].image = await AWS_Presigner.generateSignedGetUrl("user_images/" + result[i].image);
        }

        res.send(result);

    }).catch((err) => {
        console.log(err);
        res.status(500).send("Server error");
    });
});

app.post("/fetchUsers_id", urlEncodedParser, (req, res) => {
    ids = [];
    req.body.ids.forEach((value) => { ids.push( ObjectId(value) ); });

    DatabaseManager.fetchUsers({ _id: { $in: ids } }).then(async function(result) {
        for(var i = 0; i < result.length; i++) {
            result[i].image = await AWS_Presigner.generateSignedGetUrl("user_images/" + result[i].image);
        }

        res.status(200).send(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).send("Server error");
    });
});

app.get("/fetchProfileCards", (req, res) => {

    // query user profile first for crs codes that are related to this user
    DatabaseManager.fetchUsers({ email: req.query.email }).then((result) => {
        if(result.length === 0) {
            console.log(`No user with email ${req.body.email}`);
            res.status(404).send("404: User with email " + req.body.email + " couldn't be found");
        }

        user = result[0];
        DatabaseManager.fetchProfileCards({ user_id: user._id }).then((profileCards) => {
            if(profileCards.length > 0) {
                req_card = profileCards[0];

                // 2. Fetch cards with same courses
                crs_regexes = [];
                for (let i = 0; i < req_card.crscodes.length; i++) {
                    const course = req_card.crscodes[i];
                    crs_regexes.push(new RegExp("^" + course + "$", "i"));
                }

                DatabaseManager.fetchProfileCards({ crscodes: { $in: crs_regexes } }).then((cards) => {

                    cards = cards.filter((value, index, arr) => { return !(value["user_id"].equals(user._id)); });
                    // 3. Filter according to additional req if necessary (TODO)
                    res.status(200).send(JSON.stringify(cards));

                }).catch((err) => {
                    res.status(500).send("Server Error: Couldn't fetch cards");
                })

                return;
            }
            else {
                res.status(404).send("404: Profile card for this user doesn't exist");
            }
        }).catch((reason) => {

            console.log(reason);
            res.status(500).send("Servers Error: Couldn't fetch cards");
        })
    })

});

app.get("/fetchChatData", (req, res) => {

    const MSG_TO = req.query.to;
    DatabaseManager.fetchUsers({ email: req.query.from }).then(async (users) => {
        
        const user = users[0];
        var chatFound = false;
        let chat = null;
        for (let i = 0; i < user.chats.length && !chatFound; i++) {
            
            try {
                chat = await DatabaseManager.fetchChat(user.chats[i]);
                if(chat.user1 === MSG_TO || chat.user2 === MSG_TO) {
                    chatFound = true;
                    res.status(200).send(JSON.stringify(chat));
                }
            } catch (err) {
                console.log('err fetching chats');
                console.log(err);
                res.status(500).send("Server Error");
            }
            
        }

        if(!chatFound) {
            res.status(404).send("chat data DNE");
        }

    }).catch((err) => {
        res.status(500).send("Server Error");
    })

});

app.post("/newProfileCard", urlEncodedParser, (req, res) => {
    // 1. Check if a profile card already exists linked to the user : TODO
    //     a. If it does, add this crs code as well
    // 2. Otherwise create a new profile card in the database *Profiles* : Done
    
    DatabaseManager.fetchUsers({ email: req.body.email }).then((result) => {
        if(result.length === 0) {
            console.log(`No user with email ${req.body.email}`);
            res.status(404).send("404: User with email " + req.body.email + " couldn't be found");
        }

        user = result[0];
        profileCard = {
            user_id: user._id,
            crscodes: [ req.body.crscode ],
            addinfo: req.body.addinfo
        };

        DatabaseManager.fetchProfileCards({ user_id: profileCard.user_id }).then((existingCards) => {
            if(existingCards.length > 0) {
                
                existingCard = existingCards[0];
                if(existingCard.crscodes.findIndex((crs) => { return profileCard.crscodes[0] === crs }) === -1) {
                    existingCard.crscodes.push(profileCard.crscodes[0]);
                }
                // update entry in the database
                DatabaseManager.updateProfileCard(existingCard, { user_id: profileCard.user_id })
                .then((updateResult) => {
                    res.status(201).send("Success");
                })
                .catch((err) => {
                    // unsuccessful insert, reply back with unsuccess response code
                    console.log(err);
                    res.status(500).send("Insert Failed");
                });

                
                return;
            }
            
            // card doesn't exist
            DatabaseManager.insertProfileCard(profileCard).then((result) => {
                res.status(201).send("Success");
            }).catch((err) => {
                // unsuccessful insert, reply back with unsuccess response code
                console.log(err);
                res.status(500).send("Insert Failed");
            });
        })



    }).catch((err) => {
        console.log(err);
        res.status(500).send("Can't find the user profile");
    });
    
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
        image: req.body.image,
        chats: []
    };



    // database *Users*
    DatabaseManager.insertUser(requestData).then((result) => {
        // sendEmail(requestData);
        // reply with success response code

    }).catch((err) => {
        // unsuccessful insert, reply back with unsuccess response code
        console.log(err);
        res.status(500).send("Insert Failed");
    });

    res.status(201).send("Success");
});

app.post("/login", urlEncodedParser, (req, res) => {
    const requestData = {
        email: req.body.email,
        password: req.body.password
    }

    DatabaseManager.fetchUsers({ email: requestData.email }).then((users) => {
        if(users.length < 1) {
            res.status(401).send('Invalid Email');
            return;
        }

        let user = users[0];
        if(bcrypt.compareSync(requestData.password, user.password)) {
            // Passwords match
            res.status(200).send(JSON.stringify(user));
        } else {
            // Passwords don't match
            res.status(401).send('Invalid password');
        }
        
    }).catch((err) => {
        console.log(err);
        res.status(500).send('Server error');
    });
});

// DatabaseManager.fetchUsers({}).then((users) => {
//     users.forEach((user) => {
//         user.chats = [];
//         DatabaseManager.updateUser(user, {email:user.email}).then((res) => {
//             console.log(`${user.email} updated`);
//         });
//     });
// });

/* Socket Listeners for chat */

io.on('connection', (socket) => {

    socket.on('login', (msg) => {
        socket.join(msg.from).emit('joined chat room' + socket.rooms);
    });

    socket.on('new msg', (msg) => {
        DatabaseManager.fetchUsers({ email: msg.from }).then(async (users) => {

            const user = users[0];
            let chat = null;
            var msgHandled = false
            for(let i = 0; i < user.chats.length && !msgHandled; i++) {

                try {
                    chat = await DatabaseManager.fetchChat(user.chats[i]);
                    if(chat.user1 === msg.to || chat.user2 === msg.to) {
                        chat.newMessage(msg.from, msg.content);
                        msgHandled = true;

                        try {
                            await DatabaseManager.updateChat(chat, user.chats[i]);
                            socket.to(msg.to).emit('new msg', msg);
                        } catch (err_nested) {
                            console.log(err_nested);
                            socket.emit('send failed');
                        }

                    }
                } catch (err) {
                    console.log(err);
                    socket.emit('server error');
                    msgHandled = true;
                }
            }

            if(!msgHandled) {
                const chat = new Chat(msg.from, msg.to);
                DatabaseManager.insertChat(chat).then((result) => {

                    user.chats.append(result._id);
                    DatabaseManager.updateUser({ chats: user.chats }, user.email).then((value) => {
                        socket.to(msg.to).emit('new msg', msg);

                    }).catch((reason) => {
                        socket.emit('send failed');
                        DatabaseManager.deleteChat(result._id);
                        console.log(reason);
                    });

                }).catch((err) => {
                    socket.emit('send failed');
                    console.log(err);
                });
            }

        }).catch((err) => {
            socket.emit('server error');
        });
    });
});

http.listen(3000, () => { console.log("Server is running"); });
