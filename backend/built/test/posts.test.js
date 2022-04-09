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
exports.CreateTestPost = exports.TestPost = void 0;
// Set the node environment variable to test
process.env.NODE_ENV = "test";
var database_service_1 = require("../services/database.service");
var chai_1 = __importDefault(require("chai"));
var chai_http_1 = __importDefault(require("chai-http"));
var server_1 = require("../server");
var mocha_1 = require("mocha");
var user_test_1 = require("./user.test");
var user_test_2 = require("./user.test");
var errorCodes_1 = __importDefault(require("../controllers/common/errorCodes"));
var server_2 = require("../server");
var path = require("path");
var should = chai_1.default.should();
var authToken;
var authId;
exports.TestPost = {
    title: "Hello !",
    body: "This is a test",
    authors: new Array(authId),
    fileName: "testImg.jpeg"
};
function CreateTestPost(app, user, post) {
    return __awaiter(this, void 0, void 0, function () {
        var resLogin, req, i, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, user_test_1.LoginTestUser)(app, user)];
                case 1:
                    resLogin = _a.sent();
                    authToken = "Bearer " + resLogin.body.token;
                    req = chai_1.default.request(app).post(server_2.Routes.posts).set("Authorization", authToken).field("title", post.title).field("body", post.body);
                    for (i = 0; i < post.authors.length; i++) {
                        req = req.field("authors[" + i + "]", post.authors[i].toString());
                    }
                    if (post.fileName !== undefined)
                        req = req.attach('file', path.resolve(__dirname, post.fileName));
                    return [4 /*yield*/, req];
                case 2:
                    res = _a.sent();
                    res.should.have.status(201);
                    return [2 /*return*/, res];
            }
        });
    });
}
exports.CreateTestPost = CreateTestPost;
chai_1.default.use(chai_http_1.default);
describe("Posts", function () {
    // connect to the database
    (0, mocha_1.before)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_service_1.ConnectToDatabase)()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    }); }); });
    // wipe out the databases      
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_service_1.DBVars.users.deleteMany({})];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, database_service_1.DBVars.posts.deleteMany({})];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, user_test_1.CreateTestUser)(server_1.App, user_test_2.TestUser)];
                case 3:
                    res = _a.sent();
                    authId = res.body.insertedId;
                    exports.TestPost.authors = new Array(authId);
                    return [2 /*return*/];
            }
        });
    }); });
    describe("/POST /posts", function () {
        it("Should create a post when the correct credentials are provided", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CreateTestPost(server_1.App, user_test_2.TestUser, exports.TestPost)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("Shouldn't create a post otherwise", function () { return __awaiter(void 0, void 0, void 0, function () {
            var postList;
            return __generator(this, function (_a) {
                postList = [{
                        title: "Hello !",
                        body: "This is a test"
                    }, {
                        title: "Hello !",
                        authors: [authId]
                    }, {
                        body: "This is a test",
                        authors: [authId]
                    }];
                postList.forEach(function (post) { return __awaiter(void 0, void 0, void 0, function () {
                    var res;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, chai_1.default.request(server_1.App).post(server_2.Routes.posts).set("Authorization", authToken).send(post)];
                            case 1:
                                res = _a.sent();
                                res.should.have.status(400);
                                res.body.should.have.property("text").eql("Error 400: Invalid format");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
    });
    describe("/GET /posts/", function () {
        it("Should return all the posts when queried without any parameter", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resGetAll;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CreateTestPost(server_1.App, user_test_2.TestUser, exports.TestPost)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, CreateTestPost(server_1.App, user_test_2.TestUser, exports.TestPost)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, chai_1.default.request(server_1.App).get(server_2.Routes.posts)];
                    case 3:
                        resGetAll = _a.sent();
                        resGetAll.should.have.status(errorCodes_1.default.ACCEPTED);
                        resGetAll.body.should.be.a('array');
                        resGetAll.body.should.have.lengthOf(2);
                        resGetAll.body[0].should.have.property("content");
                        resGetAll.body[0].content.should.have.property("size").eql(855878);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should return a correct post representation when queried", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resPost, postId, resGet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CreateTestPost(server_1.App, user_test_2.TestUser, exports.TestPost)];
                    case 1:
                        resPost = _a.sent();
                        postId = resPost.body.insertedId;
                        return [4 /*yield*/, chai_1.default.request(server_1.App).get(server_2.Routes.posts).query({ _id: postId })];
                    case 2:
                        resGet = _a.sent();
                        resGet.should.have.status(errorCodes_1.default.ACCEPTED);
                        resGet.body.should.be.a('array');
                        resGet.body.should.have.lengthOf(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("/PUT /posts/", function () {
        it("Should update the post if correct parameters are supplied", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resPost, updatedPost, resUpdated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CreateTestPost(server_1.App, user_test_2.TestUser, exports.TestPost)];
                    case 1:
                        resPost = _a.sent();
                        updatedPost = {
                            updatedFields: {
                                title: "Hello world!",
                                body: "This is an update test",
                            }, postId: resPost.body.insertedId
                        };
                        return [4 /*yield*/, chai_1.default.request(server_1.App).put(server_2.Routes.posts).set("Authorization", authToken).send(updatedPost)];
                    case 2:
                        resUpdated = _a.sent();
                        resUpdated.should.have.status(201);
                        resUpdated.body.should.have.property("matchedCount").eql(1);
                        resUpdated.body.should.have.property("modifiedCount").eql(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should fail if wrong parameters are supplied (schema validation)", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resPost, updatedFields, updatedPost, resUpdated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CreateTestPost(server_1.App, user_test_2.TestUser, exports.TestPost)];
                    case 1:
                        resPost = _a.sent();
                        updatedFields = {
                            title: "Hello world!",
                            wrongParameter: "This is an update test",
                        };
                        updatedPost = {
                            updatedFields: updatedFields,
                            postId: resPost.body.insertedId
                        };
                        resPost.body.insertedId;
                        return [4 /*yield*/, chai_1.default.request(server_1.App).put(server_2.Routes.posts).set("Authorization", authToken).send(updatedPost)];
                    case 2:
                        resUpdated = _a.sent();
                        resUpdated.should.have.status(400);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should not modify the post if the user is not the author", function () { return __awaiter(void 0, void 0, void 0, function () {
            var newTestUser, resPost, resLogin, updatedPost, resUpdated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newTestUser = { email: "test2@gmail.com", pseudo: "test2", password: "test2" };
                        return [4 /*yield*/, CreateTestPost(server_1.App, user_test_2.TestUser, exports.TestPost)];
                    case 1:
                        resPost = _a.sent();
                        return [4 /*yield*/, (0, user_test_1.CreateTestUser)(server_1.App, newTestUser)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, user_test_1.LoginTestUser)(server_1.App, newTestUser)];
                    case 3:
                        resLogin = _a.sent();
                        updatedPost = {
                            updatedFields: {
                                title: "Hello world!",
                                body: "This is an update test",
                            }, postId: resPost.body.insertedId
                        };
                        return [4 /*yield*/, chai_1.default.request(server_1.App).put(server_2.Routes.posts).set("Authorization", "Bearer " + resLogin.body.token).send(updatedPost)];
                    case 4:
                        resUpdated = _a.sent();
                        resUpdated.should.have.status(404);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("/DELETE /posts/", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            it("Should delete the post when the correct credential is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
                var resPost, resDeleted;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, CreateTestPost(server_1.App, user_test_2.TestUser, exports.TestPost)];
                        case 1:
                            resPost = _a.sent();
                            return [4 /*yield*/, chai_1.default.request(server_1.App).delete(server_2.Routes.posts).set("Authorization", authToken).send({ _id: resPost.body.insertedId })];
                        case 2:
                            resDeleted = _a.sent();
                            resDeleted.should.have.status(200);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Shouldn't delete the post if the user is not the author", function () { return __awaiter(void 0, void 0, void 0, function () {
                var newTestUser, resPost, resLogin, resDeleted;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            newTestUser = { email: "test2@gmail.com", pseudo: "test2", password: "test2" };
                            return [4 /*yield*/, CreateTestPost(server_1.App, user_test_2.TestUser, exports.TestPost)];
                        case 1:
                            resPost = _a.sent();
                            return [4 /*yield*/, (0, user_test_1.CreateTestUser)(server_1.App, newTestUser)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, (0, user_test_1.LoginTestUser)(server_1.App, newTestUser)];
                        case 3:
                            resLogin = _a.sent();
                            return [4 /*yield*/, chai_1.default.request(server_1.App).delete(server_2.Routes.posts).set("Authorization", "Bearer " + resLogin.body.token).send({ _id: resPost.body.insertedId })];
                        case 4:
                            resDeleted = _a.sent();
                            resDeleted.should.have.status(404);
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
    describe("/POST /posts/validate/", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            it("Should validate a post when a user posts a request", function () { return __awaiter(void 0, void 0, void 0, function () {
                var newTestUser, resCreate, newTestUserId, testPost, resPost, _id, resGet, validatePost, resLogin;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            newTestUser = { email: "test2@gmail.com", pseudo: "test2", password: "test2" };
                            return [4 /*yield*/, (0, user_test_1.CreateTestUser)(server_1.App, newTestUser)];
                        case 1:
                            resCreate = _a.sent();
                            newTestUserId = resCreate.body.insertedId;
                            testPost = {
                                title: "Hello !",
                                body: "This is a test",
                                authors: [authId, newTestUserId]
                            };
                            return [4 /*yield*/, CreateTestPost(server_1.App, user_test_2.TestUser, testPost)];
                        case 2:
                            resPost = _a.sent();
                            resPost.should.have.status(201);
                            _id = resPost.body.insertedId;
                            return [4 /*yield*/, chai_1.default.request(server_1.App).get(server_2.Routes.posts).query({ _id: _id })];
                        case 3:
                            resGet = _a.sent();
                            resGet.body[0].should.have.property("validators");
                            resGet.body[0].validators.should.have.a.lengthOf(1);
                            return [4 /*yield*/, chai_1.default.request(server_1.App).post(server_2.Routes.posts + server_1.SubRoutes.posts.validate).set("Authorization", authToken).send({ _id: _id })];
                        case 4:
                            validatePost = _a.sent();
                            validatePost.should.have.status(304);
                            return [4 /*yield*/, (0, user_test_1.LoginTestUser)(server_1.App, newTestUser)];
                        case 5:
                            resLogin = _a.sent();
                            return [4 /*yield*/, chai_1.default.request(server_1.App).post(server_2.Routes.posts + server_1.SubRoutes.posts.validate).set("Authorization", "Bearer " + resLogin.body.token).send({ _id: _id })];
                        case 6:
                            validatePost = _a.sent();
                            validatePost.should.have.status(201);
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
});
