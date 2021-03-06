const DB = require('./DatabaseManager');
const { EventQueue, Event, MATCH_EVENT } = require('./Events');

class Matcher {

    async handleRightSwipe(srcUser, targetUser) {
        try {
            const user = (await DB.fetchUsers({ email: srcUser }))[0];
            const rightSwipedUser = (await DB.fetchUsers({ email: targetUser }))[0];
            const swipedUserIndex = user.blueConnections.findIndex((value) => rightSwipedUser._id.equals(value._id));

            if (swipedUserIndex === -1) return { success: false, isMatch: false };

            const swipedUserConnection = ((user.blueConnections.splice(swipedUserIndex, 1))[0]);
            user.greenConnections.push(swipedUserConnection);

            try {
                await DB.updateUser({ blueConnections: user.blueConnections, greenConnections: user.greenConnections },
                    { email: srcUser });

                const isMatch = this.hasIncomingGreenConnection(user._id, rightSwipedUser);
                if (isMatch) {
                    rightSwipedUser.eventQueue = new EventQueue(rightSwipedUser.eventQueue.events);
                    rightSwipedUser.eventQueue.enqueue(
                        new Event(MATCH_EVENT, { _id : user._id})
                    )

                    await DB.updateUser({ eventQueue: rightSwipedUser.eventQueue }, { email: rightSwipedUser.email });
                }

                return { success: true, isMatch };
            } catch (updateErr) {
                console.log(updateErr);
                return { success: false, isMatch: false };
            }

        } catch (fetchErr) {
            console.log(fetchErr);
            return { success: false, isMatch: false };
        }
    }

