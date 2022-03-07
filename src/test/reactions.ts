// Set the node environment variable to test
process.env.NODE_ENV = "test";

import { ConnectToDatabase, DBVars } from '../services/database.service';
import chai from "chai";
import chaiHttp from "chai-http";
import { app, Routes } from '../server';
import jwt = require("jwt-simple");
import { Application } from "express";
import { before } from "mocha";
import { CreateTestUser, LoginTestUser, testUser } from "./user";
import { ObjectId } from "mongodb";
import { CreateTestPost, testPost } from "./posts"
import { UserCredentials } from "../schema/modelUser"
import { Posts as PostSchema } from "../schema/modelPosts"
import { ReactionContent, Comments as CommentSchema } from "../schema/modelReactions"
import HttpStatusCode from '../controllers/common/errorCodes';

let should = chai.should();

var authId: ObjectId
var testPostId: ObjectId
var authToken: string

export async function CreateTestReaction(app: Application, user: UserCredentials, content: ReactionContent, post: ObjectId) {
    const resLogin = await LoginTestUser(app, user);

    authToken = "Bearer " + resLogin.body.token;

    const res = await chai.request(app).post(Routes.reactions).set("Authorization", authToken).send({ content: content, post })
    res.should.have.status(201)
    res.body.should.have.property("acknowledged").eql(true)
    return res
}


describe("Reactions", () => {
    // connect to the database
    before(() => ConnectToDatabase());

    beforeEach(async () => {
        await DBVars.users.deleteMany({});
        await DBVars.posts.deleteMany({});
        await DBVars.reactions.deleteMany({})

        let resUserCreate = await CreateTestUser(app, testUser);
        authId = resUserCreate.body.insertedId
        testPost.authors = [authId]

        let resPostCreate = await CreateTestPost(app, testUser, testPost)
        testPostId = resPostCreate.body.insertedId
    })

    describe("/POST /reactions", () => {
        it("Should create a comment when the correct credentials are provided", async () => {
            await CreateTestReaction(app, testUser, { text: "Do agree" }, testPostId)
            await CreateTestReaction(app, testUser, { emoji: 0x1F603 }, testPostId)
            await CreateTestReaction(app, testUser, { text: "Do agree", emoji: 0x1F603 }, testPostId)

        })
        it("Should fail otherwise (schema validation)", async () => {
            const resLogin = await LoginTestUser(app, testUser);

            authToken = "Bearer " + resLogin.body.token;

            const res = await chai.request(app).post(Routes.reactions).set("Authorization", authToken).send({ wrongField: "Hi", post: testPostId })
            res.should.have.status(HttpStatusCode.BAD_REQUEST)
        })
    })

    describe("/GET/ /reactions", () => {
        it("Should get an empty list at first", async () => {
            const res = await chai.request(app).get(Routes.reactions)

            res.should.have.status(HttpStatusCode.ACCEPTED)
            res.body.should.be.an("array")
            res.body.length.should.be.eql(0)

        })

        it("Should get the complete list of comments after they have been created", async () => {
            await CreateTestReaction(app, testUser, { text: "Do agree" }, testPostId)
            await CreateTestReaction(app, testUser, { emoji: 0x1F603 }, testPostId)
            await CreateTestReaction(app, testUser, { text: "Do agree", emoji: 0x1F603 }, testPostId)

            const res = await chai.request(app).get(Routes.reactions)

            res.should.have.status(HttpStatusCode.ACCEPTED)
            res.body.should.be.an("array")
            res.body.length.should.be.eql(3)
        })

    })






})
