const DB = require('./DatabaseManager');

class Matcher {

    handleRightSwipe(srcUser, targetUser) {
        return;
    }

    handleLeftSwipe(srcUser, targetUser) {
        return;
    }

    async generateGraph(userEmail) {
        try {
            const user = (await DB.fetchUsers({ email: userEmail }))[0];
            let crs_regexes = [];
            for (let i = 0; i < user.courses.length; i++) {
                const course = user.courses[i];
                crs_regexes.push(new RegExp("^" + course + "$", "i"));
            }

            try {
                let potentialConnections = await DB.fetchUsers({ courses: { $in: crs_regexes } });
                potentialConnections = potentialConnections.filter((value) => {
                    return user.blueConnections.findIndex((id) => id.equals(value._id)) === -1 &&
                    !(value._id.equals(user._id));
                });

                for (let i = 0; i < potentialConnections.length; i++) {
                    potentialConnections[i] = potentialConnections[i]._id;
                }

                potentialConnections.forEach((element) => {
                    user.blueConnections.push(element);
                });

                try {
                    await DB.updateUser({ blueConnections: user.blueConnections }, { email: user.email });
                    return true;
                } catch (updateErr) {
                    console.log(updateErr);
                    return false;
                }


            } catch (err) {
                console.log(err);
                return false;
            }

        } catch (err) {
            console.log(err);
            return false;
        }
    }
}

module.exports.Matcher = Matcher;
