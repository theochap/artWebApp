// Set the node environment variable to test
process.env.NODE_ENV = "test";

import { User as UserSchema } from "../schema/modelUser";
import { DBVars } from '../services/database.service';
import chai from "chai";
import chaiHttp from "chai-http";
import { app } from '../server';

let should = chai.should();

chai.use(chaiHttp);

// Parent testing block
describe("Users", () => {
    // Before each test, empty the db
    beforeEach((done) => {
        DBVars.users.deleteMany({}, done);
    });

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


});