// import Auth0 from 'react-native-auth0';
import { AsyncStorage } from 'react-native';
import AUTH_REQ_BODY from './variables';

const ENDPOINT = "http://api.findrapp.ca"; // goes to localhost from avd
const PORT = 80;
const AUTH_URL = 'https://findrapp.us.auth0.com/oauth/token'

/**
 * This class provides methods to interact with our API. If no endpoint or port is provided,
 * it points to the API server on findr domain on port 80
 * @param customEndpoint (optional) A custom endpoint that the object should point at when sending requests to
the API
 * @param customPort (optional) Custom port number the object should point at. Defaults to 80
 */
class APIConnection {

    // need to add credentials to log-in to the backend server
    constructor(customEndpoint, customPort) {
        this.ENDPOINT = customEndpoint ? customEndpoint : ENDPOINT;
        this.PORT = customPort ? customPort : PORT;
    }

    getCodeVerifier() {
        const str = crypto.randomBytes(32);
        return this.base64URLEncode(str)
    }

    base64URLEncode(str) {
        return str.toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    sha256(buffer) {
        return crypto.createHash('sha256').update(buffer).digest();
    }

    async getAuthorization() {
        const savedAuth = JSON.parse(await AsyncStorage.getItem('auth'));
        if(savedAuth && (Number(savedAuth.expires_in) > ((new Date()).getTime()) / 1000)) {
            const auth = savedAuth.token_type + " " + savedAuth.access_token;
            return auth;
        }
        else {
            console.log("access tokens expired");
            const new_auth = this.getAccessToken();
            const auth =  new_auth.token_type + " " + new_auth.access_token;
            return auth;
        }
    }

    async getAccessToken() {
        console.log("inside get access token");
        const response = await (await fetch(AUTH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: AUTH_REQ_BODY
        })).json();

        expiry_time = response.expires_in + ((new Date()).getTime())/1000;
        response.expires_in = expiry_time;
        await AsyncStorage.setItem('auth', JSON.stringify(response));

        return response; // { access_token: , token_type: }
    }

    /**
     * Send a sign-up request to the API. If succesful, upload the profile picture (if provided) through the
signed
     * PUT url recieved from the API upon successful sign-up
     * @param {Object} data Form data obtained from the user on the signup page. Assumes that all fields are
valid
     */
    async requestSignUp(data) {
        const response = (await fetch(this.ENDPOINT + ":" + String(this.PORT) + "/new-user", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'authorization' : await this.getAuthorization()
            },
            body: JSON.stringify(data)
        }));

        return response;
    }

    uploadPicture(url, img) {
        return new Promise(function(resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', url);

            xhr.onreadystatechange = () => {
                if(xhr.readyState === 4) {
                    if(xhr.status === 200) resolve(true);
                    else reject(false);
                }
            };

            xhr.send(img);
        });
    }

    /**
     * Send log-in request to the API
     * @param {{ email: String, password: String}} data log-in data to send to the server for verification
     * @returns {{
     *      success: Boolean,
     *      user: Promise<{name: String, email: String, gender: String, uni: String, major: String,
     *          age: Number, image: String, password: String, chats: Array<String>, courses: Array<String>,
     *          bio: String
     *      }>
     * }} An object containing the status of request and a promise which resolves to user profile if request was
succesful
     */
    async logIn(data) {
        var auth = await this.getAuthorization();
        let logInRes = (await (fetch(this.ENDPOINT + ":" + String(this.PORT) + "/login", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'authorization' : auth
            },
            body: JSON.stringify(data)
        })));

        if(logInRes.status !== 200) {
            return { success: false, user: null };
        }
        let user = await logInRes.json();
        return { success: true, user };
    }

    /**
     * Request the API to send profile cards based on the email provided
     * @param {String} email E-mail of the user for whom to obtain profile cards for
     * @returns {Promise<Array<{ name: String, email: String, gender: String, uni: String, major: String,
     * age: Number, image: String, password: String, chats: Array<String>, keywords: Array<String>, bio: String
}>>}
     *
     * List of profile cards
     */
    async fetchMatches(email) {
        return await (await fetch(this.ENDPOINT + ":" + String(this.PORT)
        + "/fetchMatches?email=" + email, {
            headers: {
                'authorization' : await this.getAuthorization()
            }
        })).json();
    }

    /**
     * Request the API to send potential connections for the user with the email provided
     * @param {String} email E-mail of the user for whom to obtain potential connections for
     * @returns {Promise<Array<{ name: String, email: String, gender: String, uni: String,
     * major: String, age: Number, image: String, keywords: Array<String>, bio: String }>>}
     *
     * List of profile cards
     */
    async fetchConnections(email) {
        return await (await fetch(this.ENDPOINT + ":" + String(this.PORT)
        + "/fetchConnections?email=" + email, {
            headers: {
                'authorization' : await this.getAuthorization()
            }
        })).json();
    }

    /**
     * Fetch the user profile given the email
     * @param {String} email email of the user whose profile to fetch
     * @returns {Promise<{ name: String, email: String, gender: String, uni: String, major: String,
     * age: Number, image: String, password: String, chats: Array<String>, keywords: Array<String>, bio: String
     * }>}
     *
     * User's profile
     */
    async fetchUser(email) {
        let users = await (await fetch(this.ENDPOINT + ":" + String(this.PORT)
        + "/fetchUsers?email=" + email, {
            headers: {
                'authorization' : await this.getAuthorization()
            }
        })).json();

        return users[0];
    }

    /**
     * Fetch profile cards with format that can be rendered on-screen
     * @param {String} email User email to use as a search parameter for profile cards
     */
    loadData(email) {
        return this.fetchConnections(email);
    }
}

export default APIConnection;