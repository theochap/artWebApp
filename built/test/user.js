"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Set the node environment variable to test
process.env.NODE_ENV = "test";
var database_service_1 = require("../services/database.service");
var chai_1 = __importDefault(require("chai"));
var chai_http_1 = __importDefault(require("chai-http"));
var server_1 = require("../server");
var should = chai_1.default.should();
chai_1.default.use(chai_http_1.default);
// Parent testing block
describe("Users", function () {
    // Before each test, empty the db
    beforeEach(function (done) {
        database_service_1.DBVars.users.deleteMany({}, done);
    });
    // Test the GET route
    describe("/GET users", function () {
        it("Sould GET an empty set of users", function (done) {
            chai_1.default.request(server_1.app).get("/users").end(function (_, res) {
                res.should.have.status(200);
                res.should.be.a("object");
                (res.body.returnedData).should.be.a("array");
                (res.body.returnedData).should.have.lengthOf(0);
                done();
            });
        });
    });
    // Test the POST route
    describe("/POST users", function () {
        it("Should not POST a user without a pseudo", function (done) {
            var user = {
                email: "test@gmail.com",
                password: "test"
            };
            chai_1.default.request(server_1.app).post("/users").send(user).end(function (_, res) {
                res.should.have.status(400);
                res.body.should.be.a("object");
                res.body.text.should.be.eql("Error 400: Bad request");
                done();
            });
        });
        it("Should not POST a user without an email", function (done) {
            var user = {
                pseudo: "test@gmail.com",
                password: "test"
            };
            chai_1.default.request(server_1.app).post("/users").send(user).end(function (_, res) {
                res.should.have.status(400);
                res.body.should.be.a("object");
                res.body.text.should.be.eql("Error 400: Bad request");
                done();
            });
        });
        it("Should not POST a user without a password", function (done) {
            var user = {
                email: "test@gmail.com",
                pseudo: "test"
            };
            chai_1.default.request(server_1.app).post("/users").send(user).end(function (_, res) {
                res.should.have.status(400);
                res.body.should.be.a("object");
                res.body.text.should.be.eql("Error 400: Bad request");
                done();
            });
        });
        it("Should POST a correct user otherwise", function (done) {
            var user = {
                email: "test@gmail.com",
                pseudo: "test",
                password: "test"
            };
            chai_1.default.request(server_1.app).post("/users").send(user).end(function (_, res) {
                res.should.have.status(201);
                res.body.should.have.property("id");
                res.body.should.have.property("text").eql("201 Success : User created");
                done();
            });
        });
        it("Should not be able to POST the same user another time", function (done) {
            var user = {
                email: "test@gmail.com",
                pseudo: "test",
                password: "test"
            };
            chai_1.default.request(server_1.app).post("/users").send(user).end(function (_, res) {
                res.should.have.status(201);
                res.body.should.have.property("id");
                res.body.should.have.property("text").eql("201 Success : User created");
            });
            chai_1.default.request(server_1.app).post("/users").send(user).end(function (_, res) {
                res.should.have.status(400);
                res.body.should.have.property("error");
                res.body.should.have.property("text").eql("Error 400: Impossible to create a new user");
                done();
            });
        });
    });
});
