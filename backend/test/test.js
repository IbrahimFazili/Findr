const chai = require('chai');
const chatHttp = require('chai-http');

chai.use(chatHttp);
chai.should();

describe("Fetching", () => {

    beforeEach( () => {
        process.env.NODE_ENV = "test";

    });



});