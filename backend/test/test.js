const chai = require('chai');
const chatHttp = require('chai-http');
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const TestData = require('./testData').testData;
const server = require("../index");
const DB = require("../utils/DatabaseManager");
const bcrypt = require("bcrypt");

chai.use(chatHttp);
chai.use(deepEqualInAnyOrder);
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
            chai.request(SERVER_URL).post("/signup")
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
                .get(`/user/${TEST_USER.email}`)
                .end(function (err, res) {
                    res.should.have.status(200);
                    chai.expect(res.body.name).to.be.equal(TEST_USER.name);
                    done();
                });
            });
        });

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
                .get(`/user/${TEST_USER.email}`)
                .end(function (err, res) {
                    res.should.have.status(200);
                    chai.expect(res.body.name).to.be.equal(NEW_NAME);
                    chai.expect(res.body.uni).to.be.equal(NEW_UNI);
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
                .get(`/user/${TEST_USER.email}`)
                .end(function (err, res) {
                    res.should.have.status(200);
                    chai.expect(bcrypt.compareSync(TEST_USER.password, res.body.password)).to.be.equal(true);
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
                .get(`/user/${TEST_USER.email}`)
                .end(function (err, res) {
                    res.should.have.status(200);
                    chai.expect(bcrypt.compareSync(TEST_USER.password, res.body.password)).to.be.equal(true);
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
                .get(`/user/${TEST_USER.email}`)
                .end(function (err, res) {
                    res.should.have.status(200);
                    chai.expect(bcrypt.compareSync(NEW_PASSWORD, res.body.password)).to.be.equal(true);
                    done();
                });
            });
        });
        
    });

    describe("Right & Left Swipe Tests", function() {
        
        it("Single Right Swipe", (done) => {
            const penny = TestData[2];
            const bailey = TestData[7];

            chai.request(SERVER_URL)
            .get(`/rightSwipe?src=${penny.email}&target=${bailey.email}`)
            .end((err, res) => {
                res.should.have.status(201);
                chai.expect(res.body.isMatch).to.be.equal(false);

                DB.fetchUsers({ email: { $in: [ penny.email, bailey.email] } }).then((users) => {
                    const penny_DB = users[0].email === penny.email ? users[0] : users[1];
                    const bailey_DB = users[0].email === bailey.email ? users[0] : users[1];
                    
                    chai.expect(penny_DB.greenConnections).to
                    .deep.equalInAnyOrder([{
                        _id: bailey_DB._id,
                        commonKeywords: ['sta107']
                    }]);

                    var blueIds = [];
                    penny_DB.blueConnections.forEach((value) => blueIds.push(value._id));

                    chai.expect(blueIds).to.not.include(bailey_DB._id);
                    done();
                }).catch((err) => {
                    console.log(err);
                    done();
                });

                
            });
        }); 

        it("Double Right Swipe", (done) => {
            const sheldon = TestData[0];
            const leonard = TestData[1];

            chai.request(SERVER_URL)
            .get(`/rightSwipe?src=${sheldon.email}&target=${leonard.email}`)
            .end((err, res) => {
                res.should.have.status(201);
                chai.expect(res.body.isMatch).to.be.equal(false);

                DB.fetchUsers({ email: { $in: [ leonard.email, sheldon.email] } }).then((users) => {
                    const sheldon_DB = users[0].email === sheldon.email ? users[0] : users[1];
                    const leonard_DB = users[0].email === leonard.email ? users[0] : users[1];
                    
                    chai.expect(sheldon_DB.greenConnections).to
                    .deep.equalInAnyOrder([{
                        _id: leonard_DB._id,
                        commonKeywords: ['phy136']
                    }]);

                    var blueIds = [];
                    sheldon_DB.blueConnections.forEach((value) => blueIds.push(value._id));

                    chai.expect(blueIds).to.not.include(leonard_DB._id);
                }).catch((err) => {
                    console.log(err);
                    done();
                });
            });
            
            setTimeout(() => {
                chai.request(SERVER_URL)
                .get(`/rightSwipe?src=${leonard.email}&target=${sheldon.email}`)
                .end((err, res) => {
                    res.should.have.status(201);
                    chai.expect(res.body.isMatch).to.be.equal(true);

                    DB.fetchUsers({ email: { $in: [ leonard.email, sheldon.email] } }).then((users) => {
                        const sheldon_DB = users[0].email === sheldon.email ? users[0] : users[1];
                        const leonard_DB = users[0].email === leonard.email ? users[0] : users[1];

                        chai.expect(leonard_DB.greenConnections).to
                        .deep.equalInAnyOrder([{
                            _id: sheldon_DB._id,
                            commonKeywords: ['phy136']
                        }]);

                        var blueIds = [];
                        leonard_DB.blueConnections.forEach((value) => blueIds.push(value._id));

                        chai.expect(blueIds).to.not.include(sheldon_DB._id);

                        done();
                    }).catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            }, 5);
                
        });
    });

    describe("Update keywords tests", function() {

        beforeEach((done) => {
            DB.deleteAllUsers().then((value) => {
                var insertCount = 0;
                for (var i = 0; i < TestData.length; i++) {
                    chai.request(SERVER_URL).post("/signup")
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
                    userIds = []
                    for (var i = 0; i < users[index].blueConnections.length; i++){
                        userIds.push(users[index].blueConnections[i]._id)
                    }
                    for (var i = 0; i < TestData.length; i++){
                        if (i !== index){
                            chai.expect(userIds).to.not.include(users[index]._id);
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
                    chai.expect(users[index].keywords).to.have.members(["ant102 ", "lin102"]);
                    for (var i = 0; i < users[index].blueConnections.length; i++){
                        userIds.push(users[index].blueConnections[i]._id)
                    }
                    for (var i = 0; i < TestData.length; i++){
                        if (i !== index){
                            chai.expect(userIds).to.not.include(users[index]._id);
                        }
                    }
    
                } catch (error) {
                    console.log(error);
                }
                done();
            })
        });

        it("Update to remove one common keyword", (done) => {
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
                    chai.expect(users[meredithIndex].keywords).to.have.members(["bio100", "chm106"]);
                    
                    const cristinaIndex = users.findIndex((usr) => usr.email === TestData[4].email);
                    const derekIndex = users.findIndex((usr) => usr.email === TestData[5].email);
                    const alexIndex = users.findIndex((usr) => usr.email === TestData[9].email);
                    const sheldonIndex = users.findIndex((usr) => usr.email === TestData[0].email);
                    const pennyIndex = users.findIndex((usr) => usr.email === TestData[2].email);
                    const leonardIndex = users.findIndex((usr) => usr.email === TestData[1].email);
                    const owenIndex = users.findIndex((usr) => usr.email === TestData[6].email);

                    chai.expect(users[meredithIndex].blueConnections).to.deep
                    .equalInAnyOrder([ 
                        { _id : users[cristinaIndex]._id, 
                          commonKeywords : ["bio100", "chm106"]},

                        { _id : users[derekIndex]._id,
                          commonKeywords : ["bio100"]} ]);
                    
                    chai.expect(users[cristinaIndex].blueConnections).to.deep
                    .equalInAnyOrder([
                        { _id : users[meredithIndex]._id,
                          commonKeywords : ["bio100", "chm106"]},
                        
                        { _id : users[derekIndex]._id,
                          commonKeywords : ["bio100"]},

                        { _id : users[alexIndex]._id,
                          commonKeywords : ["phy105"]} ]);

                    chai.expect(users[derekIndex].blueConnections).to.deep
                    .equalInAnyOrder([
                        { _id : users[meredithIndex]._id,
                          commonKeywords : ["bio100"]},

                        { _id : users[cristinaIndex]._id,
                          commonKeywords : ["bio100"]},

                        { _id : users[sheldonIndex]._id,
                          commonKeywords : ["mat224"]},

                        { _id : users[pennyIndex]._id,
                          commonKeywords : ["eco100"]} ]);

                    chai.expect(users[alexIndex].blueConnections).to.deep
                    .equalInAnyOrder([
                        { _id : users[cristinaIndex]._id,
                          commonKeywords : ["phy105"]},
                        
                        { _id : users[owenIndex]._id,
                          commonKeywords : ["mat102"]},
                          
                        { _id : users[leonardIndex]._id,
                          commonKeywords : ["mat102"]} ]);
    
                } catch (error) {
                    console.log(error);
                }
                done();
            })
        });    

        it("Update to add one common keyword", (done) => {
            chai.request(SERVER_URL)
            .post('/updateKeywords')
            .set('Content-Type', 'application/json')
            .send({ 
                email :  TestData[8].email,
                keywords : ["POL113", "RLG101", "CSC209"]
            })
            .end(async function(err,res){
                res.should.have.status(201);
                emailList = [];
                for (var i = 0; i < TestData.length; i++){
                    emailList.push(new RegExp("^" + TestData[i].email + "$", "i"));
                }
    
                try {
                    const users = await DB.fetchUsers({ email: { $in: emailList } });
    
                    const mayimIndex = users.findIndex((usr) => usr.email === TestData[8].email);
                    chai.expect(users[mayimIndex].keywords).to.have.members(["pol113", "rlg101", "csc209"]);
                    
                    const sheldonIndex = users.findIndex((usr) => usr.email === TestData[0].email);
                    const owenIndex = users.findIndex((usr) => usr.email === TestData[6].email);
                    const leonardIndex = users.findIndex((usr) => usr.email === TestData[1].email);
                    const derekIndex = users.findIndex((usr) => usr.email === TestData[5].email);
                    const alexIndex = users.findIndex((usr) => usr.email === TestData[9].email);

                    chai.expect(users[mayimIndex].blueConnections).to.deep
                    .equalInAnyOrder([ 
                        { _id : users[sheldonIndex]._id, 
                            commonKeywords : ["csc209"]},

                        { _id : users[owenIndex]._id,
                            commonKeywords : ["csc209"]} ]);

                    chai.expect(users[sheldonIndex].blueConnections).to.deep
                    .equalInAnyOrder([
                        { _id : users[derekIndex]._id,
                            commonKeywords : ["mat224"]},
                        
                        { _id : users[owenIndex]._id,
                            commonKeywords : ["csc209"]},
                            
                        { _id : users[leonardIndex]._id,
                            commonKeywords : ["phy136"]},

                        { _id : users[mayimIndex]._id,
                            commonKeywords : ["csc209"]} ]);

                    chai.expect(users[owenIndex].blueConnections).to.deep
                    .equalInAnyOrder([
                        { _id : users[alexIndex]._id,
                            commonKeywords : ["mat102"]},
                        
                        { _id : users[sheldonIndex]._id,
                            commonKeywords : ["csc209"]},
                            
                        { _id : users[leonardIndex]._id,
                            commonKeywords : ["mat102", "csc148"]},
                        
                        { _id : users[mayimIndex]._id,
                            commonKeywords : ["csc209"]}]);
    
                } catch (error) {
                    console.log(error);
                }
                done();
            })    
    
        });

        it("Update to add and remove common keyword", (done) => {
            chai.request(SERVER_URL)
            .post('/updateKeywords')
            .set('Content-Type', 'application/json')
            .send({ 
                email :  TestData[7].email,
                keywords : ["POL113", "MAT135", "CSC207"]
            })
            .end(async function(err,res){
                res.should.have.status(201);
                emailList = [];
                for (var i = 0; i < TestData.length; i++){
                    emailList.push(new RegExp("^" + TestData[i].email + "$", "i"));
                }
    
                try {
                    const users = await DB.fetchUsers({ email: { $in: emailList } });
    
                    const baileyIndex = users.findIndex((usr) => usr.email === TestData[7].email);
                    chai.expect(users[baileyIndex].keywords).to.have.members(["pol113", "mat135", "csc207"]);
                    
                    const pennyIndex = users.findIndex((usr) => usr.email === TestData[2].email);
                    const mayimIndex = users.findIndex((usr) => usr.email === TestData[8].email);
                    const derekIndex = users.findIndex((usr) => usr.email === TestData[5].email);

                    chai.expect(users[baileyIndex].blueConnections).to.deep
                    .equalInAnyOrder([ 
                        { _id : users[mayimIndex]._id, 
                            commonKeywords : ["pol113"]} ]);

                    chai.expect(users[mayimIndex].blueConnections).to.deep
                    .equalInAnyOrder([
                        { _id : users[baileyIndex]._id,
                            commonKeywords : ["pol113"]} ]);

                    chai.expect(users[pennyIndex].blueConnections).to.deep
                    .equalInAnyOrder([
                        { _id : users[derekIndex]._id,
                            commonKeywords : ["eco100"]}]);
                    
                } catch (error) {
                    console.log(error);
                }

                done(); 
            });    
    
        });

        it("Update to add another common keyword", (done) => {
            chai.request(SERVER_URL)
            .post('/updateKeywords')
            .set('Content-Type', 'application/json')
            .send({ 
                email :  TestData[1].email,
                keywords : ["PHY136", "MAT102", "CSC148", "LIN101"]
            })
            .end(async function(err,res){
                res.should.have.status(201);
                emailList = [];
                for (var i = 0; i < TestData.length; i++){
                    emailList.push(new RegExp("^" + TestData[i].email + "$", "i"));
                }
    
                try {
                    const users = await DB.fetchUsers({ email: { $in: emailList } });
    
                    const leonardIndex = users.findIndex((usr) => usr.email === TestData[1].email);
                    chai.expect(users[leonardIndex].keywords).to.have.members(["phy136", "mat102", "csc148", "lin101"]);
                    
                    const sheldonIndex = users.findIndex((usr) => usr.email === TestData[0].email);
                    const alexIndex = users.findIndex((usr) => usr.email === TestData[9].email);
                    const owenIndex = users.findIndex((usr) => usr.email === TestData[6].email);
                    const cristinaIndex = users.findIndex((usr) => usr.email === TestData[4].email);
                    const meredithIndex = users.findIndex((usr) => usr.email === TestData[3].email);
                    

                    chai.expect(users[leonardIndex].blueConnections).to.deep
                    .equalInAnyOrder([ 
                        { _id : users[sheldonIndex]._id, 
                            commonKeywords : ["phy136"]},
                        
                        { _id : users[alexIndex]._id, 
                             commonKeywords : ["mat102", "lin101"]},

                        { _id : users[owenIndex]._id, 
                            commonKeywords : ["csc148", "mat102"]} ]);

                    chai.expect(users[alexIndex].blueConnections).to.deep
                    .equalInAnyOrder([ 
                        { _id : users[leonardIndex]._id, 
                            commonKeywords : ["mat102", "lin101"]},
                        
                        { _id : users[cristinaIndex]._id, 
                            commonKeywords : ["phy105"]},
                        
                        { _id : users[meredithIndex]._id, 
                            commonKeywords : ["phy105"]},

                        { _id : users[owenIndex]._id, 
                            commonKeywords : ["mat102"]} ]);      
                    
                } catch (error) {
                    console.log(error);
                }

                done(); 
            });    
    
        });
       
    });
    
    describe("Delete User tests", function() {

        beforeEach((done) => {
            DB.deleteAllUsers().then((value) => {
                var insertCount = 0;
                for (var i = 0; i < TestData.length; i++) {
                    chai.request(SERVER_URL).post("/signup")
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

        it("Deleting user with one connection", (done) => {
            chai.request(SERVER_URL)
            .get(`/deleteUser?email=${TestData[7].email}`)
            .end(async function(err,res){
                res.should.have.status(201);
                emailList = [];
                for (var i = 0; i < TestData.length; i++){
                    emailList.push(new RegExp("^" + TestData[i].email + "$", "i"));
                }
    
                try {
                    const users = await DB.fetchUsers({ email: { $in: emailList } });
    
                    const pennyIndex = users.findIndex((usr) => usr.email === TestData[2].email);
                    const derekIndex = users.findIndex((usr) => usr.email === TestData[5].email);
                    

                    chai.expect(users[pennyIndex].blueConnections).to.deep
                    .equalInAnyOrder([ 
                        { _id : users[derekIndex]._id, 
                            commonKeywords : ["eco100"]} ]);
                    
                } catch (error) {
                    console.log(error);
                }

                done(); 
            });    
    
        });

        it("Deleting user with two connections", (done) => {
            chai.request(SERVER_URL)
            .get(`/deleteUser?email=${TestData[2].email}`)
            .end(async function(err,res){
                res.should.have.status(201);
                emailList = [];
                for (var i = 0; i < TestData.length; i++){
                    emailList.push(new RegExp("^" + TestData[i].email + "$", "i"));
                }
    
                try {
                    const users = await DB.fetchUsers({ email: { $in: emailList } });
    
                    const sheldonIndex = users.findIndex((usr) => usr.email === TestData[0].email);
                    const cristinaIndex = users.findIndex((usr) => usr.email === TestData[4].email);
                    const meredithIndex = users.findIndex((usr) => usr.email === TestData[3].email);
                    const baileyIndex = users.findIndex((usr) => usr.email === TestData[7].email);
                    const derekIndex = users.findIndex((usr) => usr.email === TestData[5].email);
                    
                    chai.expect(users[baileyIndex].blueConnections).to.deep
                    .equalInAnyOrder([]);

                    chai.expect(users[derekIndex].blueConnections).to.deep
                    .equalInAnyOrder([
                        { _id : users[meredithIndex]._id,
                          commonKeywords : ["bio100"]},

                        { _id : users[cristinaIndex]._id,
                          commonKeywords : ["bio100"]},

                        { _id : users[sheldonIndex]._id,
                          commonKeywords : ["mat224"]} ]);
                    
                } catch (error) {
                    console.log(error);
                }

                done(); 
            });    
    
        });
        
    }); 
    
    describe("Block user tests", function () {
        before((done) => {
            DB.deleteAllUsers().then((value) => {
                var insertCount = 0;
                for (var i = 0; i < TestData.length; i++) {
                    chai.request(SERVER_URL).post("/signup")
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
            }); 
        });

        it("Block blue connection", (done) => {

            chai.request(SERVER_URL)
            .get(`/blockUser?src=${TestData[1].email}&target=${TestData[0].email}`)
            .end(async (err, res) => {
                res.should.have.status(201);

                const leonard = (await DB.fetchUsers({ email: TestData[1].email }))[0];
                const sheldon = (await DB.fetchUsers({ email: TestData[0].email }))[0];

                var ids = [];
                for (let i = 0; i < leonard.blueConnections.length; i++) ids.push(leonard.blueConnections[i]._id);

                chai.expect(ids).to.not.include(sheldon._id);

                ids = [];
                for (let i = 0; i < sheldon.blueConnections.length; i++) ids.push(sheldon.blueConnections[i]._id);

                chai.expect(ids).to.not.include(leonard._id);

                done();
            });
        });

    });


    after((done) => {
        DB.deleteAllUsers();
        done();
    });

});
