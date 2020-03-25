const app = require("express")();
const bodyParser = require("body-parser");
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const sendEmail = require("./utils/emailer").sendEmail;
const DatabaseManager = require("./utils/DatabaseManager");

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.status(200).sendFile(__dirname + "/user.html");
});

app.get("/search", (req, res) => {
    res.status(200).sendFile(__dirname + "/search.html");
});

app.get("/pcard", (req, res) => {
    res.status(200).sendFile(__dirname + "/profile-card.html");
});

app.get("/close", (req, res) => {
    DatabaseManager.closeConnection();
    res.status(200).redirect("/");
});

app.get("/fetchUsers", (req, res) => {
    DatabaseManager.fetchUsers({ email: req.query.email }).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.log(err);
    });
});

app.get("/fetchProfileCards", (req, res) => {
    // 1. query user profile first for crs codes that are related to this user
    // 2. Fetch cards with same courses
    // 3. Filter according to additional req if necessary
    // 4. Send response with all the valid cards (JSON)
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
            image: req.body.img,
            crscode: req.body.crscode,
            addinfo: req.body.addinfo
        };

        DatabaseManager.fetchProfileCards({ user_id: profileCard.user_id }).then((existingCards) => {
            if(existingCards.length > 0) {
                console.log("Card already exists");

                // update entry in the database

                res.status(200).send("Success");
                return;
            }
            
            // card doesn't exist
            DatabaseManager.insertProfileCard(profileCard).then((result) => {
                res.status(200).send("Success");
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
        gender: req.body.gender,
        uni: req.body.uni,
        major: req.body.major, // don't need it
        age: Number(req.body.age)
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

    res.status(201).redirect("/");
});

app.listen(3000, () => { console.log("Server is running"); });
