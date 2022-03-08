// Set the node environment variable to test
process.env.NODE_ENV = "test";

import { ConnectToDatabase, DBVars } from '../services/database.service';
import chai from "chai";
import chaiHttp from "chai-http";
import { App, Routes, SubRoutes } from '../server';
import jwt = require("jwt-simple");
import { Application } from "express";
import { before } from "mocha";
import { CreateTestUser, LoginTestUser, TestUser } from "./user";
import { ObjectId } from "mongodb";
import { CreateTestPost, TestPost } from "./posts"
import { UserCredentials } from "../schema/modelUser"
import { Posts as PostSchema } from "../schema/modelPosts"
import { Reactions } from '../controllers/reactions/lib';
import HttpStatusCode from '../controllers/common/errorCodes';

let should = chai.should();

var authId: ObjectId
var testPostId: ObjectId
var authToken: string

export async function CreateTestReaction(app: Application, user: UserCredentials, reaction: Reactions.Request.Add) {
    const resLogin = await LoginTestUser(app, user);

    authToken = "Bearer " + resLogin.body.token;

    const res = await chai.request(app).post(Routes.reactions).set("Authorization", authToken).send(reaction)
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

        let resUserCreate = await CreateTestUser(App, TestUser);
        authId = resUserCreate.body.insertedId
        TestPost.authors = [authId]

        let resPostCreate = await CreateTestPost(App, TestUser, TestPost)
        testPostId = resPostCreate.body.insertedId
    })

    describe("/POST /reactions", () => {
        it("Should create a reaction when the correct credentials are provided", async () => {
            await CreateTestReaction(App, TestUser, { content: { text: "Do agree" }, post: testPostId })
            await CreateTestReaction(App, TestUser, { content: { emoji: 0x1F603 }, post: testPostId })
            await CreateTestReaction(App, TestUser, { content: { text: "Do agree", emoji: 0x1F603 }, post: testPostId })

        })
        it("Should fail otherwise (schema validation)", async () => {
            const resLogin = await LoginTestUser(App, TestUser);

            authToken = "Bearer " + resLogin.body.token;

            const res = await chai.request(App).post(Routes.reactions).set("Authorization", authToken).send({ wrongField: "Hi", post: testPostId })
            res.should.have.status(HttpStatusCode.BAD_REQUEST)
        })
    })

    describe("/GET/ /reactions", () => {
        it("Should get an empty list at first", async () => {
            const res = await chai.request(App).get(Routes.reactions)
            res.should.have.status(HttpStatusCode.ACCEPTED)
            res.body.should.be.an("array")
            res.body.length.should.be.eql(0)

        })

        it("Should get the complete list of reactions after they have been created", async () => {
            await CreateTestReaction(App, TestUser, { content: { text: "Do agree" }, post: testPostId })
            await CreateTestReaction(App, TestUser, { content: { emoji: 0x1F603 }, post: testPostId })
            await CreateTestReaction(App, TestUser, { content: { text: "Do agree", emoji: 0x1F603 }, post: testPostId })

            const res = await chai.request(App).get(Routes.reactions)

            res.should.have.status(HttpStatusCode.ACCEPTED)
            res.body.should.be.an("array")
            res.body.length.should.be.eql(3)
        })
    })

    describe("/GET/ /reactions/comments", () => {
        it("Should get a list of comments when queried", async () => {
            await CreateTestReaction(App, TestUser, { content: { text: "Do agree" }, post: testPostId })
            await CreateTestReaction(App, TestUser, { content: { emoji: 0x1F603 }, post: testPostId })
            await CreateTestReaction(App, TestUser, { content: { text: "Do agree", emoji: 0x1F603 }, post: testPostId })

            const res = await chai.request(App).get(Routes.reactions + SubRoutes.reactions.comments)

            res.should.have.status(HttpStatusCode.ACCEPTED)
            res.body.should.be.an("array")
            res.body.length.should.be.eql(2)
        })
    })

    describe("/GET/ /reactions/emojis", () => {
        it("Should get a list of emojis when queried", async () => {
            await CreateTestReaction(App, TestUser, { content: { text: "Do agree" }, post: testPostId })
            await CreateTestReaction(App, TestUser, { content: { emoji: 0x1F603 }, post: testPostId })
            await CreateTestReaction(App, TestUser, { content: { text: "Do agree" }, post: testPostId })

            const res = await chai.request(App).get(Routes.reactions + SubRoutes.reactions.emojis)

            res.should.have.status(HttpStatusCode.ACCEPTED)
            res.body.should.be.an("array")
            res.body.length.should.be.eql(1)
        })
    })






})
