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
exports.User = void 0;
var database_service_1 = require("../../services/database.service");
var modelUser_1 = require("../../schema/modelUser");
var mongodb_1 = require("mongodb");
var passwordHash = require("password-hash");
var errorCodes_1 = __importDefault(require("../common/errorCodes"));
var jwt = require("jsonwebtoken");
var burl = "localhost:8080";
var User;
(function (User) {
    function AuthTest(req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (req.authData) {
                        return [2 /*return*/, res.status(errorCodes_1.default.ACCEPTED).json(req.authData)];
                    }
                    else {
                        return [2 /*return*/, res.status(errorCodes_1.default.UNAUTHORIZED)
                                .json({
                                error: "Error 403: Bad Request"
                            })];
                    }
                }
                catch (error) {
                    return [2 /*return*/, res.status(errorCodes_1.default.INTERNAL_SERVER_ERROR).json(error)];
                }
                return [2 /*return*/];
            });
        });
    }
    User.AuthTest = AuthTest;
    function Signup(req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, password, pseudo, email, user, userObject, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, password = _a.password, pseudo = _a.pseudo, email = _a.email;
                        if (!email || !password || !pseudo) {
                            // email, password or pseudo empty
                            return [2 /*return*/, res.status(errorCodes_1.default.BAD_REQUEST).json({
                                    error: "Error 400: Bad request",
                                })];
                        }
                        user = new modelUser_1.User(pseudo, email, passwordHash.generate(password));
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_service_1.DBVars.users.insertOne(user)];
                    case 2:
                        userObject = _b.sent();
                        res.location("http://" + burl + "/users/" + userObject.insertedId);
                        return [2 /*return*/, res.status(errorCodes_1.default.CREATED).json(userObject)];
                    case 3:
                        error_1 = _b.sent();
                        return [2 /*return*/, res.status(errorCodes_1.default.BAD_REQUEST).json({ error: error_1 })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    User.Signup = Signup;
    function Follow(req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _id, updateRes, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _id = new mongodb_1.ObjectId(req.body._id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_service_1.DBVars.users.updateOne({ _id: req.authData._id }, { $push: { follows: _id } })];
                    case 2:
                        updateRes = _a.sent();
                        if (updateRes.matchedCount == 0) {
                            return [2 /*return*/, res.status(errorCodes_1.default.NOT_FOUND).json({ error: "User not found" })];
                        }
                        else if (updateRes.modifiedCount == 0) {
                            return [2 /*return*/, res.status(errorCodes_1.default.NOT_MODIFIED).json({ error: "Ressource not modified" })];
                        }
                        else if (updateRes.acknowledged == false) {
                            return [2 /*return*/, res.status(errorCodes_1.default.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" })];
                        }
                        else {
                            return [2 /*return*/, res.status(errorCodes_1.default.CREATED).json(updateRes)];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        return [2 /*return*/, res.status(errorCodes_1.default.BAD_REQUEST).json({ error: error_2 })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    User.Follow = Follow;
    function UnFollow(req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _id, updateRes, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _id = new mongodb_1.ObjectId(req.body._id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_service_1.DBVars.users.updateOne({ _id: req.authData._id }, { $pull: { follows: _id } })];
                    case 2:
                        updateRes = _a.sent();
                        if (updateRes.matchedCount == 0) {
                            return [2 /*return*/, res.status(errorCodes_1.default.NOT_FOUND).json({ error: "User not found" })];
                        }
                        else if (updateRes.modifiedCount == 0) {
                            return [2 /*return*/, res.status(errorCodes_1.default.NOT_MODIFIED).json({ error: "Ressource not modified" })];
                        }
                        else if (updateRes.acknowledged == false) {
                            return [2 /*return*/, res.status(errorCodes_1.default.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" })];
                        }
                        else {
                            return [2 /*return*/, res.status(errorCodes_1.default.ACCEPTED).json(updateRes)];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        return [2 /*return*/, res.status(errorCodes_1.default.BAD_REQUEST).json({ error: error_3 })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    User.UnFollow = UnFollow;
    function Login(req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, password, email, findUserDoc, findUser, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, password = _a.password, email = _a.email;
                        if (!email || !password) {
                            return [2 /*return*/, res.status(400).json({
                                    error: "Error 400 : Invalid request",
                                })];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_service_1.DBVars.users.findOne({ email: email })];
                    case 2:
                        findUserDoc = _b.sent();
                        findUser = new modelUser_1.User(findUserDoc.pseudo, findUserDoc.email, findUserDoc.password, new Date(), findUserDoc._id);
                        if (!findUser.authenticate(password)) {
                            throw new Error("Can't authenticate");
                        }
                        return [2 /*return*/, res.status(errorCodes_1.default.ACCEPTED).json({
                                token: findUser.getToken(),
                                id: findUser._id,
                            })];
                    case 3:
                        error_4 = _b.sent();
                        return [2 /*return*/, res.status(errorCodes_1.default.NOT_FOUND).json({
                                error: error_4,
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    User.Login = Login;
    function Del(req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, delPosts, delUser, delUser, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.authData._id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        if (!("deleteData" in req.body && req.body.deleteData == 1)) return [3 /*break*/, 6];
                        return [4 /*yield*/, database_service_1.DBVars.posts.deleteMany({ "authors._id": id, authors: { $size: 1 } }, { retryWrites: true })];
                    case 2:
                        delPosts = _a.sent();
                        return [4 /*yield*/, database_service_1.DBVars.posts.updateMany({ "authors._id": id }, { $pull: { authors: { _id: id } } }, { retryWrites: true })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, database_service_1.DBVars.reactions.deleteMany({ author: id }, { retryWrites: true })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, database_service_1.DBVars.users.deleteOne({ _id: id })];
                    case 5:
                        delUser = _a.sent();
                        if (delUser.acknowledged && delUser.deletedCount == 0) {
                            return [2 /*return*/, res.status(errorCodes_1.default.NOT_FOUND).json({
                                    error: "Error 404: the user to delete has not been found"
                                })];
                        }
                        return [2 /*return*/, res
                                .status(errorCodes_1.default.ACCEPTED)
                                .json({
                                deletedUser: delUser,
                                deletedData: delPosts
                            })];
                    case 6: return [4 /*yield*/, database_service_1.DBVars.users.deleteOne({ _id: id })];
                    case 7:
                        delUser = _a.sent();
                        if (delUser.deletedCount == 0) {
                            return [2 /*return*/, res.status(errorCodes_1.default.NOT_FOUND).json({
                                    error: "Error 404: the user to delete has not been found"
                                })];
                        }
                        return [2 /*return*/, res
                                .status(errorCodes_1.default.ACCEPTED)
                                .json(delUser)];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [2 /*return*/, res
                                .status(errorCodes_1.default.INTERNAL_SERVER_ERROR)
                                .json({
                                error: err_1,
                            })];
                    case 10: return [2 /*return*/];
                }
            });
        });
    }
    User.Del = Del;
    function Get(req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var reqParams, returnedData, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reqParams = req.query;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        if ("_id" in reqParams)
                            reqParams._id = new mongodb_1.ObjectId(req.query._id);
                        if ("follows" in reqParams)
                            reqParams.follows = new mongodb_1.ObjectId(req.query.follows);
                        return [4 /*yield*/, database_service_1.DBVars.users.find(reqParams, { projection: { _id: 1, pseudo: 1, email: 1, lastPosts: 1, timestamp: 1, follows: 1 }, }).toArray()];
                    case 2:
                        returnedData = _a.sent();
                        return [2 /*return*/, res.status(200)
                                .json(returnedData)];
                    case 3:
                        err_2 = _a.sent();
                        return [2 /*return*/, res.status(400)
                                .json({
                                error: err_2,
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    User.Get = Get;
    function Put(req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, updatedValues, result, userData, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.authData._id;
                        updatedValues = req.body;
                        if ("password" in req.body)
                            updatedValues.password = passwordHash.generate(req.body.password);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_service_1.DBVars.users.updateOne({ _id: id }, { $set: updatedValues })];
                    case 2:
                        result = _a.sent();
                        if (result.matchedCount == 0) {
                            return [2 /*return*/, res.status(errorCodes_1.default.NOT_FOUND).json(result)];
                        }
                        else if (result.modifiedCount == 0) {
                            return [2 /*return*/, res.status(errorCodes_1.default.NOT_MODIFIED).json({
                                    error: "Status 304: Ressource not modified"
                                })];
                        }
                        userData = "<http://" + burl + "/users/" + id + ">; rel='data'; method='GET'";
                        return [2 /*return*/, res.status(errorCodes_1.default.CREATED).header("Link", userData).json(result)];
                    case 3:
                        err_3 = _a.sent();
                        return [2 /*return*/, res
                                .status(400)
                                .json({
                                error: err_3,
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    User.Put = Put;
})(User = exports.User || (exports.User = {}));
