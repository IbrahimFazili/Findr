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
    res.status(200).send("Server is Alive");
});

app.get("/fetchUsers", (req, res) => {
    DatabaseManager.fetchUsers({ email: req.query.email }).then(async function(result) {
        for(var i = 0; i < result.length; i++) {
            result[i].image = await AWS_Presigner.generateSignedGetUrl("user_images/" + result[i].email);
        }

        res.send(result);

    }).catch((err) => {
        console.log(err);
        res.status(500).send("Server error");
    });
});

app.get("/fetchMatches", (req, res) => {
    
    DatabaseManager.fetchUsers({ email: req.query.email }).then((result) => {

        if(result.length === 0) {
            console.log(`No user with email ${req.body.email}`);
            res.status(404).send("404: User with email " + req.body.email + " couldn't be found");
        }

        user = result[0];
        crs_regexes = [];
        for (let i = 0; i < user.courses.length; i++) {
            const course = user.courses[i];
            crs_regexes.push(new RegExp("^" + course + "$", "i"));
        }

        DatabaseManager.fetchUsers({ courses: { $in: crs_regexes } }).then(async (users) => {

            users = users.filter((value, index, arr) => { return !(value["_id"].equals(user._id)); });

            for (let i = 0; i < users.length; i++) {
                users[i].image = await AWS_Presigner.generateSignedGetUrl("user_images/" + users[i].email);
                users[i].password = null;
                users[i].chats = null;
            }

            res.status(200).send(JSON.stringify(users));

        }).catch((err) => {
            console.log(err);
            res.status(500).send("Server Error");
        });

    }).catch((err) => {
        console.log(err);
        res.status(500).send("Server Error");
    });
})

app.get("/fetchChatData", (req, res) => {

    const MSG_TO = req.query.to;
    DatabaseManager.fetchUsers({ email: req.query.from }).then(async (users) => {
        
        const user = users[0];
        var chatFound = false;
        let chat = null;
        
        for (let i = 0; i < user.chats.length && !chatFound; i++) {
            
            try {
                chat = (await DatabaseManager.fetchChat( user.chats[i] ))[0].chat;
                
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

app.post("/updateCourses", urlEncodedParser, (req, res) => {
    DatabaseManager.fetchUsers({ email: req.body.email }).then((result) => {
        if(result.length === 0) {
            console.log(`No user with email ${req.body.email}`);
            res.status(404).send("404: User with email " + req.body.email + " couldn't be found");
        }

        user = result[0];
        user.courses = req.body.updatedCourses;

        DatabaseManager.updateUser({ courses: user.courses }, { email: user.email }).then((value) => {
            res.status(201).send(JSON.stringify({ success: true }));
        }).catch((err) => {
            res.status(500).send("Server Error");
            console.log(err);
        });

    }).catch((err) => {
        console.log(err);
        res.status(500).send("Server Error");
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
        chats: [],
        courses: [],
        bio: ""
    };


    DatabaseManager.insertUser(requestData).then(async (result) => {
        // sendEmail(requestData);
        // reply with success response code
        res.status(201).send(JSON.stringify({ 
            signedPutUrl: await AWS_Presigner.generateSignedPutUrl("user_images/" + requestData.email)
        }));

    }).catch((err) => {
        // unsuccessful insert, reply back with unsuccess response code
        console.log(err);
        res.status(500).send("Insert Failed");
    });

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
    socket.join(socket.handshake.query.name).to(socket.handshake.query.name).emit('joined chat room' + socket.rooms);
    console.log(`${socket.handshake.query.name} Connected`);

    socket.on('new msg', (msg) => {
        DatabaseManager.fetchUsers({ email: msg.from }).then(async (users) => {

            const user = users[0];
            let chat = null;
            var msgHandled = false
            for(let i = 0; i < user.chats.length && !msgHandled; i++) {

                try {
                    chat = (await DatabaseManager.fetchChat( user.chats[i] ))[0].chat;
                    if(chat.user1 === msg.to || chat.user2 === msg.to) {

                        chat = Chat.parseJSON(chat);

                        chat.newMessage(msg.from, msg.content, msg.time);
                        msgHandled = true;

                        try {
                            await DatabaseManager.updateChat(chat, { _id: user.chats[i] });
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
                chat.newMessage(msg.from, msg.content, msg.time);

                DatabaseManager.insertChat({ chat }).then((result) => {
                    console.log('new chat created');
                    console.log(result.ops[0]);
                    
                    user.chats.push(result.ops[0]._id);
                    DatabaseManager.updateUser({ chats: user.chats }, { email: user.email }).then((value) => {
                        console.log('user1 updated');
                        socket.to(msg.to).emit('new msg', msg);

                    }).catch((reason) => {
                        socket.emit('send failed');
                        DatabaseManager.deleteChat(result.ops[0]._id);
                        console.log(reason);
                    });

                    DatabaseManager.fetchUsers({ email: msg.to }).then((res) => {

                        let user = res[0];
                        user.chats.push(result.ops[0]._id);
                        console.log('user2 fetched');
                        DatabaseManager.updateUser({ chats: user.chats }, { email: user.email }).then((value) => {
                            console.log('user2 updated');
                            socket.to(msg.to).emit('new msg', msg);
    
                        }).catch((reason) => {
                            console.log(reason);
                        });

                    }).catch((err) => {
                        console.log(err);
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
