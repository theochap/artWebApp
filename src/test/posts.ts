// Set the node environment variable to test
process.env.NODE_ENV = "test";

import { User as UserSchema, UserCredentials } from "../schema/modelUser";
import { Posts as PostSchema } from "../schema/modelPosts";
import { ConnectToDatabase, DBVars } from '../services/database.service';
import chai from "chai";
import chaiHttp from "chai-http";
import { app } from '../server';
import jwt = require("jwt-simple");
import { Request, Response, Application } from "express";
import config from "config";
import { before } from "mocha";
import { CreateTestUser, LoginTestUser } from "./user";
import { ObjectId } from "mongodb";

let should = chai.should();

var authToken: string
var authId: ObjectId

var testUser: UserCredentials = {
    email: "test@gmail.com",
    pseudo: "test",
    password: "test"
}

var testPost: PostSchema = {
    title: "Hello !",
    body: "This is a test",
    authors: [authId]
};

async function CreateTestPost(app: Application, user: UserCredentials, post: PostSchema): Response {
    const resLogin = await LoginTestUser(app, user);

    authToken = "Bearer " + resLogin.body.token;

    const res = await chai.request(app).post("/posts/").set("Authorization", authToken).send(post)
    res.should.have.status(201)
    return res
}

chai.use(chaiHttp);


describe("Posts", () => {
    // connect to the database
    before(() => ConnectToDatabase());

    // wipe out the databases      
    beforeEach(async () => {
        await DBVars.users.deleteMany({});
        await DBVars.posts.deleteMany({});

        let res = await CreateTestUser(app, testUser);
        authId = res.body.id
        testPost.authors = [authId]
    });

    describe("/POST /posts", () => {
        it("Should create a post when the correct credentials are provided", async () => {
            await CreateTestPost(app, testUser, testPost)
        })

        it("Shouldn't create a post otherwise", async () => {
            let postList: { title?: string, body?: string, authors?: Array<ObjectId> }[] = [{
                title: "Hello !",
                body: "This is a test"
            }, {
                title: "Hello !",
                authors: [authId]
            }, {
                body: "This is a test",
                authors: [authId]
            }];

            postList.forEach(async post => {
                const res = await chai.request(app).post("/posts/").set("Authorization", authToken).send(post)
                res.should.have.status(400)
                res.body.should.have.property("text").eql("Error 400: Invalid format")
            })

        })
    })

    describe("/GET /posts/", () => {
        it("Should return a correct post representation when queried", async () => {
            const resPost = await CreateTestPost(app, testUser, testPost)

            const postId = resPost.body.result.insertedId

            const resGet = await chai.request(app).get("/posts/").query({ _id: postId })
            resGet.should.have.status(200)
            resGet.body.result.should.be.a('array')
            resGet.body.result.should.have.lengthOf(1)
        })

    })

    describe("/PUT /posts/", () => {
        it("Should update the post if correct parameters are supplied", async () => {
            const resPost = await CreateTestPost(app, testUser, testPost)

            let updatedPost = {
                updatedFields: {
                    title: "Hello world!",
                    body: "This is an update test",
                }, postId: resPost.body.result.insertedId
            }


            const resUpdated = await chai.request(app).put("/posts/").set("Authorization", authToken).send(updatedPost)
            resUpdated.should.have.status(201)
            resUpdated.body.should.have.property("result")
            resUpdated.body.result.should.have.property("matchedCount").eql(1)
            resUpdated.body.result.should.have.property("modifiedCount").eql(1)
        })

        it("Should fail if wrong parameters are supplied (schema validation)", async () => {
            const resPost = await CreateTestPost(app, testUser, testPost)

            let updatedFields = {
                title: "Hello world!",
                wrongParameter: "This is an update test",
            }

            let updatedPost = {
                updatedFields, postId: resPost.body.result.insertedId
            }

            resPost.body.result.insertedId

            const resUpdated = await chai.request(app).put("/posts/").set("Authorization", authToken).send(updatedPost)
            resUpdated.should.have.status(400)
        })

        it("Should not modify the post if the user is not the author", async () => {
            const newTestUser = { email: "test2@gmail.com", pseudo: "test2", password: "test2" }
            const resPost = await CreateTestPost(app, testUser, testPost)

            await CreateTestUser(app, newTestUser)
            const resLogin = await LoginTestUser(app, newTestUser)

            const updatedPost = {
                updatedFields: {
                    title: "Hello world!",
                    body: "This is an update test",
                }, postId: resPost.body.result.insertedId
            }

            const resUpdated = await chai.request(app).put("/posts/").set("Authorization", "Bearer " + resLogin.body.token).send(updatedPost)
            resUpdated.should.have.status(404)
        })
    })

    describe("/DELETE /posts/", async () => {
        it("Should delete the post when the correct credential is provided", async () => {
            const resPost = await CreateTestPost(app, testUser, testPost)

            const resDeleted = await chai.request(app).delete("/posts/").set("Authorization", authToken).send({ _id: resPost.body.result.insertedId })
            resDeleted.should.have.status(200)
        })
        it("Shouldn't delete the post if the user is not the author", async () => {
            const newTestUser = { email: "test2@gmail.com", pseudo: "test2", password: "test2" }
            const resPost = await CreateTestPost(app, testUser, testPost)

            await CreateTestUser(app, newTestUser)
            const resLogin = await LoginTestUser(app, newTestUser)

            const resDeleted = await chai.request(app).delete("/posts/").set("Authorization", "Bearer " + resLogin.body.token).send({ _id: resPost.body.result.insertedId })
            resDeleted.should.have.status(404)
        })

    })

    describe("/POST /posts/validate/", async () => {
        it("Should validate a post when a user posts a request", async () => {
            const newTestUser = { email: "test2@gmail.com", pseudo: "test2", password: "test2" }
            const resCreate = await CreateTestUser(app, newTestUser)
            const newTestUserId: ObjectId = resCreate.body.id

            const testPost: PostSchema = {
                title: "Hello !",
                body: "This is a test",
                authors: [authId, newTestUserId]
            };

            const resPost = await CreateTestPost(app, testUser, testPost)
            resPost.should.have.status(201)
            resPost.body.insertedPost.should.have.property("validators")
            resPost.body.insertedPost.validators.should.have.a.lengthOf(1)

            const postId = resPost.body.result.insertedId

            let validatePost = await chai.request(app).post("/posts/validate").set("Authorization", authToken).send({ postId })
            validatePost.should.have.status(304)

            const resLogin = await LoginTestUser(app, newTestUser)

            validatePost = await chai.request(app).post("/posts/validate").set("Authorization", "Bearer " + resLogin.body.token).send({ postId })
            validatePost.should.have.status(201)

        })
    })


})