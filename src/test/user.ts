// Set the node environment variable to test
process.env.NODE_ENV = "test";

import { User as UserSchema, UserCredentials } from "../schema/modelUser";
import { ConnectToDatabase, DBVars } from '../services/database.service';
import chai from "chai";
import chaiHttp from "chai-http";
import { app } from '../server';
import jwt = require("jwt-simple");
import { Application } from "express";
import config from "config";
import { before } from "mocha";
import { Posts } from "../schema/modelPosts";
import { CreateTestPost } from "./posts";
import { InsertOneResult } from "mongodb";
import { Error } from "../controllers/common/routesTypes"

let should = chai.should();

chai.use(chaiHttp);

export const testUser: UserCredentials = {
    email: "test@gmail.com",
    password: "test",
    pseudo: "test"
}

export async function CreateTestUser(app: Application, user: { email: string, pseudo: string, password: string }) {
    const res = await chai.request(app).post("/users").send(user);
    res.should.have.status(201);
    res.body.should.have.property("insertedId");
    return res;
}

export async function LoginTestUser(app: Application, user: { email: string, password: string }) {
    const res = await chai.request(app).post("/users/login").send(user);
    res.should.have.status(202);
    res.body.should.have.property("token");
    return res
}


// Parent testing block
describe("Users", () => {

    // Before each test, connect to the database and empty the db
    before(async () => { await ConnectToDatabase() });

    beforeEach(async () => {
        await DBVars.users.deleteMany({})
        await DBVars.posts.deleteMany({})
    });

    // Test the GET route to verify that the database was well emptied
    describe("/GET users void", () => {
        it("Should initially GET an empty set of users", (done) => {
            chai.request(app).get("/users").end((_, res) => {
                res.should.have.status(200);
                res.should.be.a("object");
                res.body.should.be.a("array");
                res.body.should.have.lengthOf(0);
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
                done();
            });
        });
        it("Should POST a correct user otherwise", done => {
            CreateTestUser(app, testUser)
            done()
        });

        it("Should not be able to POST the same user another time", async () => {

            await CreateTestUser(app, testUser)

            const res = await chai.request(app).post("/users").send(testUser)
            res.should.have.status(400);
            res.body.should.have.property("error");
        });
    });


    // Test user getter
    describe("/GET /users/", () => {
        it("Should be able to retrieve the user by id correctly", async () => {

            let userCreated = await CreateTestUser(app, testUser);

            let resGet = await chai.request(app).get("/users/").query({ _id: userCreated.body.id })
            resGet.should.have.status(200)
            resGet.body.should.be.a("array");
            resGet.body.should.have.lengthOf(1)
            resGet.body[0].should.have.property('email').eql("test@gmail.com")
            resGet.body[0].should.have.property('pseudo').eql("test")
        });
        it("Should be able to retrieve the user by another property correctly", async () => {

            let userCreated = await CreateTestUser(app, testUser);

            let resGet = await chai.request(app).get("/users/").query({ email: testUser.email })
            resGet.should.have.status(200)
            resGet.body.should.be.a("array");
            resGet.body.should.have.lengthOf(1)
            resGet.body[0].should.have.property('email').eql("test@gmail.com")
            resGet.body[0].should.have.property('pseudo').eql("test")

            resGet = await chai.request(app).get("/users/").query({ pseudo: testUser.pseudo })
            resGet.should.have.status(200)
            resGet.body.should.be.a("array");
            resGet.body.should.have.lengthOf(1)
            resGet.body[0].should.have.property('email').eql("test@gmail.com")
            resGet.body[0].should.have.property('pseudo').eql("test")

        })

        it("Should fail otherwise", async () => {

            let userCreated = await CreateTestUser(app, testUser);

            let resGet = await chai.request(app).get("/users/").query({ email: "falsemail" })
            resGet.should.have.status(200)
            resGet.body.should.be.a("array");
            resGet.body.should.have.lengthOf(0)

        });
    });


    // Test login route
    describe("/POST /users/login", () => {

        it("Should be able to login when the access credentials are well specified", async () => {

            let userLogin = {
                email: "test@gmail.com",
                password: "test"
            }

            const PostRes = await CreateTestUser(app, testUser);

            const LoginRes = await chai.request(app).post("/users/login").send(userLogin);

            LoginRes.should.have.status(202);
            LoginRes.body.should.have.property("id").eql(PostRes.body.insertedId);

            const data = { _id: PostRes.body.insertedId };
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

            const postRes = await CreateTestUser(app, user0);

            let res1 = await chai.request(app).post("/users/login").send(user1);
            res1.should.have.status(404);

            let res2 = await chai.request(app).post("/users/login").send(user2);
            res2.should.have.status(404);

            let res3 = await chai.request(app).post("/users/login").send(user3);
            res3.should.have.status(400);

        });

    });

    // Test authentification
    describe("/GET /users/auth", () => {
        it("Should execute correctly if the good token is provided", async () => {
            CreateTestUser(app, testUser);
            const resLogin = await LoginTestUser(app, testUser);
            const resAuth = await chai.request(app).get("/users/auth").set("Authorization", "Bearer " + resLogin.body.token);
            resAuth.should.have.status(202);
        });
        it("Should fail otherwise", async () => {
            const resAuth = await chai.request(app).get("/users/auth").set("Authorization", "Bearer ");
            resAuth.should.have.status(403);

        });
    });

    // Test update route
    describe("/PUT /users/", () => {
        it("Should be able to update the data of a single user", async () => {

            const userUpdated: UserCredentials = {
                email: "newTest@gmail.com",
                password: "newTest",
                pseudo: "newTest",
            };

            CreateTestUser(app, testUser);
            const resLogin = await LoginTestUser(app, testUser);
            const resUpdated = await chai.request(app).put("/users/")
                .set("Authorization", "Bearer " + resLogin.body.token).send(userUpdated);

            resUpdated.should.have.status(201);
            resUpdated.body.should.have.property("modifiedCount").eql(1);
            resUpdated.body.should.have.property("matchedCount").eql(1);
        });

        it("Shouldn't update the user if one tries to update the id", async () => {

            const userUpdated = {
                _id: "12345"
            };

            CreateTestUser(app, testUser);
            const resLogin = await LoginTestUser(app, testUser);
            const resUpdated = await chai.request(app).put("/users/")
                .set("Authorization", "Bearer " + resLogin.body.token).send(userUpdated);

            resUpdated.should.have.status(400);
        });

        it("Shouldn't update the user with wrong fields", async () => {

            const userUpdated = {
                wrongField: "12345"
            };

            CreateTestUser(app, testUser);
            const resLogin = await LoginTestUser(app, testUser);
            const resUpdated = await chai.request(app).put("/users/")
                .set("Authorization", "Bearer " + resLogin.body.token).send(userUpdated);

            resUpdated.should.have.status(400);
            resUpdated.body.should.have.property("error")
            resUpdated.body.error.should.have.property("code").eql(121)
        });


    });

    describe("/DELETE /users/", () => {
        let resLogin
        let resCreatePost1
        let resCreatePost2

        beforeEach(async () => {
            const testUser2: UserCredentials = {
                email: "test2@gmail.com",
                password: "test2",
                pseudo: "test2",
            }

            const resCreateUser1 = await CreateTestUser(app, testUser);

            const resCreateUser2 = await CreateTestUser(app, testUser2)

            const idUser1 = resCreateUser1.body.insertedId
            const idUser2 = resCreateUser2.body.insertedId

            resLogin = await LoginTestUser(app, testUser)

            const testPost1: Posts = {
                title: "Hello",
                body: "Hello",
                authors: [idUser1, idUser2]
            }
            const testPost2: Posts = {
                title: "Hello",
                body: "Hello",
                authors: [idUser1]
            }

            resCreatePost1 = await CreateTestPost(app, testUser, testPost1)
            resCreatePost2 = await CreateTestPost(app, testUser, testPost2)

        })

        it("Should only delete the user if deletePosts is not defined", async () => {
            const resDelete = await chai.request(app).delete("/users/").set("Authorization", "Bearer " + resLogin.body.token)
            resDelete.should.have.status(202)

            const resFind = await chai.request(app).get("/posts/").query({})
            resFind.body.should.have.lengthOf(2)
        })

        it("Should also delete the posts created by the user, and update the others when deletePost is set to one", async () => {
            const resDelete = await chai.request(app).delete("/users/").set("Authorization", "Bearer " + resLogin.body.token).send({ deletePosts: 1 })
            resDelete.should.have.status(202)

            const resFind = await chai.request(app).get("/posts/").query({})
            resFind.body.should.have.lengthOf(1)
        })
    })


});
