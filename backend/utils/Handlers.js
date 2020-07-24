const DB = require('./DatabaseManager');
const sendEmail = require("./emailer").sendEmail;
const matcher = new (require("./Matcher").Matcher)();

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
		if (success) {
			if (process.env.NODE_ENV !== "test") DB.deleteUser({ email });
			res.status(201).end();
		}
		else res.status(500).send("Delete User Failed");
		oncomplete();

	} catch (eror) {
		console.log(error);
		res.status(500).send("Server Error");
		oncomplete();
	}

}

async function blockUser(srcUser, targetUser, res, oncomplete) {
	try {
		const success = await matcher.blockUser(srcUser, targetUser);
		if (success) res.status(201).end();
		else res.status(500).send("block user failed");

		oncomplete();
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
		oncomplete();
	}
}

module.exports.functions = {
    blockUser,
    deleteUser,
    leftSwipe,
    rightSwipe,
    updateKeywords,
    signUp
};
