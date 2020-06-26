const vars = require("../vars");
const transporter = require("nodemailer").createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
});

function sendEmail(email, hash) {
    return new Promise(function(resolve, reject) {
        var mailOptions = {
            from: vars.APP_NAME,
            to: email
        };

        var customURL = "http://" + process.env.DOMAIN + "/verifyUserEmail?key=" + hash;
        mailOptions.subject = 'Confirm email for ' + vars.APP_NAME;
        mailOptions.text = 'Please verify your email by clicking on the link below\n' + customURL;
    
        transporter.sendMail(mailOptions, (err, info) => {
            if(err) {
                reject(err);
            } else {
                resolve({ success: true, info });
            }
        });
    });
}

module.exports.sendEmail = sendEmail;
