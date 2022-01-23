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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var database_service_1 = require("../../services/database.service");
var modelUser_1 = require("../../schema/modelUser");
var mongodb_1 = require("mongodb");
var passwordHash = require("password-hash");
var jwt = require("jsonwebtoken");
var burl = "localhost:8080";
var User = /** @class */ (function () {
    function User() {
    }
    User.authTest = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (req.authData) {
                    return [2 /*return*/, res.status(203).json({ text: "Status 200: Access Authorized", data: req.authData })];
                }
                else {
                    return [2 /*return*/, res.status(400)
                            .json({
                            error: "Error 400: Bad Request"
                        })];
                }
                return [2 /*return*/];
            });
        });
    };
    User.signup = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, password, pseudo, email, user, userObject, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, password = _a.password, pseudo = _a.pseudo, email = _a.email;
                        if (!email || !password || !pseudo) {
                            // email, password or pseudo empty
                            return [2 /*return*/, res.status(400).json({
                                    text: "Error 400: Bad request",
                                })];
                        }
                        user = {
                            email: email,
                            pseudo: pseudo,
                            password: passwordHash.generate(password),
                            toConfirm: []
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_service_1.DBVars.users.insertOne(user)];
                    case 2:
                        userObject = _b.sent();
                        res.location("http://" + burl + "/users/" + userObject.insertedId);
                        return [2 /*return*/, res.status(201).json({
                                text: "201 Success : User created",
                                id: userObject.insertedId,
                            })];
                    case 3:
                        error_1 = _b.sent();
                        return [2 /*return*/, res.status(400).json({ text: "Error 400: Impossible to create a new user", error: error_1 })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    User.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, password, email, findUserDoc, findUser, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, password = _a.password, email = _a.email;
                        if (!email || !password) {
                            return [2 /*return*/, res.status(400).json({
                                    text: "Error 400 : Invalid request",
                                })];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_service_1.DBVars.users.findOne({ email: email })];
                    case 2:
                        findUserDoc = _b.sent();
                        findUser = new modelUser_1.User(findUserDoc._id, findUserDoc.pseudo, findUserDoc.email, findUserDoc.password);
                        if (!findUser)
                            return [2 /*return*/, res.status(404).json({
                                    text: "Error 404: This user does not exist",
                                })];
                        if (!findUser.authenticate(password))
                            return [2 /*return*/, res.status(401).json({
                                    text: "Error 401: Invalid password",
                                })];
                        return [2 /*return*/, res.status(200).json({
                                token: findUser.getToken(),
                                id: findUser._id,
                                text: "Status 200: Successful authentification",
                            })];
                    case 3:
                        error_2 = _b.sent();
                        return [2 /*return*/, res.status(500).json({
                                text: "Error 500: internal server error",
                                error: error_2,
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    User.delUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var idStr, id, deletePosts, delUser, delPosts, updatedPosts, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        idStr = req.authData._id;
                        id = new mongodb_1.ObjectId(idStr);
                        deletePosts = req.body.deletePosts;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, database_service_1.DBVars.users.deleteOne({ _id: id })];
                    case 2:
                        delUser = _a.sent();
                        if (!(delUser.deletedCount == 0)) return [3 /*break*/, 3];
                        return [2 /*return*/, res.status(404).json({
                                error: "Error 404: the user to delete has not been found"
                            })];
                    case 3:
                        if (!deletePosts) return [3 /*break*/, 6];
                        return [4 /*yield*/, database_service_1.DBVars.posts.deleteMany({ $and: [{ authors: idStr }, { authors: { $size: 1 } }] }, { retryWrites: true })];
                    case 4:
                        delPosts = _a.sent();
                        return [4 /*yield*/, database_service_1.DBVars.posts.updateMany({ $and: [{ authors: idStr }, { authors: { $size: { $gt: 1 } } }] }, { authors: { $pull: idStr } })];
                    case 5:
                        updatedPosts = _a.sent();
                        return [2 /*return*/, res
                                .status(200)
                                .json({
                                text: "Status 200: User and posts deleted successfully",
                                delUser: delUser,
                                delPosts: delPosts
                            })];
                    case 6: return [2 /*return*/, res
                            .status(200)
                            .json({
                            text: "Status 200: User deleted successfully",
                            delUser: delUser,
                        })];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_1 = _a.sent();
                        return [2 /*return*/, res
                                .status(400)
                                .json({
                                status: "Error 500: internal server error",
                                err: err_1,
                            })];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    User.get = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var reqParams, userData, returnedData, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reqParams = req.query;
                        if (reqParams._id) {
                            reqParams._id = new mongodb_1.ObjectId(reqParams._id);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        userData = (database_service_1.DBVars.users.find(reqParams, { projection: { _id: 1, pseudo: 1, email: 1, lastPosts: 1, }, }));
                        return [4 /*yield*/, userData.toArray()];
                    case 2:
                        returnedData = _a.sent();
                        return [2 /*return*/, res.status(200)
                                .json({
                                status: "200 : Request completed",
                                returnedData: returnedData,
                            })];
                    case 3:
                        err_2 = _a.sent();
                        return [2 /*return*/, res.status(400)
                                .json({
                                status: "400 : Bad Request",
                                err: err_2,
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    User.updateUserById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var idStr, id, updatedValues;
            return __generator(this, function (_a) {
                idStr = req.authData._id;
                id = new mongodb_1.ObjectId(idStr);
                updatedValues = {};
                Object.keys(req.body).forEach(function (field) {
                    if (field == "password") {
                        updatedValues["password"] =
                            passwordHash.generate(req.body.password);
                    }
                    else if (field == "_id") {
                        return res
                            .status(401)
                            .json({
                            status: "Error 401 : You're not authorized to change a user ID",
                        });
                    }
                    else {
                        updatedValues[field] = req.body[field];
                    }
                });
                if (updatedValues) {
                    return [2 /*return*/, database_service_1.DBVars.users.updateOne({ _id: id }, { $set: updatedValues })
                            .then(function (result) {
                            var userData = "http://" + burl + "/users/" + id;
                            result["links"] = {
                                href: userData,
                                method: "GET",
                                rel: "data",
                            };
                            res.status(201).json({
                                status: "Status 201 : Ressource successfully created",
                                result: result,
                            });
                        })
                            .catch(function (err) {
                            return res
                                .status(400)
                                .json({
                                status: "Error 400 : Bad Request",
                                error: err,
                            });
                        })];
                }
                return [2 /*return*/];
            });
        });
    };
    return User;
}());
exports.User = User;
