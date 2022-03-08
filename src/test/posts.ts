// Set the node environment variable to test
process.env.NODE_ENV = "test";

import { UserCredentials } from "../schema/modelUser";
import { Posts as PostSchema } from "../schema/modelPosts";
import { ConnectToDatabase, DBVars } from '../services/database.service';
import chai from "chai";
import chaiHttp from "chai-http";
import { App, SubRoutes } from '../server';
import { Application } from "express";
import { before } from "mocha";
import { CreateTestUser, LoginTestUser } from "./user";
import { ObjectId } from "mongodb";
import { TestUser } from "./user"
import HttpStatusCode from "../controllers/common/errorCodes";
import { Routes } from "../server"

let should = chai.should();

var authToken: string
var authId: ObjectId

export const TestPost: PostSchema = {
    title: "Hello !",
    body: "This is a test",
    authors: [authId]
};

export async function CreateTestPost(app: Application, user: UserCredentials, post: PostSchema) {
    const resLogin = await LoginTestUser(app, user);

    authToken = "Bearer " + resLogin.body.token;

    const res = await chai.request(app).post(Routes.posts).set("Authorization", authToken).send(post)
    res.should.have.status(201)
    return res
}

chai.use(chaiHttp);


describe("Posts", () => {
    // connect to the database
    before(async () => { await ConnectToDatabase() });

    // wipe out the databases      
    beforeEach(async () => {
        await DBVars.users.deleteMany({});
        await DBVars.posts.deleteMany({});

        let res = await CreateTestUser(App, TestUser);
        authId = res.body.insertedId
        TestPost.authors = [authId]
    });

    describe("/POST /posts", () => {
        it("Should create a post when the correct credentials are provided", async () => {
            await CreateTestPost(App, TestUser, TestPost)
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
                const res = await chai.request(App).post(Routes.posts).set("Authorization", authToken).send(post)
                res.should.have.status(400)
                res.body.should.have.property("text").eql("Error 400: Invalid format")
            })

        })
    })

    describe("/GET /posts/", () => {
        it("Should return all the posts when queried without any parameter", async () => {
            await CreateTestPost(App, TestUser, TestPost)
            await CreateTestPost(App, TestUser, TestPost)

            const resGetAll = await chai.request(App).get(Routes.posts)
            resGetAll.should.have.status(HttpStatusCode.ACCEPTED)
            resGetAll.body.should.be.a('array')
            resGetAll.body.should.have.lengthOf(2)
        })


        it("Should return a correct post representation when queried", async () => {
            const resPost = await CreateTestPost(App, TestUser, TestPost)

            const postId = resPost.body.insertedId

            const resGet = await chai.request(App).get(Routes.posts).query({ _id: postId })
            resGet.should.have.status(HttpStatusCode.ACCEPTED)
            resGet.body.should.be.a('array')
            resGet.body.should.have.lengthOf(1)


        })

    })

    describe("/PUT /posts/", () => {
        it("Should update the post if correct parameters are supplied", async () => {
            const resPost = await CreateTestPost(App, TestUser, TestPost)

            let updatedPost = {
                updatedFields: {
                    title: "Hello world!",
                    body: "This is an update test",
                }, postId: resPost.body.insertedId
            }


            const resUpdated = await chai.request(App).put(Routes.posts).set("Authorization", authToken).send(updatedPost)
            resUpdated.should.have.status(201)
            resUpdated.body.should.have.property("matchedCount").eql(1)
            resUpdated.body.should.have.property("modifiedCount").eql(1)
        })

        it("Should fail if wrong parameters are supplied (schema validation)", async () => {
            const resPost = await CreateTestPost(App, TestUser, TestPost)

            let updatedFields = {
                title: "Hello world!",
                wrongParameter: "This is an update test",
            }

            let updatedPost = {
                updatedFields, postId: resPost.body.insertedId
            }

            resPost.body.insertedId

            const resUpdated = await chai.request(App).put(Routes.posts).set("Authorization", authToken).send(updatedPost)
            resUpdated.should.have.status(400)
        })

        it("Should not modify the post if the user is not the author", async () => {
            const newTestUser = { email: "test2@gmail.com", pseudo: "test2", password: "test2" }
            const resPost = await CreateTestPost(App, TestUser, TestPost)

            await CreateTestUser(App, newTestUser)
            const resLogin = await LoginTestUser(App, newTestUser)

            const updatedPost = {
                updatedFields: {
                    title: "Hello world!",
                    body: "This is an update test",
                }, postId: resPost.body.insertedId
            }

            const resUpdated = await chai.request(App).put(Routes.posts).set("Authorization", "Bearer " + resLogin.body.token).send(updatedPost)
            resUpdated.should.have.status(404)
        })
    })

    describe("/DELETE /posts/", async () => {
        it("Should delete the post when the correct credential is provided", async () => {
            const resPost = await CreateTestPost(App, TestUser, TestPost)

            const resDeleted = await chai.request(App).delete(Routes.posts).set("Authorization", authToken).send({ _id: resPost.body.insertedId })
            resDeleted.should.have.status(200)
        })
        it("Shouldn't delete the post if the user is not the author", async () => {
            const newTestUser = { email: "test2@gmail.com", pseudo: "test2", password: "test2" }
            const resPost = await CreateTestPost(App, TestUser, TestPost)

            await CreateTestUser(App, newTestUser)
            const resLogin = await LoginTestUser(App, newTestUser)

            const resDeleted = await chai.request(App).delete(Routes.posts).set("Authorization", "Bearer " + resLogin.body.token).send({ _id: resPost.body.insertedId })
            resDeleted.should.have.status(404)
        })

    })

    describe("/POST /posts/validate/", async () => {
        it("Should validate a post when a user posts a request", async () => {
            const newTestUser = { email: "test2@gmail.com", pseudo: "test2", password: "test2" }
            const resCreate = await CreateTestUser(App, newTestUser)
            const newTestUserId: ObjectId = resCreate.body.insertedId

            const testPost: PostSchema = {
                title: "Hello !",
                body: "This is a test",
                authors: [authId, newTestUserId]
            };

            const resPost = await CreateTestPost(App, TestUser, testPost)
            resPost.should.have.status(201)

            const _id = resPost.body.insertedId

            const resGet = await chai.request(App).get(Routes.posts).query({ _id: _id })
            resGet.body[0].should.have.property("validators")
            resGet.body[0].validators.should.have.a.lengthOf(1)


            let validatePost = await chai.request(App).post(Routes.posts + SubRoutes.posts.validate).set("Authorization", authToken).send({ _id })
            validatePost.should.have.status(304)

            const resLogin = await LoginTestUser(App, newTestUser)

            validatePost = await chai.request(App).post(Routes.posts + SubRoutes.posts.validate).set("Authorization", "Bearer " + resLogin.body.token).send({ _id })
            validatePost.should.have.status(201)

        })
    })


})