    async handleLeftSwipe(srcUser, targetUser) {
        try {
            const user = (await DB.fetchUsers({ email: srcUser }))[0];
            const leftSwipedUser = (await DB.fetchUsers({ email: targetUser }))[0];

            const swipedUserIndex = user.blueConnections.findIndex((value) => leftSwipedUser._id.equals(value._id));
            if (swipedUserIndex === -1) return false;

            user.blueConnections.splice(swipedUserIndex, 1);

            try {
                await DB.updateUser({ blueConnections: user.blueConnections }, { email: srcUser });
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

    updateOutgoingConnection(connection, srcId, blueConn) {

        return new Promise(function (resolve, reject) {
            if (connection.blueConnections.findIndex((conn) => conn._id.equals(srcId)) === -1
                && connection.greenConnections.findIndex((conn) => conn._id.equals(srcId)) === -1) {

                connection.blueConnections.push({
                    _id: srcId,
                    commonKeywords: blueConn.commonKeywords
                });

                DB.updateUser({ blueConnections: connection.blueConnections }, { _id: connection._id }).then((result) => {
                    resolve(true);
                }).catch((err) => {
                    console.log(err);
                    reject(false);
                });
            } else {
                resolve(true);
            }
        });
    }

    async generateGraph(email, keywords) {
        try {
            const user = (await DB.fetchUsers({ email }))[0];
            let keyword_regexes = [];
            let usable_keywords = user.keywords;
            
            if (keywords !== undefined) {
                usable_keywords = keywords;
            }

            for (let i = 0; i < usable_keywords.length; i++) {
                const keyword = usable_keywords[i];
                keyword_regexes.push(new RegExp("^" + keyword + "$", "i"));
            }

            try {
                let potentialConnections = await DB.fetchUsers({ keywords: { $in: keyword_regexes } });
               
                let duplicateConnections = potentialConnections.filter((value) => {
                    return user.blueConnections.findIndex((conn) => conn._id.equals(value._id)) !== -1 &&
                        !(value._id.equals(user._id));
                });
                
                potentialConnections = potentialConnections.filter((value) => {
                    return user.blueConnections.findIndex((conn) => conn._id.equals(value._id)) === -1 &&
                        !(value._id.equals(user._id))
                        && user.blockedUsers.findIndex((id) => id.equals(value._id)) === -1
                        && value.blockedUsers.findIndex((id) => id.equals(user._id)) === -1
                        && user.greenConnections.findIndex((id) => id._id.equals(value._id)) === -1
                });

                for (var i = 0; i < duplicateConnections.length; i++) {
                    let commonKeywords = user.keywords.filter(value => duplicateConnections[i].keywords.includes(value));
                    let index1 = user.blueConnections.findIndex((conn) => conn._id.equals(duplicateConnections[i]._id));
                    user.blueConnections[index1].commonKeywords = commonKeywords;

                    let index2 = duplicateConnections[i].blueConnections.findIndex((conn) => conn._id.equals(user._id));
                    duplicateConnections[i].blueConnections[index2].commonKeywords = commonKeywords;
                    await DB.updateUser({ blueConnections: user.blueConnections },
                        { email: user.email });

                    await DB.updateUser({ blueConnections: duplicateConnections[i].blueConnections },
                        { email: duplicateConnections[i].email });
                }
               
                let blueConn = null;
                for (let i = 0; i < potentialConnections.length; i++) {
                    blueConn = {
                        _id : potentialConnections[i]._id, 
                        commonKeywords : user.keywords.filter(value => potentialConnections[i].keywords.includes(value))
                    };

                    this.updateOutgoingConnection(potentialConnections[i], user._id, blueConn);
                    potentialConnections[i] = blueConn;
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

    async deleteUser(email) {
        try {
            const user = (await DB.fetchUsers({ email }))[0];

            try {
                let ids = [];
                user.blueConnections.forEach((element) => ids.push(element._id));
                
                let connections = await DB.fetchUsers({ _id: { $in : ids } });
                connections.forEach((element) => {
                    
                    const index = element.blueConnections.findIndex((value) => value._id.equals(user._id));
                    element.blueConnections.splice(index, 1);
                });

                try {
                    for (let i = 0; i < connections.length; i++) {
                        const element = connections[i];
                        await DB.updateUser({ blueConnections: element.blueConnections }, { email: element.email })
                    }
    
                    return true;
                } catch (error) {
                    console.log(error);
                    return false;
                }

            } catch (fetchErr) {
                console.log(fetchErr);
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
        
    }

    async updateGraph(email, oldKeywords){
        try {
            const user = (await DB.fetchUsers({ email }))[0];

            var removedKeywords = oldKeywords.filter(value => !user.keywords.includes(value));
            var addedKeywords = user.keywords.filter(value => !oldKeywords.includes(value));
            var j = 0;

            for(var i = 0; i < removedKeywords.length; i++) {
                j = 0;
                while (j < user.blueConnections.length) {

                    if (user.blueConnections[j].commonKeywords.includes(removedKeywords[i])){

                        const newCommonKeywords = user.blueConnections[j].commonKeywords.filter((value) => value !== removedKeywords[i])
                        const user2 = (await DB.fetchUsers({ _id : user.blueConnections[j]._id }))[0];
                        const id_index = user2.blueConnections.findIndex((value) => value._id.equals(user._id));

                        if (newCommonKeywords.length === 0){
                            user.blueConnections.splice(j, 1);
                            j--;

                            user2.blueConnections.splice(id_index, 1);
                            DB.updateUser({ blueConnections: user2.blueConnections }, { _id: user2._id });
                            
                        }
                        else {
                            user.blueConnections[j].commonKeywords = newCommonKeywords
                            user2.blueConnections[id_index].commonKeywords = newCommonKeywords
                            DB.updateUser({blueConnections: user2.blueConnections}, {_id: user2._id}) 
                        }

                    }

                    j++;
                }
            } 

            await DB.updateUser({ blueConnections: user.blueConnections }, { email });

            if (addedKeywords.length > 0){

                return this.generateGraph(email, addedKeywords)
            }

            return true;
               
        } catch (error) {
            console.log(error);
            return false;
            
        }
    }

    hasIncomingGreenConnection(srcUserId, user) {
        try {
            return user.greenConnections.findIndex((id) => id._id.equals(srcUserId)) !== -1;
        } catch (fetchErr) {
            console.log(fetchErr);
            return false;
        }
    }

    async getMatches(email) {
        try {
            const user = (await DB.fetchUsers({ email }))[0];
            let matches = [];
            const projection = { greenConnections: 1 };
            for (let i = 0; i < user.greenConnections.length; i++) {
                const otherUser = (await DB.fetchUsers({ _id: user.greenConnections[i]._id }, { projection }))[0];
                if (this.hasIncomingGreenConnection(user._id, otherUser)) {
                    matches.push(otherUser._id);
                }
            }

            return matches;
        } catch (fetchErr) {
            console.log(fetchErr);
            return [];
        }
    }

    async getPendingMatches(email) {
        try {
            const user = (await DB.fetchUsers({ email }))[0];
            let matches = [];
            const projection = { greenConnections: 1 };
            for (let i = 0; i < user.greenConnections.length; i++) {
                const otherUser = (await DB.fetchUsers({ _id: user.greenConnections[i]._id }, { projection }))[0];
                if (!this.hasIncomingGreenConnection(user._id, otherUser)) {
                    matches.push(otherUser._id);
                }
            }

            return matches;
        } catch (fetchErr) {
            console.log(fetchErr);
            return [];
        }
    }

    async blockUser(srcEmail, blockedEmail) {
        try {
            const srcUser = (await DB.fetchUsers({ email: srcEmail }))[0];
            const blockedUser = (await DB.fetchUsers({ email: blockedEmail}))[0];

            const blueConnectionsIndex = srcUser.blueConnections.findIndex((value) => value._id.equals(blockedUser._id));
            if ( blueConnectionsIndex !== -1){
                srcUser.blueConnections.splice(blueConnectionsIndex, 1);
            }
            const greenConnectionsIndex = srcUser.greenConnections.findIndex((value) => value._id.equals(blockedUser._id));
            if ( greenConnectionsIndex !== -1){
                srcUser.greenConnections.splice(greenConnectionsIndex, 1);
            }
            const blueConnectionsIndex2 = blockedUser.blueConnections.findIndex((value) => value._id.equals(srcUser._id));
            if ( blueConnectionsIndex2 !== -1){
                blockedUser.blueConnections.splice(blueConnectionsIndex2, 1);
            }
            const greenConnectionsIndex2 = blockedUser.greenConnections.findIndex((value) => value._id.equals(srcUser._id));
            if ( greenConnectionsIndex2 !== -1){
                blockedUser.greenConnections.splice(greenConnectionsIndex2, 1);
            }

            srcUser.blockedUsers.push(blockedUser._id);
            await DB.updateUser(srcUser, { email: srcEmail });
            await DB.updateUser(blockedUser, { email: blockedEmail });
            return true;
        } catch (fetchErr) {
            console.log(fetchErr);
            return false;
        }
    }

    
}

module.exports.Matcher = Matcher;
