// Set the node environment variable to test
process.env.NODE_ENV = "test";

import { User as UserSchema } from "../schema/modelUser";
import { ConnectToDatabase, DBVars } from '../services/database.service';
import chai from "chai";
import chaiHttp from "chai-http";
import { app } from '../server';
import jwt = require("jwt-simple");
import { Request, Response, Application } from "express";
import config from "config";
import { before } from "mocha";

let should = chai.should();

chai.use(chaiHttp);

async function createTestUser(app: Application, user: { email: string, pseudo: string, password: string }) {
    const res = await chai.request(app).post("/users").send(user);
    res.should.have.status(201);
    res.body.should.have.property("id");
    res.body.should.have.property("text").eql("201 Success : User created");
    return res;
}

async function loginTestUser(app: Application, user: { email: string, password: string }) {
    const res = await chai.request(app).post("/users/login").send(user);
    res.should.have.status(200);
    res.body.should.have.property("token");
    return res
}


// Parent testing block
describe("Users", () => {

    // Before each test, connect to the database and empty the db
    before(() => ConnectToDatabase());

    beforeEach(() => DBVars.users.deleteMany({}));

    // Test the GET route
    describe("/GET users", () => {
        it("Sould GET an empty set of users", (done) => {
            chai.request(app).get("/users").end((_, res) => {
                res.should.have.status(200);
                res.should.be.a("object");
                (res.body.returnedData).should.be.a("array");
                (res.body.returnedData).should.have.lengthOf(0);
                done();
            });
        });
    });

    // Test the POST route
    describe("/POST users", () => {
        it("Should not POST a user without a pseudo", done => {
            let user = {
                email: "test@gmail.com",
                password: "test"
            }
            chai.request(app).post("/users").send(user).end((_, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                res.body.text.should.be.eql("Error 400: Bad request");
                done();
            });
        });
        it("Should not POST a user without an email", done => {
            let user = {
                pseudo: "test@gmail.com",
                password: "test"
            }
            chai.request(app).post("/users").send(user).end((_, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                res.body.text.should.be.eql("Error 400: Bad request");
                done();
            });
        });
        it("Should not POST a user without a password", done => {
            let user = {
                email: "test@gmail.com",
                pseudo: "test"
            }
            chai.request(app).post("/users").send(user).end((_, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                res.body.text.should.be.eql("Error 400: Bad request");
                done();
            });
        });
        it("Should POST a correct user otherwise", done => {
            let user = {
                email: "test@gmail.com",
                pseudo: "test",
                password: "test"
            }
            chai.request(app).post("/users").send(user).end((_, res) => {
                res.should.have.status(201);
                res.body.should.have.property("id");
                res.body.should.have.property("text").eql("201 Success : User created")
                done();
            });
        });
        it("Should not be able to POST the same user another time", done => {
            let user = {
                email: "test@gmail.com",
                pseudo: "test",
                password: "test"
            }
            chai.request(app).post("/users").send(user).end((_, res) => {
                res.should.have.status(201);
                res.body.should.have.property("id");
                res.body.should.have.property("text").eql("201 Success : User created")
            });

            chai.request(app).post("/users").send(user).end((_, res) => {
                res.should.have.status(400);
                res.body.should.have.property("error");
                res.body.should.have.property("text").eql("Error 400: Impossible to create a new user");
                done();
            });

        });

    });


    // Test login route
    describe("/POST /users/login", () => {

        it("Should be able to login when the access credentials are well specified", async () => {
            let userDefine = {
                email: "test@gmail.com",
                password: "test",
                pseudo: "test"
            }

            let userLogin = {
                email: "test@gmail.com",
                password: "test"
            }

            const PostRes = await createTestUser(app, userDefine);

            const LoginRes = await chai.request(app).post("/users/login").send(userLogin);

            LoginRes.should.have.status(200);
            LoginRes.body.should.have.property("id").eql(PostRes.body.id);

            const data = { _id: PostRes.body.id };
            const token = jwt.encode(data, config.get("jwt.pass"));

            LoginRes.body.should.have.property("token").eql(token)

        });


        it("Shouldn't be able to login otherwise", async () => {
            let user0 = {
                email: "test@gmail.com",
                password: "test",
                pseudo: "test"
            }

            let user1 = {
                email: "test@gmail.co",
                password: "test"
            };

            let user2 = {
                email: "test@gmail.com",
                password: "test1"
            };
            let user3 = {
                email: "test@gmail.com"
            };

            const postRes = await createTestUser(app, user0);

            let res1 = await chai.request(app).post("/users/login").send(user1);
            res1.should.have.status(404);
            res1.body.should.have.property("text").eql("Error 404: Invalid credentials");

            let res2 = await chai.request(app).post("/users/login").send(user2);
            res2.should.have.status(404);
            res1.body.should.have.property("text").eql("Error 404: Invalid credentials");

            let res3 = await chai.request(app).post("/users/login").send(user3);
            res3.should.have.status(400);
            res3.body.should.have.property("text").eql("Error 400 : Invalid request");

        });

    });

    // Test authentification
    describe("/GET /users/private/auth", () => {
        it("Should execute correctly if the good token is provided", async () => {
            const user = {
                email: "test@gmail.com",
                password: "test",
                pseudo: "test"
            }
            createTestUser(app, user);
            const resLogin = await loginTestUser(app, user);
            const resAuth = await chai.request(app).get("/users/private/auth").set("Authorization", "Bearer " + resLogin.body.token);
            resAuth.should.have.status(203);
        });
        it("Should fail otherwise", async () => {
            const resAuth = await chai.request(app).get("/users/private/auth").set("Authorization", "Bearer ");
            resAuth.should.have.status(403);

        });
    });

    // Test update route
    describe("/PUT /users/private/", () => {
        it("Should be able to update the data of a single user", async () => {
            const user = {
                email: "test@gmail.com",
                password: "test",
                pseudo: "test"
            };

            const userUpdated = {
                email: "newTest@gmail.com",
                password: "newTest",
                pseudo: "newTest",
            };

            createTestUser(app, user);
            const resLogin = await loginTestUser(app, user);
            const resUpdated = await chai.request(app).put("/users/private")
                .set("Authorization", "Bearer " + resLogin.body.token).send(userUpdated);

            resUpdated.should.have.status(201);
            resUpdated.body.should.have.property("result");
            resUpdated.body.result.should.have.property("modifiedCount").eql(1);
            resUpdated.body.result.should.have.property("matchedCount").eql(1);
        });

        it("Shouldn't update the user if one tries to update the id", async () => {
            const user = {
                email: "test@gmail.com",
                password: "test",
                pseudo: "test"
            };

            const userUpdated = {
                _id: "12345"
            };

            createTestUser(app, user);
            const resLogin = await loginTestUser(app, user);
            const resUpdated = await chai.request(app).put("/users/private")
                .set("Authorization", "Bearer " + resLogin.body.token).send(userUpdated);

            resUpdated.should.have.status(401);
        });

        it("Shouldn't update the user with wrong fields", async () => {

        })
    })


});
