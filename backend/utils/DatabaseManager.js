const MongoClient = require("mongodb").MongoClient;

const MONGO_URL =
    "mongodb+srv://" + process.env.DATABASE_USER + ":" + process.env.DATABASE_PASS + "@cluster0-hkvsu.mongodb.net/test?retryWrites=true&w=majority";
var client = new MongoClient(MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true });

const COLLECTION_USERS = process.env.NODE_ENV === "test" ? "Test_Users" : "Users";
const COLLECTION_CHATS = "ChatStorage";
const DB = "test";

/**
 * Connect the client to database at the specified URL
 * @returns {Promise} A promise is returned which resolves to the connected client. 
 *                    On failure, error is returned
 */
function connectToDatabse() {
    client = new MongoClient(MONGO_URL, { useUnifiedTopology: true });
    // TODO: start a timer after connection is established. If the timer runs out,
    // close the connection. Timer will be reset upon every request to the database.
    // The time can be used to close the connection if there's no activity for extended
    // period of time
    return new Promise(function (resolve, reject) {
        client.connect().then((connection) => {
            resolve(connection);
        }).catch((reason) => {
            client.close();
            reject(reason);
        });
    });
}

function closeConnection() { client.close(); }

/**
 * return a Promise which resolves to a reference to the collection with name provided.
 * On failure, error is returned
 * @param {String} collectionName
 * @returns {Promise} Promise which resolves to a reference to the collection
 */
function getCollection(collectionName) {
    return new Promise(function (resolve, reject) {
        if (client.isConnected()) {
            resolve(client.db(DB).collection(collectionName));
        }
        else {
            connectToDatabse().then((connection) => {
                resolve(connection.db(DB).collection(collectionName));
            }).catch((reason) => {
                reject(reason);
            })
        }
    });
}

function insertUser(profile) {

    return new Promise(function (resolve, reject) {
        getCollection(COLLECTION_USERS).then((collection) => {
            collection.insertOne(profile).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            })

        }).catch((reason) => {
            reject(err);
        });
    });
}

function fetchUsers(params) {

    return new Promise(function (resolve, reject) {
        getCollection(COLLECTION_USERS).then((collection) => {
            collection.find(params).toArray(function (err, result) {
                if (err) { reject(err); }

                resolve(result);
            });
        }).catch((reason) => {
            reject(reason);
        });
    });
}

function fetchChat(chat_id) {

    return new Promise(function (resolve, reject) {
        getCollection(COLLECTION_CHATS).then((collection) => {
            collection.find({ _id: chat_id }).toArray(function (err, result) {
                if (err) { reject(err); }

                resolve(result);
            });

        }).catch((reason) => {
            reject(reason);
        })
    });
}

function insertChat(chat) {

    return new Promise(function (resolve, reject) {
        getCollection(COLLECTION_CHATS).then((collection) => {
            collection.insertOne(chat).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        }).catch((reason) => {
            reject(reason);
        });
    });
}

function updateChat(updatedChatObject, queryObject) {

    return new Promise(function (resolve, reject) {
        getCollection(COLLECTION_CHATS).then((collection) => {
            updateDoc = { $set: { chat: updatedChatObject } }
            collection.updateOne(queryObject, updateDoc, function (err, updateResult) {
                if (err) reject(err);

                resolve(updateResult);
            });

        }).catch((reason) => {
            reject(reason);
        });
    });
}

function updateUser(updatedUserObject, queryObject) {

    return new Promise(function (resolve, reject) {
        getCollection(COLLECTION_USERS).then((collection) => {
            updateDoc = { $set: updatedUserObject }
            collection.updateOne(queryObject, updateDoc, function (err, updateResult) {
                if (err) reject(err);

                resolve(updateResult);
            });

        }).catch((reason) => {
            reject(reason);
        });

    });
}

function bulkUpdateUsers(updatedUserObjects, queryObject) {

    return new Promise(function(resolve, reject) {
        getCollection(COLLECTION_USERS).then((collection) => {
            let updateDoc = { $set: updatedUserObjects }
            collection.updateMany(queryObject, updateDoc, function(err, updateResult) {
                if (err) reject(false);

                resolve(true);
            })
        }).catch((reason) => {
            reject(false);
        })
    });
}

function deleteChat(id) {

    return new Promise(function (resolve, reject) {
        getCollection(COLLECTION_CHATS).then((collection) => {
            collection.deleteOne({ _id: id }).then((deleteRes) => {
                resolve(deleteRes);
            }).catch((err) => {
                reject(err);
            });

        }).catch((reason) => {
            reject(reason);
        });
    });
}

module.exports.insertUser = insertUser;
module.exports.insertChat = insertChat;

module.exports.updateChat = updateChat;
module.exports.updateUser = updateUser;
module.exports.bulkUpdateUsers = bulkUpdateUsers;

module.exports.closeConnection = closeConnection;

module.exports.fetchUsers = fetchUsers;
module.exports.fetchChat = fetchChat;

module.exports.getCollection = getCollection;

module.exports.deleteChat = deleteChat;
