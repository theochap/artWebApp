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
import { CreateTestUser, LoginTestUser } from "./user";
import { doesNotMatch } from "assert";
import { ObjectId } from "mongodb";

let should = chai.should();

var authToken: string
var authId: string

chai.use(chaiHttp);

describe("Posts", () => {
    // connect to the database
    before(() => ConnectToDatabase());

    // wipe out the databases      
    beforeEach(async () => {
        await DBVars.users.deleteMany({});
        await DBVars.posts.deleteMany({});

        let user = {
            email: "test@gmail.com",
            password: "test",
            pseudo: "test"
        };

        await CreateTestUser(app, user);

        const resLogin = await LoginTestUser(app, user);

        authToken = "Bearer " + resLogin.body.token;
        authId = resLogin.body.id

    });

    describe("/POST /posts", () => {
        it("Should create a post when the correct credentials are provided", async () => {
            let authors: Array<string> = [authId];

            let post = {
                title: "Hello !",
                body: "This is a test",
                authors: authors
            };

            const res = await chai.request(app).post("/posts/private").set("Authorization", authToken).send(post)
            res.should.have.status(201)
            res.body.should.have.property("status").eql("Status 201: Post created")
        })
        it("Shouldn't create a post otherwise", async () => {
            let authors: Array<string> = [authId];

            let postList: { title?: string, body?: string, authors?: Array<string> }[] = [{
                title: "Hello !",
                body: "This is a test"
            }, {
                title: "Hello !",
                authors: authors
            }, {
                body: "This is a test",
                authors: authors
            }];

            postList.forEach(async post => {
                const res = await chai.request(app).post("/posts/private").set("Authorization", authToken).send(post)
                res.should.have.status(400)
                res.body.should.have.property("text").eql("Error 400: Invalid format")
            })

        })
    })
})