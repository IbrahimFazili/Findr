const chai = require('chai');
const chatHttp = require('chai-http');
const TestData = require('./testData').testData;
const server = require("../index");
const DB = require("../utils/DatabaseManager");

chai.use(chatHttp);
chai.should();

const SERVER_URL = "http://localhost:3000";

describe("Fetching", () => {
    before((done) => {
        process.env.NODE_ENV = "test";
        for (var i = 0; i < TestData.length; i++) {
            chai.request(SERVER_URL).post("/new-user")
            .set('content-type', 'application/json')
            .send(TestData[i])
            .end((err, res) => {
                res.should.have.status(201);
            });
        }

        done();

    });

    it("server's running", (done) => {
        chai.request(SERVER_URL)
        .get('/')
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });

    after( (done) => {
        console.log("deleting");
        DB.deleteAllUsers();
        done();
    });

});
