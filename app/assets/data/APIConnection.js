import io from 'socket.io-client';
import { AsyncStorage } from 'react-native';

const ENDPOINT = 'https://api.findrapp.ca'; // goes to localhost from avd
const PORT = 443;

/**
 * This class provides methods to interact with our API. If no endpoint or port is provided,
 * it points to the API server on findr domain on port 80
 * @param customEndpoint (optional) A custom endpoint that the object should point at when sending requests to the API
 * @param customPort (optional) Custom port number the object should point at. Defaults to 80
 */
class APIConnection {
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
    const response = await fetch(
      this.ENDPOINT + ':' + String(this.PORT) + '/signup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    return response;
  }

  async updateUserInfo(data) {
    const response = (await fetch(this.ENDPOINT + ":" + String(this.PORT) + "/updateUserInfo", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: data })
    }));

    return response.status;
  }

  async updateKeywords(data) {
    const response = (await fetch(this.ENDPOINT + ":" + String(this.PORT) + "/updateKeywords", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keywords: data.keywords, email: data.email })
    }));

    if(response.status === 201){
      APIConnection.HomePage ? APIConnection.HomePage.notify() : null;
      APIConnection.ProfilePage ? APIConnection.ProfilePage.notify() : null;
    }

    return response.status;
  }

  async updateProfilePicture(email, type, checksum) {
    return (await fetch(`${this.ENDPOINT}:${this.PORT}/user/${email}/updateProfilePicture?type=${type}&checksum=${checksum}`)).text();
  }

  static uploadPicture(url, img) {
    return new Promise(function(resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', img.type);

      xhr.onreadystatechange = () => {
          if(xhr.readyState === 4) {
              if(xhr.status === 200) resolve(true);
              else {
                console.log("Upload failed"); 
                reject(false);
              }
          }
      };

      xhr.onerror = (err) => console.log(xhr.responseText);

      xhr.send({ uri: img.uri, type: img.type });
    });
  }

  async fetchUniversities(){
    const response = await fetch(
      this.ENDPOINT + ':' + String(this.PORT) + '/supportedUniversities'
    );

    return response.json();
  }

  /**
   * Send log-in request to the API
   * @param {{ email: String, password: String}} data log-in data to send to the server for verification
   * @returns {{ success: Boolean, user: Promise<{ name: String, email: String, gender: String, uni: String,
   * age: Number, image: String, password: String, chats: Array<String>, courses: Array<String>, bio: String }>
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
    return { success: true, user };
  }

  async rightSwipe(src, target) {
    const swipeResult = (await fetch(`${this.ENDPOINT}:${this.PORT}/rightSwipe?src=${src}&target=${target}`));
    if (swipeResult.status === 201) { 
      return { 
        isMatch: (await swipeResult.json()).isMatch,
        success: true
      }
    }
    return { success: false, isMatch: false };
  }

  async leftSwipe(src, target) {
    const swipeResult = (await fetch(`${this.ENDPOINT}:${this.PORT}/leftSwipe?src=${src}&target=${target}`));
    if (swipeResult.status === 201) return true;
    return false;
  }

  /**
   * Request the API to send profile cards based on the email provided
   * @param {String} email E-mail of the user for whom to obtain profile cards for
   * @returns {Promise<Array<{ name: String, email: String, gender: String, uni: String, major: String,
   * age: Number, image: String, password: String, chats: Array<String>, keywords: Array<String>, bio: String }>>}
   *
   * List of profile cards
   */
  async fetchMatches(email) {
    return (await fetch(`${this.ENDPOINT}:${this.PORT}/user/${email}/matches`)).json();
  }

  async fetchPendingMatches(email) {
    return (await fetch(`${this.ENDPOINT}:${this.PORT}/user/${email}/pendingMatches`)).json();
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
    return (
      await fetch(`${this.ENDPOINT}:${this.PORT}/user/${email}/connections`)
    ).json();
  }

  async fetchChatImage(name){
    return (
      await fetch(`${this.ENDPOINT}:${this.PORT}/chat_media/${name}`)
    ).text();
  }

  /**
   * Fetch the user profile given the email
   * @param {String} email email of the user whose profile to fetch
   * @returns {Promise<{ name: String, email: String, gender: String, uni: String, major: String,
   * age: Number, image: String, password: String, chats: Array<String>, keywords: Array<String>, bio: String }>}
   *
   * User's profile
   */
  async fetchUser(email) {
    let users = await (
      await fetch(`${this.ENDPOINT}:${this.PORT}/user/${email}`)
    ).json();

    return users;
  }

  async fetchChats(email) {
    return (
      await fetch(`${this.ENDPOINT}:${this.PORT}/user/${email}/chats`)
    ).json();
  }

  async fetchChatData(from, to) {
    return (
      await fetch(`${this.ENDPOINT}:${this.PORT}/fetchChatData?from=${from}&to=${to}&skipCount=${0}`)
    ).json();
  }

  /**
   * Fetch profile cards with format that can be rendered on-screen
   * @param {String} email User email to use as a search parameter for profile cards
   */
  loadData(email) {
    return this.fetchConnections(email);
  }

  static async initSocketConnection() {
    const user_email = await AsyncStorage.getItem('storedEmail');
    if (user_email) {
      this.socket = io(ENDPOINT + ":" + PORT, { query: "name=" + user_email });
      this.socket.on("new msg", (msg) => {
        if (this.MESSAGE_QUEUES[msg.from]) {
          this.MESSAGE_QUEUES[msg.from].enqueue(msg);
        }
        else {
          this.MESSAGE_QUEUES[msg.from] = new Queue();
          this.MESSAGE_QUEUES[msg.from].enqueue(msg);
        }

        this.observers.forEach((observer) => observer.observer());
      });

      this.socket.on("upload urls", (urls) => {
        const keys = Object.keys(urls);
        keys.forEach(async (key) => {
          await this.uploadPicture(urls[key], this.mediaStore[key]);
        });

        keys.forEach((key) => delete this.mediaStore[key]);
      });
    }
  }

  static attachObserver(observer, uid) {
    const existingIndex = this.observers.findIndex((value) => value.uid === uid);
    if (existingIndex === -1) this.observers.push({ observer, uid });
    else {
      this.observers[existingIndex] = { observer, uid };
    }
  }

  static attachHomePageNotifier(notify) {
    this.HomePage = { notify };
  }

  static attachMatchPageNotifier(notify) {
    this.MatchesPage = { notify };
  }

  static attachMessagePageNotifier(notify) {
    this.MessagesPage = { notify };
  }

  static attachProfilePageNotifier(notify) {
    this.ProfilePage = { notify };
  }

}

class Queue {
  constructor() {
    this._elements = [];
  }

  getSize() { return this._elements.length; }
  isEmpty() { return this._elements.length === 0; }
  enqueue(item) { this._elements.push(item); }
  dequeue() { return !this.isEmpty() ? this._elements.shift() : null; }
  peekNewest() { return !this.isEmpty() ? this._elements[this._elements.length - 1] : null; }
  peekOldest() { return !this.isEmpty() ? this._elements[0] : null; }
}

APIConnection.MESSAGE_QUEUES = {}
APIConnection.observers = [];
APIConnection.socket = null;
APIConnection.mediaStore = {};

APIConnection.HomePage = null;
APIConnection.MatchesPage = null;
APIConnection.MessagesPage = null;
APIConnection.ProfilePage = null;

export default APIConnection;
