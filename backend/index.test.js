require("dotenv").config();
const sendEmail = require("./utils/emailer").sendEmail;
const bcrypt = require("bcrypt");
const DB = require("./utils/DatabaseManager");
const matcher = new (require("./utils/Matcher").Matcher)();

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

function resetGraph() {
	DB.fetchUsers({}).then(async (users) => {

		for (let i = 0; i < users.length; i++) {
			const user = users[i];
			user.blueConnections = [];
			user.greenConnections = [];
	
			await DB.updateUser(user, {email:user.email});
		}

		for (let i = 0; i < users.length; i++) {
			const result = await matcher.generateGraph(users[i].email);
		    console.log(`Graph generation for ${users[i].name} ${result ? "successful" : "failed"}`);
		}
	});
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

function test_sendEmail() {
    const email = "";
    const hash = bcrypt.hashSync(email + generateRandomNumber(), 3);
    sendEmail(email, hash).then((result) => {
        if (result.success) console.log("sendEmail works");
        else {
            console.log(result);
        }
    }).catch((reason) => {
        console.log(reason);
    });
}

function update_all_users() {
    DB.fetchUsers({}).then(async (users) => {
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            user.active = true;
            user.verificationHash = null;
    
            await DB.updateUser(user, {email:user.email});
            console.log(`${user.name} Updated`);
        }
    });   
}

// test_sendEmail();
// update_all_users();
