require("dotenv").config();
const sendEmail = require("./utils/emailer").sendEmail;
const bcrypt = require("bcrypt");

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
    const email = "aditi.dagar@mail.utoronto.ca";
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

test_sendEmail();
