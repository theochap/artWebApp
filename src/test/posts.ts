// Set the node environment variable to test
process.env.NODE_ENV = "test";

import { User as UserSchema, UserCredentials } from "../schema/modelUser";
import { Posts as PostSchema } from "../controllers/post/lib";
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
var authId: string

var testUser: UserCredentials = {
    email: "test@gmail.com",
    pseudo: "test",
    password: "test"
}

var testPost = {
    title: "Hello !",
    body: "This is a test",
    authors: [authId]
};

async function CreateTestPost(app: Application, user: UserCredentials, post: PostSchema): Response {
    const resLogin = await LoginTestUser(app, user);

    authToken = "Bearer " + resLogin.body.token;

    const res = await chai.request(app).post("/posts/private").set("Authorization", authToken).send(post)
    res.should.have.status(201)
    res.body.should.have.property("status").eql("Status 201: Post created")
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
            let postList: { title?: string, body?: string, authors?: Array<string> }[] = [{
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
                const res = await chai.request(app).post("/posts/private").set("Authorization", authToken).send(post)
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
})