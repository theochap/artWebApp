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
exports.CreateTestReaction = void 0;
// Set the node environment variable to test
process.env.NODE_ENV = "test";
var database_service_1 = require("../services/database.service");
var chai_1 = __importDefault(require("chai"));
var server_1 = require("../server");
var mocha_1 = require("mocha");
var user_test_1 = require("./user.test");
var posts_test_1 = require("./posts.test");
var errorCodes_1 = __importDefault(require("../controllers/common/errorCodes"));
var should = chai_1.default.should();
var authId;
var testPostId;
var authToken;
function CreateTestReaction(app, user, reaction) {
    return __awaiter(this, void 0, void 0, function () {
        var resLogin, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, user_test_1.LoginTestUser)(app, user)];
                case 1:
                    resLogin = _a.sent();
                    authToken = "Bearer " + resLogin.body.token;
                    return [4 /*yield*/, chai_1.default.request(app).post(server_1.Routes.reactions).set("Authorization", authToken).send(reaction)];
                case 2:
                    res = _a.sent();
                    res.should.have.status(201);
                    res.body.should.have.property("acknowledged").eql(true);
                    return [2 /*return*/, res];
            }
        });
    });
}
exports.CreateTestReaction = CreateTestReaction;
describe("Reactions", function () {
    // connect to the database
    (0, mocha_1.before)(function () { return (0, database_service_1.ConnectToDatabase)(); });
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var resUserCreate, resPostCreate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_service_1.DBVars.users.deleteMany({})];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, database_service_1.DBVars.posts.deleteMany({})];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, database_service_1.DBVars.reactions.deleteMany({})];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, user_test_1.CreateTestUser)(server_1.App, user_test_1.TestUser)];
                case 4:
                    resUserCreate = _a.sent();
                    authId = resUserCreate.body.insertedId;
                    posts_test_1.TestPost.authors = [authId];
                    return [4 /*yield*/, (0, posts_test_1.CreateTestPost)(server_1.App, user_test_1.TestUser, posts_test_1.TestPost)];
                case 5:
                    resPostCreate = _a.sent();
                    testPostId = resPostCreate.body.insertedId;
                    return [2 /*return*/];
            }
        });
    }); });
    describe("/POST /reactions", function () {
        it("Should create a reaction when the correct credentials are provided", function () { return __awaiter(void 0, void 0, void 0, function () {
            var parentReaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CreateTestReaction(server_1.App, user_test_1.TestUser, { content: { text: "Do agree" }, post: testPostId })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, CreateTestReaction(server_1.App, user_test_1.TestUser, { content: { emoji: 0x1F603 }, post: testPostId })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, CreateTestReaction(server_1.App, user_test_1.TestUser, { content: { text: "Do agree", emoji: 0x1F603 }, post: testPostId })];
                    case 3:
                        parentReaction = _a.sent();
                        return [4 /*yield*/, CreateTestReaction(server_1.App, user_test_1.TestUser, { content: { text: "I don't" }, post: testPostId, parentReaction: parentReaction.body.insertedId })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should fail otherwise (schema validation)", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resLogin, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, user_test_1.LoginTestUser)(server_1.App, user_test_1.TestUser)];
                    case 1:
                        resLogin = _a.sent();
                        authToken = "Bearer " + resLogin.body.token;
                        return [4 /*yield*/, chai_1.default.request(server_1.App).post(server_1.Routes.reactions).set("Authorization", authToken).send({ wrongField: "Hi", post: testPostId })];
                    case 2:
                        res = _a.sent();
                        res.should.have.status(errorCodes_1.default.BAD_REQUEST);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("/GET/ /reactions", function () {
        it("Should get an empty list at first", function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, chai_1.default.request(server_1.App).get(server_1.Routes.reactions)];
                    case 1:
                        res = _a.sent();
                        res.should.have.status(errorCodes_1.default.ACCEPTED);
                        res.body.should.be.an("array");
                        res.body.length.should.be.eql(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should get the complete list of reactions after they have been created", function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CreateTestReaction(server_1.App, user_test_1.TestUser, { content: { text: "Do agree" }, post: testPostId })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, CreateTestReaction(server_1.App, user_test_1.TestUser, { content: { emoji: 0x1F603 }, post: testPostId })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, CreateTestReaction(server_1.App, user_test_1.TestUser, { content: { text: "Do agree", emoji: 0x1F603 }, post: testPostId })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, chai_1.default.request(server_1.App).get(server_1.Routes.reactions)];
                    case 4:
                        res = _a.sent();
                        res.should.have.status(errorCodes_1.default.ACCEPTED);
                        res.body.should.be.an("array");
                        res.body.length.should.be.eql(3);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should be able to query specifically a given field", function () { return __awaiter(void 0, void 0, void 0, function () {
            var react1, react2, react3, react4, res, jsonParsedQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CreateTestReaction(server_1.App, user_test_1.TestUser, { content: { text: "Do agree" }, post: testPostId })];
                    case 1:
                        react1 = _a.sent();
                        return [4 /*yield*/, CreateTestReaction(server_1.App, user_test_1.TestUser, { content: { emoji: 0x1F603 }, post: testPostId })];
                    case 2:
                        react2 = _a.sent();
                        return [4 /*yield*/, CreateTestReaction(server_1.App, user_test_1.TestUser, { content: { text: "Do agree", emoji: 0x1F603 }, post: testPostId })];
                    case 3:
                        react3 = _a.sent();
                        return [4 /*yield*/, CreateTestReaction(server_1.App, user_test_1.TestUser, { content: { text: "I don't" }, post: testPostId, parentReaction: react3.body.insertedId })];
                    case 4:
                        react4 = _a.sent();
                        return [4 /*yield*/, chai_1.default.request(server_1.App).get(server_1.Routes.reactions).query({ _id: react2.body.insertedId })];
                    case 5:
                        res = _a.sent();
                        res.should.have.status(errorCodes_1.default.ACCEPTED);
                        res.body.should.be.an("array");
                        res.body.length.should.be.eql(1);
                        res.body[0].should.have.property("_id").eql(react2.body.insertedId);
                        return [4 /*yield*/, chai_1.default.request(server_1.App).get(server_1.Routes.reactions).query({ post: testPostId })];
                    case 6:
                        res = _a.sent();
                        res.should.have.status(errorCodes_1.default.ACCEPTED);
                        res.body.should.be.an("array");
                        res.body.length.should.be.eql(4);
                        return [4 /*yield*/, chai_1.default.request(server_1.App).get(server_1.Routes.reactions).query({ parentReaction: react3.body.insertedId })];
                    case 7:
                        res = _a.sent();
                        res.should.have.status(errorCodes_1.default.ACCEPTED);
                        res.body.should.be.an("array");
                        res.body.length.should.be.eql(1);
                        res.body[0].should.have.property("_id").eql(react4.body.insertedId);
                        jsonParsedQuery = JSON.parse('{ "content.emoji": "0x1F603"}');
                        return [4 /*yield*/, chai_1.default.request(server_1.App).get(server_1.Routes.reactions).query(jsonParsedQuery)];
                    case 8:
                        res = _a.sent();
                        res.should.have.status(errorCodes_1.default.ACCEPTED);
                        res.body.should.be.an("array");
                        res.body.length.should.be.eql(2);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("/GET/ /reactions/comments", function () {
        it("Should get a list of comments when queried", function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CreateTestReaction(server_1.App, user_test_1.TestUser, { content: { text: "Do agree" }, post: testPostId })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, CreateTestReaction(server_1.App, user_test_1.TestUser, { content: { emoji: 0x1F603 }, post: testPostId })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, CreateTestReaction(server_1.App, user_test_1.TestUser, { content: { text: "Do agree", emoji: 0x1F603 }, post: testPostId })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, chai_1.default.request(server_1.App).get(server_1.Routes.reactions + server_1.SubRoutes.reactions.comments)];
                    case 4:
                        res = _a.sent();
                        res.should.have.status(errorCodes_1.default.ACCEPTED);
                        res.body.should.be.an("array");
                        res.body.length.should.be.eql(2);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("/GET/ /reactions/emojis", function () {
        it("Should get a list of emojis when queried", function () { return __awaiter(void 0, void 0, void 0, function () {
            var correctGetRes, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CreateTestReaction(server_1.App, user_test_1.TestUser, { content: { text: "Do agree" }, post: testPostId })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, CreateTestReaction(server_1.App, user_test_1.TestUser, { content: { emoji: 0x1F603 }, post: testPostId })];
                    case 2:
                        correctGetRes = _a.sent();
                        return [4 /*yield*/, CreateTestReaction(server_1.App, user_test_1.TestUser, { content: { text: "Do agree" }, post: testPostId })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, chai_1.default.request(server_1.App).get(server_1.Routes.reactions + server_1.SubRoutes.reactions.emojis)];
                    case 4:
                        res = _a.sent();
                        res.should.have.status(errorCodes_1.default.ACCEPTED);
                        res.body.should.be.an("array");
                        res.body.length.should.be.eql(1);
                        res.body[0]._id.should.be.eql(correctGetRes.body.insertedId);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("/PUT/ /reactions/", function () {
        it("Should modify a reaction when queried with the correct parameters", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resLogin, createRes, updateRes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, user_test_1.LoginTestUser)(server_1.App, user_test_1.TestUser)];
                    case 1:
                        resLogin = _a.sent();
                        return [4 /*yield*/, CreateTestReaction(server_1.App, user_test_1.TestUser, { content: { emoji: 0x1F603 }, post: testPostId })];
                    case 2:
                        createRes = _a.sent();
                        authToken = "Bearer " + resLogin.body.token;
                        return [4 /*yield*/, chai_1.default.request(server_1.App).put(server_1.Routes.reactions).set("Authorization", authToken).send({ _id: createRes.body.insertedId, content: { emoji: 0x1F605, text: "Sorry !" } })];
                    case 3:
                        updateRes = _a.sent();
                        updateRes.should.have.status(errorCodes_1.default.CREATED);
                        updateRes.body.should.have.property("modifiedCount").eql(1);
                        updateRes.body.should.have.property("matchedCount").eql(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Shouldn't modify the reaction when queried with the wrong parameters", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resLogin, createRes, updateRes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, user_test_1.LoginTestUser)(server_1.App, user_test_1.TestUser)];
                    case 1:
                        resLogin = _a.sent();
                        return [4 /*yield*/, CreateTestReaction(server_1.App, user_test_1.TestUser, { content: { emoji: 0x1F603 }, post: testPostId })];
                    case 2:
                        createRes = _a.sent();
                        authToken = "Bearer " + resLogin.body.token;
                        return [4 /*yield*/, chai_1.default.request(server_1.App).put(server_1.Routes.reactions).set("Authorization", authToken).send({ _id: createRes.body.insertedId, content: { wrongParam: 0x1F605 } })];
                    case 3:
                        updateRes = _a.sent();
                        updateRes.should.have.status(errorCodes_1.default.BAD_REQUEST);
                        return [4 /*yield*/, chai_1.default.request(server_1.App).put(server_1.Routes.reactions).set("Authorization", authToken).send({ _id: "6227ca3e48e67fc9f2d258d2", content: { emoji: 0x1F605 } })];
                    case 4:
                        updateRes = _a.sent();
                        updateRes.should.have.status(errorCodes_1.default.NOT_FOUND);
                        return [4 /*yield*/, chai_1.default.request(server_1.App).put(server_1.Routes.reactions).set("Authorization", authToken).send({ _id: createRes.body.insertedId, content: { emoji: 0x1F603 } })];
                    case 5:
                        updateRes = _a.sent();
                        updateRes.should.have.status(errorCodes_1.default.NOT_MODIFIED);
                        return [4 /*yield*/, chai_1.default.request(server_1.App).put(server_1.Routes.reactions).send({ _id: createRes.body.insertedId, content: { emoji: 0x1F605, text: "Sorry !" } })];
                    case 6:
                        updateRes = _a.sent();
                        updateRes.should.have.status(errorCodes_1.default.FORBIDDEN);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("/DELETE/ /reactions/", function () {
        it("Should delete a reaction when supplied", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resLogin, createRes, delRes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, user_test_1.LoginTestUser)(server_1.App, user_test_1.TestUser)];
                    case 1:
                        resLogin = _a.sent();
                        return [4 /*yield*/, CreateTestReaction(server_1.App, user_test_1.TestUser, { content: { emoji: 0x1F603 }, post: testPostId })];
                    case 2:
                        createRes = _a.sent();
                        authToken = "Bearer " + resLogin.body.token;
                        return [4 /*yield*/, chai_1.default.request(server_1.App).del(server_1.Routes.reactions).set("Authorization", authToken).send({ _id: createRes.body.insertedId })];
                    case 3:
                        delRes = _a.sent();
                        delRes.should.have.status(errorCodes_1.default.ACCEPTED);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Shouldn't delete a reaction if the wrong parameters are supplied", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resLogin, createRes, delRes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, user_test_1.LoginTestUser)(server_1.App, user_test_1.TestUser)];
                    case 1:
                        resLogin = _a.sent();
                        return [4 /*yield*/, CreateTestReaction(server_1.App, user_test_1.TestUser, { content: { emoji: 0x1F603 }, post: testPostId })];
                    case 2:
                        createRes = _a.sent();
                        authToken = "Bearer " + resLogin.body.token;
                        return [4 /*yield*/, chai_1.default.request(server_1.App).del(server_1.Routes.reactions).set("Authorization", authToken).send({ _id: "6227ca3e48e67fc9f2d258d2" })];
                    case 3:
                        delRes = _a.sent();
                        delRes.should.have.status(errorCodes_1.default.NOT_FOUND);
                        return [4 /*yield*/, chai_1.default.request(server_1.App).del(server_1.Routes.reactions).send({ _id: createRes.body.insertedId })];
                    case 4:
                        delRes = _a.sent();
                        delRes.should.have.status(errorCodes_1.default.FORBIDDEN);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
