const ENDPOINT = "http://10.0.2.2"; // goes to localhost from avd
const PORT = 3000;


/**
 * This class provides methods to interact with our API. If no endpoint or port is provided,
 * it points to the API server on findr domain on port 80
 * @param customEndpoint (optional) A custom endpoint that the object should point at when sending requests to the API
 * @param customPort (optional) Custom port number the object should point at. Defaults to 80
 */
class Fetcher {

    // need to add credentials to log-in to the backend server
    constructor(customEndpoint, customPort) {
        this.ENDPOINT = customEndpoint ? customEndpoint : ENDPOINT;
        this.PORT = customPort ? customPort : PORT;
    }

    /**
     * Send a sign-up request to the API. If succesful, upload the profile picture (if provided) through the signed 
     * PUT url recieved from the API upon successful sign-up
     * @param {Object} data Form data obtained from the user on the signup page. Assumes that all fields are valid
     */
    async requestSignUp(data) {
        return (await fetch(this.ENDPOINT + ":" + String(this.PORT) + "/new-user", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })).status;

    }

    /**
     * Send log-in request to the API
     * @param {{ email: String, password: String}} data log-in data to send to the server for verification
     * @returns {{ 
     *      success: Boolean, 
     *      user: Promise<{
     *          name: String,
     *          email: String,
     *          gender: String,
     *          uni: String,
     *          major: String,
     *          age: Number,
     *          password: String,
     *          chats: Array<String>
     *      }>
     * }} An object containing the status of request and a promise which resolves to user profile if request was succesful
     */
    async logIn(data) {
        let logInRes = (await (fetch(this.ENDPOINT + ":" + String(this.PORT) + "/login", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })));

        if(logInRes.status !== 200) {
            return { success: false, user: null };
        }
        let user = await logInRes.json();
        return { success: true, user }
    }

    /**
     * Request the API to send profile cards based on the email provided
     * @param {String} email E-mail of the user for whom to obtain profile cards for
     * @returns {Promise<{
     *      _id: String,
     *      user_id: String,
     *      crscodes: Array<String>
     *      addinfo: String
     * }>} List of profile cards
     */
    async fetchCards(email) {        
        return await (await fetch(this.ENDPOINT + ":" + String(this.PORT) 
        + "/fetchProfileCards?email=" + email)).json();
    }

    /**
     * Request API for user profiles based on the ids provided. Look at 
     * @param {Array<String>} ids List of user ids
     */
    async fetchUsersById(ids) {
        let users = await (await fetch(this.ENDPOINT + ":" + String(this.PORT) + "/fetchUsers_id", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids })
        })).json()

        return users;
    }

    async fetchUser(email) {
        return await (await fetch(this.ENDPOINT + ":" + String(this.PORT) 
        + "/fetchUsers?email=" + email)).json();
    }

    async loadData(email) {

        let profileCards = await this.fetchCards(email);

        ids = [];
        profileCards.forEach((_card) => {
            ids.push(_card["user_id"]);
        });

        let users = await this.fetchUsersById(ids);
        users = this.mapUsersToHashTable(users);

        profileCards.forEach((_card) => {
            _card.name = users[_card.user_id].name;
            _card.image = users[_card.user_id].image;
        });

        return profileCards;
    }

    mapUsersToHashTable(users) {
        var dict = {};
    
        users.forEach((user) => {
          dict[user._id] = user;
        });
    
        return dict;
    }
}

export default Fetcher;
