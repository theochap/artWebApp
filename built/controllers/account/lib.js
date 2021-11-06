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
exports.Account = void 0;
var schemaUser_1 = require("../../schema/schemaUser");
var schemaWall_1 = require("../../schema/schemaWall");
var passwordHash = require("password-hash");
var jwt = require("jsonwebtoken");
var burl = "localhost:8080";
var Account = /** @class */ (function () {
    function Account() {
    }
    Account.authTest = function (req, res) {
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
    Account.signup = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, password, pseudo, email, user, findUser, error_1, userData, userObject, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, password = _a.password, pseudo = _a.pseudo, email = _a.email;
                        if (!email || !password || !pseudo) {
                            // Pas de mail ou de password
                            return [2 /*return*/, res.status(400).json({
                                    text: "Requête invalide",
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
                        return [4 /*yield*/, schemaUser_1.User.findOne({
                                email: email,
                            })];
                    case 2:
                        findUser = _b.sent();
                        if (findUser) {
                            return [2 /*return*/, res.status(400).json({
                                    text: "L'utilisateur existe déjà",
                                })];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        return [2 /*return*/, res.status(500).json({ error: error_1 })];
                    case 4:
                        _b.trys.push([4, 6, , 7]);
                        userData = new schemaUser_1.User(user);
                        return [4 /*yield*/, userData.save()];
                    case 5:
                        userObject = _b.sent();
                        res.location("http://" + burl + "/users/" + userObject._id);
                        return [2 /*return*/, res.status(201).json({
                                text: "201 Success : User created",
                                token: userObject.getToken(),
                                id: userObject._id,
                            })];
                    case 6:
                        error_2 = _b.sent();
                        return [2 /*return*/, res.status(500).json({ error: error_2 })];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Account.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, password, email, findUser, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, password = _a.password, email = _a.email;
                        if (!email || !password) {
                            return [2 /*return*/, res.status(400).json({
                                    text: "Requête invalide",
                                })];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, schemaUser_1.User.findOne({ email: email })];
                    case 2:
                        findUser = _b.sent();
                        if (!findUser)
                            return [2 /*return*/, res.status(401).json({
                                    text: "L'utilisateur n'existe pas",
                                })];
                        if (!findUser.authenticate(password))
                            return [2 /*return*/, res.status(401).json({
                                    text: "Mot de passe incorrect",
                                })];
                        return [2 /*return*/, res.status(200).json({
                                token: findUser.getToken(),
                                id: findUser._id,
                                text: "Authentification réussie",
                            })];
                    case 3:
                        error_3 = _b.sent();
                        return [2 /*return*/, res.status(500).json({
                                error: error_3,
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Account.getUsers = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, schemaUser_1.User.find()
                            .then(function (users) {
                            return res
                                .status(200)
                                .json({
                                text: "Users retrieved successfully",
                                users: users,
                            });
                        })
                            .catch(function (err) { return res.status(400).json({ err: err }); })];
                }
                catch (error) {
                    return [2 /*return*/, res.status(500).json({
                            error: error,
                        })];
                }
                return [2 /*return*/];
            });
        });
    };
    /* For testing purposes only */
    Account.delAll = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, schemaUser_1.User.deleteMany()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({ text: "Succès" })];
                    case 2:
                        error_4 = _a.sent();
                        res.status(400).json({ err: error_4 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Account.delUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, delWall, delUser, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        id = req.authData.id;
                        return [4 /*yield*/, schemaWall_1.Wall.remove({ authors: { $in: [id] } })];
                    case 1:
                        delWall = _a.sent();
                        return [4 /*yield*/, schemaUser_1.User.remove({ _id: id })];
                    case 2:
                        delUser = _a.sent();
                        return [2 /*return*/, res
                                .status(200)
                                .json({
                                text: "User deleted successfully",
                                delUser: delUser,
                                delWall: delWall
                            })];
                    case 3:
                        err_1 = _a.sent();
                        res
                            .status(400)
                            .json({
                            status: "400",
                            err: err_1,
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Account.getUserById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                id = req.params.id;
                return [2 /*return*/, schemaUser_1.User.find({ _id: id }, { _id: 1, pseudo: 1, email: 1 })
                        .then(function (userInfo) {
                        return res
                            .status(200)
                            .json({
                            status: "200 : Request completed",
                            userInfo: userInfo,
                        });
                    })
                        .catch(function (err) {
                        return res
                            .status(400)
                            .json({
                            status: "400 : Bad Request",
                            err: err,
                        });
                    })];
            });
        });
    };
    Account.updateUserById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id_1, updatedValues_1;
            return __generator(this, function (_a) {
                try {
                    id_1 = req.authData.id;
                    updatedValues_1 = {};
                    Object.keys(req.body).forEach(function (field) {
                        if (field == "password") {
                            updatedValues_1["password"] =
                                passwordHash.generate(req.body.password);
                        }
                        else if (field == "_id") {
                            return res
                                .status(401)
                                .json({
                                status: "401 : You're not authorized to change a user ID",
                            });
                        }
                        else {
                            updatedValues_1[field] = req.body[field];
                        }
                    });
                    console.log(updatedValues_1);
                    if (updatedValues_1) {
                        return [2 /*return*/, schemaUser_1.User.updateOne({ _id: id_1 }, updatedValues_1)
                                .then(function (result) {
                                var userData = "http://" +
                                    burl +
                                    "/users/" +
                                    id_1;
                                result["links"] = {
                                    href: userData,
                                    method: "GET",
                                    rel: "data",
                                };
                                res.status(201).json({
                                    status: "201 : Ressource successfully created",
                                    result: result,
                                });
                            })
                                .catch(function (err) {
                                return res
                                    .status(400)
                                    .json({
                                    status: "400 : Bad Request",
                                    error: err,
                                });
                            })];
                    }
                }
                catch (error) {
                    return [2 /*return*/, res
                            .status(500)
                            .json({
                            status: "Error 500 : Internal server error",
                            error: error,
                        })];
                }
                return [2 /*return*/];
            });
        });
    };
    return Account;
}());
exports.Account = Account;
