// Set the node environment variable to test
process.env.NODE_ENV = "test";

import { ConnectToDatabase, DBVars } from '../services/database.service';
import chai from "chai";
import chaiHttp from "chai-http";
import { app } from '../server';
import jwt = require("jwt-simple");
import { Application } from "express";
import { before } from "mocha";
import { CreateTestUser, LoginTestUser, testUser } from "./user";
import { ObjectId } from "mongodb";
import { CreateTestPost, testPost } from "./posts"
import { UserCredentials } from "../schema/modelUser"
import { Posts as PostSchema } from "../schema/modelPosts"
import { Comments as CommentSchema } from "../schema/modelComments"
import HttpStatusCode from '../controllers/common/errorCodes';

let should = chai.should();

var authId: ObjectId
var testPostId: ObjectId
var authToken: string

export async function CreateTestComment(app: Application, user: UserCredentials, content: string, post: ObjectId) {
    const resLogin = await LoginTestUser(app, user);

    authToken = "Bearer " + resLogin.body.token;

    const res = await chai.request(app).post("/comments/").set("Authorization", authToken).send({ content, post })
    res.should.have.status(201)
    return res
}


describe("Comments", () => {
    // connect to the database
    before(() => ConnectToDatabase());

    beforeEach(async () => {
        await DBVars.users.deleteMany({});
        await DBVars.posts.deleteMany({});
        await DBVars.comments.deleteMany({})

        let resUserCreate = await CreateTestUser(app, testUser);
        authId = resUserCreate.body.insertedId
        testPost.authors = [authId]

        let resPostCreate = await CreateTestPost(app, testUser, testPost)
        testPostId = resPostCreate.body.insertedId
    })

    describe("/POST /comments", () => {
        it("Should create a comment when the correct credentials are provided", () => {
            CreateTestComment(app, testUser, "Do agree", testPostId)
        })
        it("Should fail otherwise (schema validation)", async () => {
            const resLogin = await LoginTestUser(app, testUser);

            authToken = "Bearer " + resLogin.body.token;

            const res = await chai.request(app).post("/comments/").set("Authorization", authToken).send({ wrongField: "Hi", post: testPostId })
            res.should.have.status(HttpStatusCode.BAD_REQUEST)
        })
    })

})
