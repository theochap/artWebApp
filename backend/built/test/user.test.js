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
exports.LoginTestUser = exports.CreateTestUser = exports.TestUser2 = exports.TestUser = void 0;
// Set the node environment variable to test
process.env.NODE_ENV = "test";
var database_service_1 = require("../services/database.service");
var chai_1 = __importDefault(require("chai"));
var chai_http_1 = __importDefault(require("chai-http"));
var server_1 = require("../server");
var jwt = require("jwt-simple");
var config_1 = __importDefault(require("config"));
var mocha_1 = require("mocha");
var posts_test_1 = require("./posts.test");
var errorCodes_1 = __importDefault(require("../controllers/common/errorCodes"));
var should = chai_1.default.should();
chai_1.default.use(chai_http_1.default);
exports.TestUser = {
    email: "test@gmail.com",
    password: "test",
    pseudo: "test"
};
exports.TestUser2 = {
    email: "test2@gmail.com",
    password: "test2",
    pseudo: "test2"
};
function CreateTestUser(app, user) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai_1.default.request(app).post(server_1.Routes.users).send(user)];
                case 1:
                    res = _a.sent();
                    res.should.have.status(201);
                    res.body.should.have.property("insertedId");
                    return [2 /*return*/, res];
            }
        });
    });
}
exports.CreateTestUser = CreateTestUser;
function LoginTestUser(app, user) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chai_1.default.request(app).post(server_1.Routes.users + server_1.SubRoutes.users.login).send(user)];
                case 1:
                    res = _a.sent();
                    res.should.have.status(202);
                    res.body.should.have.property("token");
                    return [2 /*return*/, res];
            }
        });
    });
}
exports.LoginTestUser = LoginTestUser;
// Parent testing block
describe("Users", function () {
    // Before each test, connect to the database and empty the db
    (0, mocha_1.before)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_service_1.ConnectToDatabase)()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    }); }); });
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_service_1.DBVars.users.deleteMany({})];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, database_service_1.DBVars.posts.deleteMany({})];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // Test the GET route to verify that the database was well emptied
    describe("/GET users void", function () {
        it("Should initially GET an empty set of users", function (done) {
            chai_1.default.request(server_1.App).get(server_1.Routes.users).end(function (_, res) {
                res.should.have.status(200);
                res.should.be.a("object");
                res.body.should.be.a("array");
                res.body.should.have.lengthOf(0);
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
            chai_1.default.request(server_1.App).post(server_1.Routes.users).send(user).end(function (_, res) {
                res.should.have.status(400);
                done();
            });
        });
        it("Should not POST a user without an email", function (done) {
            var user = {
                pseudo: "test@gmail.com",
                password: "test"
            };
            chai_1.default.request(server_1.App).post(server_1.Routes.users).send(user).end(function (_, res) {
                res.should.have.status(400);
                done();
            });
        });
        it("Should not POST a user without a password", function (done) {
            var user = {
                email: "test@gmail.com",
                pseudo: "test"
            };
            chai_1.default.request(server_1.App).post(server_1.Routes.users).send(user).end(function (_, res) {
                res.should.have.status(400);
                done();
            });
        });
        it("Should POST a correct user otherwise", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CreateTestUser(server_1.App, exports.TestUser)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should not be able to POST the same user another time", function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CreateTestUser(server_1.App, exports.TestUser)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, chai_1.default.request(server_1.App).post(server_1.Routes.users).send(exports.TestUser)];
                    case 2:
                        res = _a.sent();
                        res.should.have.status(400);
                        res.body.should.have.property("error");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // Test user getter
    describe("/GET /users/", function () {
        it("Should return all the users when queried without any parameter", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resGet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CreateTestUser(server_1.App, exports.TestUser)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, CreateTestUser(server_1.App, {
                                email: "test2@gmail.com",
                                password: "test2",
                                pseudo: "test2"
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, chai_1.default.request(server_1.App).get(server_1.Routes.users)];
                    case 3:
                        resGet = _a.sent();
                        resGet.should.have.status(200);
                        resGet.body.should.be.a("array");
                        resGet.body.should.have.lengthOf(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should be able to retrieve the user by id correctly", function () { return __awaiter(void 0, void 0, void 0, function () {
            var userCreated, resGet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CreateTestUser(server_1.App, exports.TestUser)];
                    case 1:
                        userCreated = _a.sent();
                        return [4 /*yield*/, chai_1.default.request(server_1.App).get(server_1.Routes.users).query({ _id: userCreated.body.id })];
                    case 2:
                        resGet = _a.sent();
                        resGet.should.have.status(200);
                        resGet.body.should.be.a("array");
                        resGet.body.should.have.lengthOf(1);
                        resGet.body[0].should.have.property('email').eql("test@gmail.com");
                        resGet.body[0].should.have.property('pseudo').eql("test");
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should be able to retrieve the user by another property correctly", function () { return __awaiter(void 0, void 0, void 0, function () {
            var userCreated, resGet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CreateTestUser(server_1.App, exports.TestUser)];
                    case 1:
                        userCreated = _a.sent();
                        return [4 /*yield*/, chai_1.default.request(server_1.App).get(server_1.Routes.users).query({ email: exports.TestUser.email })];
                    case 2:
                        resGet = _a.sent();
                        resGet.should.have.status(200);
                        resGet.body.should.be.a("array");
                        resGet.body.should.have.lengthOf(1);
                        resGet.body[0].should.have.property('email').eql("test@gmail.com");
                        resGet.body[0].should.have.property('pseudo').eql("test");
                        return [4 /*yield*/, chai_1.default.request(server_1.App).get(server_1.Routes.users).query({ pseudo: exports.TestUser.pseudo })];
                    case 3:
                        resGet = _a.sent();
                        resGet.should.have.status(200);
                        resGet.body.should.be.a("array");
                        resGet.body.should.have.lengthOf(1);
                        resGet.body[0].should.have.property('email').eql("test@gmail.com");
                        resGet.body[0].should.have.property('pseudo').eql("test");
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should fail otherwise", function () { return __awaiter(void 0, void 0, void 0, function () {
            var userCreated, resGet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CreateTestUser(server_1.App, exports.TestUser)];
                    case 1:
                        userCreated = _a.sent();
                        return [4 /*yield*/, chai_1.default.request(server_1.App).get(server_1.Routes.users).query({ email: "falsemail" })];
                    case 2:
                        resGet = _a.sent();
                        resGet.should.have.status(200);
                        resGet.body.should.be.a("array");
                        resGet.body.should.have.lengthOf(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // Test login route
    describe("/POST /users/login", function () {
        it("Should be able to login when the access credentials are well specified", function () { return __awaiter(void 0, void 0, void 0, function () {
            var userLogin, PostRes, LoginRes, data, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userLogin = {
                            email: "test@gmail.com",
                            password: "test"
                        };
                        return [4 /*yield*/, CreateTestUser(server_1.App, exports.TestUser)];
                    case 1:
                        PostRes = _a.sent();
                        return [4 /*yield*/, chai_1.default.request(server_1.App).post(server_1.Routes.users + server_1.SubRoutes.users.login).send(userLogin)];
                    case 2:
                        LoginRes = _a.sent();
                        LoginRes.should.have.status(202);
                        LoginRes.body.should.have.property("id").eql(PostRes.body.insertedId);
                        data = { _id: PostRes.body.insertedId };
                        token = jwt.encode(data, config_1.default.get("jwt.pass"));
                        LoginRes.body.should.have.property("token").eql(token);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Shouldn't be able to login otherwise", function () { return __awaiter(void 0, void 0, void 0, function () {
            var user0, user1, user2, user3, postRes, res1, res2, res3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user0 = {
                            email: "test@gmail.com",
                            password: "test",
                            pseudo: "test"
                        };
                        user1 = {
                            email: "test@gmail.co",
                            password: "test"
                        };
                        user2 = {
                            email: "test@gmail.com",
                            password: "test1"
                        };
                        user3 = {
                            email: "test@gmail.com"
                        };
                        return [4 /*yield*/, CreateTestUser(server_1.App, user0)];
                    case 1:
                        postRes = _a.sent();
                        return [4 /*yield*/, chai_1.default.request(server_1.App).post(server_1.Routes.users + server_1.SubRoutes.users.login).send(user1)];
                    case 2:
                        res1 = _a.sent();
                        res1.should.have.status(404);
                        return [4 /*yield*/, chai_1.default.request(server_1.App).post(server_1.Routes.users + server_1.SubRoutes.users.login).send(user2)];
                    case 3:
                        res2 = _a.sent();
                        res2.should.have.status(404);
                        return [4 /*yield*/, chai_1.default.request(server_1.App).post(server_1.Routes.users + server_1.SubRoutes.users.login).send(user3)];
                    case 4:
                        res3 = _a.sent();
                        res3.should.have.status(400);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // Test authentification
    describe("/GET /users/auth", function () {
        it("Should execute correctly if the good token is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resLogin, resAuth;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        CreateTestUser(server_1.App, exports.TestUser);
                        return [4 /*yield*/, LoginTestUser(server_1.App, exports.TestUser)];
                    case 1:
                        resLogin = _a.sent();
                        return [4 /*yield*/, chai_1.default.request(server_1.App).get(server_1.Routes.users + server_1.SubRoutes.users.auth).set("Authorization", "Bearer " + resLogin.body.token)];
                    case 2:
                        resAuth = _a.sent();
                        resAuth.should.have.status(202);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should fail otherwise", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resAuth;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, chai_1.default.request(server_1.App).get(server_1.Routes.users + server_1.SubRoutes.users.auth).set("Authorization", "Bearer ")];
                    case 1:
                        resAuth = _a.sent();
                        resAuth.should.have.status(403);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // Test update route
    describe("/PUT /users/", function () {
        it("Should be able to update the data of a single user", function () {
            var usersUpdated = [{
                    email: "newTest@gmail.com",
                    password: "newTest",
                    pseudo: "newTest",
                }, {
                    password: "newTest2"
                }, {
                    email: "newTest2@gmail.com"
                }, {
                    pseudo: "newTest2",
                }];
            usersUpdated.forEach(function (userUpdated) { return __awaiter(void 0, void 0, void 0, function () {
                var resLogin, resUpdated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            CreateTestUser(server_1.App, exports.TestUser);
                            return [4 /*yield*/, LoginTestUser(server_1.App, exports.TestUser)];
                        case 1:
                            resLogin = _a.sent();
                            return [4 /*yield*/, chai_1.default.request(server_1.App).put(server_1.Routes.users)
                                    .set("Authorization", "Bearer " + resLogin.body.token).send(userUpdated)];
                        case 2:
                            resUpdated = _a.sent();
                            resUpdated.should.have.status(201);
                            resUpdated.body.should.have.property("modifiedCount").eql(1);
                            resUpdated.body.should.have.property("matchedCount").eql(1);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it("Shouldn't update the user if one tries to update the id", function () { return __awaiter(void 0, void 0, void 0, function () {
            var userUpdated, resLogin, resUpdated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userUpdated = {
                            _id: "12345"
                        };
                        CreateTestUser(server_1.App, exports.TestUser);
                        return [4 /*yield*/, LoginTestUser(server_1.App, exports.TestUser)];
                    case 1:
                        resLogin = _a.sent();
                        return [4 /*yield*/, chai_1.default.request(server_1.App).put(server_1.Routes.users)
                                .set("Authorization", "Bearer " + resLogin.body.token).send(userUpdated)];
                    case 2:
                        resUpdated = _a.sent();
                        resUpdated.should.have.status(400);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Shouldn't update the user with wrong fields", function () { return __awaiter(void 0, void 0, void 0, function () {
            var userUpdated, resLogin, resUpdated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userUpdated = {
                            wrongField: "12345"
                        };
                        CreateTestUser(server_1.App, exports.TestUser);
                        return [4 /*yield*/, LoginTestUser(server_1.App, exports.TestUser)];
                    case 1:
                        resLogin = _a.sent();
                        return [4 /*yield*/, chai_1.default.request(server_1.App).put(server_1.Routes.users)
                                .set("Authorization", "Bearer " + resLogin.body.token).send(userUpdated)];
                    case 2:
                        resUpdated = _a.sent();
                        resUpdated.should.have.status(400);
                        resUpdated.body.should.have.property("error");
                        resUpdated.body.error.should.have.property("code").eql(121);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("/DELETE /users/", function () {
        var resLogin;
        var resCreatePost1;
        var resCreatePost2;
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            var testUser2, resCreateUser1, resCreateUser2, idUser1, idUser2, testPost1, testPost2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testUser2 = {
                            email: "test2@gmail.com",
                            password: "test2",
                            pseudo: "test2",
                        };
                        return [4 /*yield*/, CreateTestUser(server_1.App, exports.TestUser)];
                    case 1:
                        resCreateUser1 = _a.sent();
                        return [4 /*yield*/, CreateTestUser(server_1.App, testUser2)];
                    case 2:
                        resCreateUser2 = _a.sent();
                        idUser1 = resCreateUser1.body.insertedId;
                        idUser2 = resCreateUser2.body.insertedId;
                        return [4 /*yield*/, LoginTestUser(server_1.App, exports.TestUser)];
                    case 3:
                        resLogin = _a.sent();
                        testPost1 = {
                            title: "Hello",
                            body: "Hello",
                            authors: [idUser1, idUser2]
                        };
                        testPost2 = {
                            title: "Hello",
                            body: "Hello",
                            authors: [idUser1]
                        };
                        return [4 /*yield*/, (0, posts_test_1.CreateTestPost)(server_1.App, exports.TestUser, testPost1)];
                    case 4:
                        resCreatePost1 = _a.sent();
                        return [4 /*yield*/, (0, posts_test_1.CreateTestPost)(server_1.App, exports.TestUser, testPost2)];
                    case 5:
                        resCreatePost2 = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should only delete the user if deletePosts is not defined", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resDelete, resFind;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, chai_1.default.request(server_1.App).delete(server_1.Routes.users).set("Authorization", "Bearer " + resLogin.body.token)];
                    case 1:
                        resDelete = _a.sent();
                        resDelete.should.have.status(202);
                        return [4 /*yield*/, chai_1.default.request(server_1.App).get(server_1.Routes.posts).query({})];
                    case 2:
                        resFind = _a.sent();
                        resFind.body.should.have.lengthOf(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Should also delete the posts created by the user, and update the others when deleteData is set to one", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resDelete, resFind;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, chai_1.default.request(server_1.App).delete(server_1.Routes.users).set("Authorization", "Bearer " + resLogin.body.token).send({ deleteData: 1 })];
                    case 1:
                        resDelete = _a.sent();
                        resDelete.should.have.status(202);
                        return [4 /*yield*/, chai_1.default.request(server_1.App).get(server_1.Routes.posts).query({})];
                    case 2:
                        resFind = _a.sent();
                        resFind.body.should.have.lengthOf(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("POST " + server_1.SubRoutes.users.follow, function () {
        it("Should add a follow when user credentials are correctly provided", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resCreateUser2, resLogin, resFollow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CreateTestUser(server_1.App, exports.TestUser)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, CreateTestUser(server_1.App, exports.TestUser2)];
                    case 2:
                        resCreateUser2 = _a.sent();
                        return [4 /*yield*/, LoginTestUser(server_1.App, exports.TestUser)];
                    case 3:
                        resLogin = _a.sent();
                        return [4 /*yield*/, chai_1.default.request(server_1.App).post(server_1.Routes.users + server_1.SubRoutes.users.follow).set("Authorization", "Bearer " + resLogin.body.token).send({ _id: resCreateUser2.body.insertedId })];
                    case 4:
                        resFollow = _a.sent();
                        resFollow.should.have.status(errorCodes_1.default.CREATED);
                        resFollow.body.should.have.property("matchedCount").eql(1);
                        resFollow.body.should.have.property("modifiedCount").eql(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("DELETE " + server_1.SubRoutes.users.follow, function () {
        it("Should delete a follow when specified", function () { return __awaiter(void 0, void 0, void 0, function () {
            var resCreateUser2, resLogin, resCreateFollow, resDelFollow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CreateTestUser(server_1.App, exports.TestUser)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, CreateTestUser(server_1.App, exports.TestUser2)];
                    case 2:
                        resCreateUser2 = _a.sent();
                        return [4 /*yield*/, LoginTestUser(server_1.App, exports.TestUser)];
                    case 3:
                        resLogin = _a.sent();
                        return [4 /*yield*/, chai_1.default.request(server_1.App).post(server_1.Routes.users + server_1.SubRoutes.users.follow).set("Authorization", "Bearer " + resLogin.body.token).send({ _id: resCreateUser2.body.insertedId })];
                    case 4:
                        resCreateFollow = _a.sent();
                        resCreateFollow.should.have.status(errorCodes_1.default.CREATED);
                        resCreateFollow.body.should.have.property("acknowledged").eql(true);
                        resCreateFollow.body.should.have.property("matchedCount").eql(1);
                        resCreateFollow.body.should.have.property("modifiedCount").eql(1);
                        return [4 /*yield*/, chai_1.default.request(server_1.App).delete(server_1.Routes.users + server_1.SubRoutes.users.follow).set("Authorization", "Bearer " + resLogin.body.token).send({ _id: resCreateUser2.body.insertedId })];
                    case 5:
                        resDelFollow = _a.sent();
                        resDelFollow.should.have.status(errorCodes_1.default.ACCEPTED);
                        resDelFollow.body.should.have.property("acknowledged").eql(true);
                        resCreateFollow.body.should.have.property("matchedCount").eql(1);
                        resCreateFollow.body.should.have.property("modifiedCount").eql(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
