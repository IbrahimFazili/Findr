const DB = require('./DatabaseManager');

class Matcher {

    async handleRightSwipe(srcUser, targetUser) {
        try {
            const user = (await DB.fetchUsers({ email: srcUser }))[0];
            const rightSwipedUser = (await DB.fetchUsers({ email: targetUser}))[0];
            user.greenConnections.push((user.blueConnections.splice(
                user.blueConnections.findIndex((value) => rightSwipedUser._id.equals(value)), 1
            ))[0]);


            try {
                await DB.updateUser({ blueConnections: user.blueConnections, greenConnections: user.greenConnections }, 
                    { email: srcUser });
                
                return true;
            } catch (updateErr) {
                console.log(updateErr);
                return false;
            }

        } catch (fetchErr) {
            console.log(fetchErr);
            return false;
        }
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

    async getMatches(userEmail) {
        return [];
    }
}

module.exports.Matcher = Matcher;
