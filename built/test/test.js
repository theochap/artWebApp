"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var database_service_1 = require("../services/database.service");
var chai_1 = __importDefault(require("chai"));
var chai_http_1 = __importDefault(require("chai-http"));
var server_1 = require("../server");
// Set the node environment variable to test
process.env.NODE_ENV = "test";
chai_1.default.use(chai_http_1.default);
// Parent testing block
describe("Users", function () {
    // Before each test, empty the db
    beforeEach(function (done) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            database_service_1.DBVars.users.deleteMany({}, done);
            return [2 /*return*/];
        });
    }); });
    // Test the GET route
    describe("/GET users", function () {
        it("Sould GET an empty set of users", function (done) {
            chai_1.default.request(server_1.app).get("/users").end(function (_, res) {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.returnedData.should.be.a("array");
                res.body.returnedData.length.should.be.eql(0);
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
                res.body.text.should.have.property("text").eql("201 Success : User created");
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
                res.should.have.status(400);
                res.body.should.have.property("error");
                res.body.should.have.property("text").eql("Error 400: Impossible to create a new user");
                done();
            });
        });
    });
});
