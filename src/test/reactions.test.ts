// Set the node environment variable to test
process.env.NODE_ENV = "test";

import { ConnectToDatabase, DBVars } from '../services/database.service';
import chai from "chai";
import chaiHttp from "chai-http";
import { App, Routes, SubRoutes } from '../server';
import jwt = require("jwt-simple");
import { Application } from "express";
import { before } from "mocha";
import { CreateTestUser, LoginTestUser, TestUser } from "./user.test";
import { ObjectId } from "mongodb";
import { CreateTestPost, TestPost } from "./posts.test"
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
            const parentReaction = await CreateTestReaction(App, TestUser, { content: { text: "Do agree", emoji: 0x1F603 }, post: testPostId })
            await CreateTestReaction(App, TestUser, { content: { text: "I don't" }, post: testPostId, parentReaction: parentReaction.body.insertedId })
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

        it("Should be able to query specifically a given field", async () => {
            const react1 = await CreateTestReaction(App, TestUser, { content: { text: "Do agree" }, post: testPostId })
            const react2 = await CreateTestReaction(App, TestUser, { content: { emoji: 0x1F603 }, post: testPostId })
            const react3 = await CreateTestReaction(App, TestUser, { content: { text: "Do agree", emoji: 0x1F603 }, post: testPostId })
            const react4 = await CreateTestReaction(App, TestUser, { content: { text: "I don't" }, post: testPostId, parentReaction: react3.body.insertedId })

            let res = await chai.request(App).get(Routes.reactions).query({ _id: react2.body.insertedId })
            res.should.have.status(HttpStatusCode.ACCEPTED)
            res.body.should.be.an("array")
            res.body.length.should.be.eql(1)
            res.body[0].should.have.property("_id").eql(react2.body.insertedId)

            res = await chai.request(App).get(Routes.reactions).query({ post: testPostId })
            res.should.have.status(HttpStatusCode.ACCEPTED)
            res.body.should.be.an("array")
            res.body.length.should.be.eql(4)

            res = await chai.request(App).get(Routes.reactions).query({ parentReaction: react3.body.insertedId })
            res.should.have.status(HttpStatusCode.ACCEPTED)
            res.body.should.be.an("array")
            res.body.length.should.be.eql(1)
            res.body[0].should.have.property("_id").eql(react4.body.insertedId)

            const jsonParsedQuery = JSON.parse('{ "content.emoji": "0x1F603"}')
            res = await chai.request(App).get(Routes.reactions).query(jsonParsedQuery)
            res.should.have.status(HttpStatusCode.ACCEPTED)
            res.body.should.be.an("array")
            res.body.length.should.be.eql(2)
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
            const correctGetRes = await CreateTestReaction(App, TestUser, { content: { emoji: 0x1F603 }, post: testPostId })
            await CreateTestReaction(App, TestUser, { content: { text: "Do agree" }, post: testPostId })

            const res = await chai.request(App).get(Routes.reactions + SubRoutes.reactions.emojis)

            res.should.have.status(HttpStatusCode.ACCEPTED)
            res.body.should.be.an("array")
            res.body.length.should.be.eql(1)
            res.body[0]._id.should.be.eql(correctGetRes.body.insertedId)
        })
    })

    describe("/PUT/ /reactions/", () => {
        it("Should modify a reaction when queried with the correct parameters", async () => {
            const resLogin = await LoginTestUser(App, TestUser);
            const createRes = await CreateTestReaction(App, TestUser, { content: { emoji: 0x1F603 }, post: testPostId })

            authToken = "Bearer " + resLogin.body.token;

            const updateRes = await chai.request(App).put(Routes.reactions).set("Authorization", authToken).send({ _id: createRes.body.insertedId, content: { emoji: 0x1F605, text: "Sorry !" } })

            updateRes.should.have.status(HttpStatusCode.CREATED)
            updateRes.body.should.have.property("modifiedCount").eql(1)
            updateRes.body.should.have.property("matchedCount").eql(1)
        })

        it("Shouldn't modify the reaction when queried with the wrong parameters", async () => {
            const resLogin = await LoginTestUser(App, TestUser);
            const createRes = await CreateTestReaction(App, TestUser, { content: { emoji: 0x1F603 }, post: testPostId })
            authToken = "Bearer " + resLogin.body.token;

            let updateRes = await chai.request(App).put(Routes.reactions).set("Authorization", authToken).send({ _id: createRes.body.insertedId, content: { wrongParam: 0x1F605 } })
            updateRes.should.have.status(HttpStatusCode.BAD_REQUEST)

            updateRes = await chai.request(App).put(Routes.reactions).set("Authorization", authToken).send({ _id: "6227ca3e48e67fc9f2d258d2", content: { emoji: 0x1F605 } })
            updateRes.should.have.status(HttpStatusCode.NOT_FOUND)

            updateRes = await chai.request(App).put(Routes.reactions).set("Authorization", authToken).send({ _id: createRes.body.insertedId, content: { emoji: 0x1F603 } })
            updateRes.should.have.status(HttpStatusCode.NOT_MODIFIED)

            updateRes = await chai.request(App).put(Routes.reactions).send({ _id: createRes.body.insertedId, content: { emoji: 0x1F605, text: "Sorry !" } })
            updateRes.should.have.status(HttpStatusCode.FORBIDDEN)
        })
    })

    describe("/DELETE/ /reactions/", () => {
        it("Should delete a reaction when supplied", async () => {
            const resLogin = await LoginTestUser(App, TestUser);
            const createRes = await CreateTestReaction(App, TestUser, { content: { emoji: 0x1F603 }, post: testPostId })
            authToken = "Bearer " + resLogin.body.token;

            let delRes = await chai.request(App).del(Routes.reactions).set("Authorization", authToken).send({ _id: createRes.body.insertedId })
            delRes.should.have.status(HttpStatusCode.ACCEPTED)
        })
        it("Shouldn't delete a reaction if the wrong parameters are supplied", async () => {
            const resLogin = await LoginTestUser(App, TestUser);
            const createRes = await CreateTestReaction(App, TestUser, { content: { emoji: 0x1F603 }, post: testPostId })
            authToken = "Bearer " + resLogin.body.token;

            let delRes = await chai.request(App).del(Routes.reactions).set("Authorization", authToken).send({ _id: "6227ca3e48e67fc9f2d258d2" })
            delRes.should.have.status(HttpStatusCode.NOT_FOUND)

            delRes = await chai.request(App).del(Routes.reactions).send({ _id: createRes.body.insertedId })
            delRes.should.have.status(HttpStatusCode.FORBIDDEN)
        })
    })


})
