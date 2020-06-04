const DB = require('./DatabaseManager');

class Matcher {

    async handleRightSwipe(srcUser, targetUser) {
        try {
            const user = (await DB.fetchUsers({ email: srcUser }))[0];
            const rightSwipedUser = (await DB.fetchUsers({ email: targetUser}))[0];
            const swipedUserId = (user.blueConnections.splice(
                user.blueConnections.findIndex((value) => rightSwipedUser._id.equals(value)), 1
            ))[0];

            user.greenConnections.push(swipedUserId);


            try {
                await DB.updateUser({ blueConnections: user.blueConnections, greenConnections: user.greenConnections }, 
                    { email: srcUser });
                
                return { success: true, isMatch: await this.hasIncomingGreenConnection(user._id, swipedUserId)};
            } catch (updateErr) {
                console.log(updateErr);
                return { success: false, isMatch: false};
            }

        } catch (fetchErr) {
            console.log(fetchErr);
            return { success: false, isMatch: false};
        }
    }

    handleLeftSwipe(srcUser, targetUser) {
        return;
    }

    async generateGraph(email) {
        try {
            const user = (await DB.fetchUsers({ email }))[0];
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
                    potentialConnections.length > 0 ? await DB.updateUser({ blueConnections: user.blueConnections }, 
                        { email: user.email }) : null;
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
    
    async hasIncomingGreenConnection(srcUserId, _id) {
        try {
            const user = (await DB.fetchUsers({ _id }))[0];
            return user.greenConnections.findIndex((id) => id.equals(srcUserId)) !== -1;
        } catch (fetchErr) {
            console.log(fetchErr);
            return false;
        }
    }

    async getMatches(email) {
        try {
            const user = (await DB.fetchUsers({ email }))[0];
            let matches = [];
            for (let i = 0; i < user.greenConnections.length; i++) {
                if(await this.hasIncomingGreenConnection(user._id, user.greenConnections[i])) {
                    matches.push(user.greenConnections[i]);
                }
            }

            return matches;
        } catch (fetchErr) {
            console.log(fetchErr);
            return [];
        }
    }
}

module.exports.Matcher = Matcher;
