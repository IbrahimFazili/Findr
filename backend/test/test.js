const chai = require('chai');
const chatHttp = require('chai-http');
const TestData = require('./testData').testData;
const server = require("../index");
const DB = require("../utils/DatabaseManager");
const bcrypt = require("bcrypt");

chai.use(chatHttp);
chai.should();

const SERVER_URL = "http://localhost:3000";

function getRandomEntry(data) {
    return data[Math.floor(Math.random() * data.length)];
}

describe("Test Cases", () => {
    before((done) => {
        process.env.NODE_ENV = "test";
        var insertCount = 0;
        for (var i = 0; i < TestData.length; i++) {
            chai.request(SERVER_URL).post("/new-user")
            .set('content-type', 'application/json')
            .send(TestData[i])
            .end(function(err, res) {            
                res.should.have.status(201);
                insertCount++;
                if (insertCount === TestData.length) {
                    done();
                }
            });
        }

    });

    it("Check server is alive", (done) => {
        chai.request(SERVER_URL)
        .get('/')
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });

    describe("Update User Info Tests", function() {

        it("Update Basic Info", (done) => {
            const TEST_USER = getRandomEntry(TestData);
            const NEW_NAME = TEST_USER.name.split(" ")[0];
            const NEW_UNI = TEST_USER.uni;
            chai.request(SERVER_URL)
            .post("/updateUserInfo")
            .set('content-type', 'application/json')
            .send({ user: {
                email: TEST_USER.email,
                name: NEW_NAME,
                uni: NEW_UNI
            }})
            .end(function (err, res) {
                res.should.have.status(201);
                
                chai.request(SERVER_URL)
                .get(`/fetchUsers?email=${TEST_USER.email}`)
                .end(function (err, res) {
                    res.should.have.status(200);
                    chai.expect(res.body[0].name).to.be.equal(NEW_NAME);
                    chai.expect(res.body[0].uni).to.be.equal(NEW_UNI);
                    done();
                });
            });
        });

        it("Update Info without email provided", (done) => {
            const TEST_USER = getRandomEntry(TestData);
            const NEW_NAME = TEST_USER.name.split(" ")[0];
            chai.request(SERVER_URL)
            .post("/updateUserInfo")
            .set('content-type', 'application/json')
            .send({ user: {
                name: NEW_NAME,
            }})
            .end(function (err, res) {
                res.should.have.status(400);
                
                chai.request(SERVER_URL)
                .get(`/fetchUsers?email=${TEST_USER.email}`)
                .end(function (err, res) {
                    res.should.have.status(200);
                    chai.expect(res.body[0].name).to.be.equal(TEST_USER.name);
                    done();
                });
            });
        });

        it("Update Password", (done) => {
            const TEST_USER = getRandomEntry(TestData);
            const NEW_PASSWORD = "TestPassword1";
            const OLD_PASSWORD = TEST_USER.password;
            chai.request(SERVER_URL)
            .post("/updateUserInfo")
            .set('content-type', 'application/json')
            .send({ user: {
                email: TEST_USER.email,
                oldPassword: OLD_PASSWORD,
                password: NEW_PASSWORD
            }})
            .end(function (err, res) {
                res.should.have.status(201);
                
                chai.request(SERVER_URL)
                .get(`/fetchUsers?email=${TEST_USER.email}`)
                .end(function (err, res) {
                    res.should.have.status(200);
                    chai.expect(bcrypt.compareSync(NEW_PASSWORD, res.body[0].password)).to.be.equal(true);
                    done();
                });
            });
        });

        it("Update Password (Incorrect Old Password)", (done) => {
            const TEST_USER = getRandomEntry(TestData);
            const NEW_PASSWORD = "TestPassword1";
            const OLD_PASSWORD = TEST_USER.password + "abc";
            chai.request(SERVER_URL)
            .post("/updateUserInfo")
            .set('content-type', 'application/json')
            .send({ user: {
                email: TEST_USER.email,
                oldPassword: OLD_PASSWORD,
                password: NEW_PASSWORD
            }})
            .end(function (err, res) {
                res.should.have.status(406);
                
                chai.request(SERVER_URL)
                .get(`/fetchUsers?email=${TEST_USER.email}`)
                .end(function (err, res) {
                    res.should.have.status(200);
                    chai.expect(bcrypt.compareSync(TEST_USER.password, res.body[0].password)).to.be.equal(true);
                    done();
                });
            });
        });

        it("Update Password (Invalid New Password)", (done) => {
            const TEST_USER = getRandomEntry(TestData);
            const NEW_PASSWORD = "achdshbsda";
            const OLD_PASSWORD = TEST_USER.password;
            chai.request(SERVER_URL)
            .post("/updateUserInfo")
            .set('content-type', 'application/json')
            .send({ user: {
                email: TEST_USER.email,
                oldPassword: OLD_PASSWORD,
                password: NEW_PASSWORD
            }})
            .end(function (err, res) {
                res.should.have.status(406);
                
                chai.request(SERVER_URL)
                .get(`/fetchUsers?email=${TEST_USER.email}`)
                .end(function (err, res) {
                    res.should.have.status(200);
                    chai.expect(bcrypt.compareSync(TEST_USER.password, res.body[0].password)).to.be.equal(true);
                    done();
                });
            });
        });
        
    });

    describe("Update keywords tests", function() {

        beforeEach((done) => {
            DB.deleteAllUsers().then((value) => {
                var insertCount = 0;
                for (var i = 0; i < TestData.length; i++) {
                    chai.request(SERVER_URL).post("/new-user")
                    .set('content-type', 'application/json')
                    .send(TestData[i])
                    .end(function(err, res) {            
                        res.should.have.status(201);
                        insertCount++;
                        if (insertCount === TestData.length) {
                            done();
                        }
                    });
                }
            }).catch((err) => {
                console.log(err);
                done();
            })
            
        });

        it("Update to no keywords", (done) => {
            const TEST_USER = getRandomEntry(TestData);
            chai.request(SERVER_URL)
            .post('/updateKeywords')
            .set('Content-Type', 'application/json')
            .send({ 
                email :  TEST_USER.email,
                keywords : []
                
            })
            .end(async function(err,res){
                res.should.have.status(201);
                emailList = [];
                for (var i = 0; i < TestData.length; i++){
                    emailList.push(new RegExp("^" + TestData[i].email + "$", "i"));
                }
    
                try {
                    const users = await DB.fetchUsers({ email: { $in: emailList } });
    
                    const index = users.findIndex((usr) => usr.email === TEST_USER.email);
                    chai.expect(users[index].keywords).to.be.eql([]);
                    for (var i = 0; i < TestData.length; i++){
                        if (i !== index){
                            chai.expect(users[i].blueConnections).to.not.include(users[index]._id);
                        }
                    }
    
                } catch (error) {
                    console.log(error);
                }
                done();
            })
        });

        it("Update to no common keywords", (done) => {
            const TEST_USER = getRandomEntry(TestData);
            chai.request(SERVER_URL)
            .post('/updateKeywords')
            .set('Content-Type', 'application/json')
            .send({ 
                email :  TEST_USER.email,
                keywords : ["ANT102 ", "LIN102"]
                
            })
            .end(async function(err,res){
                res.should.have.status(201);
                emailList = [];
                for (var i = 0; i < TestData.length; i++){
                    emailList.push(new RegExp("^" + TestData[i].email + "$", "i"));
                }
    
                try {
                    const users = await DB.fetchUsers({ email: { $in: emailList } });
    
                    const index = users.findIndex((usr) => usr.email === TEST_USER.email);
                    chai.expect(users[index].keywords).to.be.eql(["ant102 ", "lin102"]);
                    for (var i = 0; i < TestData.length; i++){
                        if (i !== index){
                            chai.expect(users[i].blueConnections).to.not.include(users[index]._id);
                        }
                    }
    
                } catch (error) {
                    console.log(error);
                }
                done();
            })
        });

        it("Update to remove one common keywords", (done) => {
            chai.request(SERVER_URL)
            .post('/updateKeywords')
            .set('Content-Type', 'application/json')
            .send({ 
                email :  TestData[3].email,
                keywords : ["BIO100", "CHM106"]
            })
            .end(async function(err,res){
                res.should.have.status(201);
                emailList = [];
                for (var i = 0; i < TestData.length; i++){
                    emailList.push(new RegExp("^" + TestData[i].email + "$", "i"));
                }
    
                try {
                    const users = await DB.fetchUsers({ email: { $in: emailList } });
    
                    const meredithIndex = users.findIndex((usr) => usr.email === TestData[3].email);
                    chai.expect(users[meredithIndex].keywords).to.be.eql(["bio100", "chm106"]);
                    
                    const cristinaIndex = users.findIndex((usr) => usr.email === TestData[4].email);
                    const derekIndex = users.findIndex((usr) => usr.email === TestData[5].email);
                    const alexIndex = users.findIndex((usr) => usr.email === TestData[9].email);
                    const sheldonIndex = users.findIndex((usr) => usr.email === TestData[0].email);
                    const pennyIndex = users.findIndex((usr) => usr.email === TestData[2].email);
                    const leonardIndex = users.findIndex((usr) => usr.email === TestData[1].email);

                    chai.expect(users[meredithIndex].blueConnections).to.be
                    .eql([users[cristinaIndex]._id, users[derekIndex]._id]);

                    chai.expect(users[cristinaIndex].blueConnections).to.be
                    .eql([users[meredithIndex]._id, users[derekIndex]._id, users[alexIndex]._id]);

                    chai.expect(users[derekIndex].blueConnections).to.be
                    .eql([users[meredithIndex]._id, users[cristinaIndex]._id, users[sheldonIndex]._id, 
                        users[pennyIndex]._id]);

                    chai.expect(users[alexIndex].blueConnections).to.be
                    .eql([users[cristinaIndex]._id, users[leonardIndex]._id]);
    
                } catch (error) {
                    console.log(error);
                }
                done();
            })
        });
       
    });
    

    after((done) => {
        DB.deleteAllUsers();
        done();
    });

});
