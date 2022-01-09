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
exports.Posts = void 0;
var database_service_js_1 = require("../../services/database.service.js");
var mongodb_1 = require("mongodb");
var LIMIT_CONST = 15;
var Posts = /** @class */ (function () {
    function Posts() {
    }
    Posts.updatePosts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var thisAuthorId, lastPosts, lastPostsQuery, updatedUser, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        thisAuthorId = req.authData.id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        lastPosts = new Array();
                        return [4 /*yield*/, database_service_js_1.Collections.posts.find({
                                $and: [{ "authors": thisAuthorId }, { "visible": true }]
                            }, {
                                sort: { timestamp: -1 }, projection: { _id: 1, authors: 1, body: 1, title: 1 }, limit: LIMIT_CONST
                            })];
                    case 2:
                        lastPostsQuery = _a.sent();
                        lastPostsQuery.forEach(function (post) {
                            console.log(post);
                        });
                        return [4 /*yield*/, database_service_js_1.Collections.posts.updateOne({ _id: thisAuthorId }, {
                                lastPosts: lastPosts
                            })];
                    case 3:
                        updatedUser = _a.sent();
                        return [2 /*return*/, res.status(200).json({ text: "Status 200: Success", updatedUser: updatedUser })];
                    case 4:
                        error_1 = _a.sent();
                        return [2 /*return*/, res.status(404).json({ error: "Error 404: Unable to update the last posts of this user" })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Posts.add = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var thisAuthorId, _a, title, body, authors, visible, validators, post, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        thisAuthorId = req.authData.id;
                        _a = req.body, title = _a.title, body = _a.body, authors = _a.authors;
                        if (!title || !body || !authors || !(authors.includes(thisAuthorId))) {
                            //No title / body / Authors / publisher is not an author
                            return [2 /*return*/, res.status(400).json({
                                    text: "Error 400: Invalid format"
                                })];
                        }
                        validators = new Array();
                        // Check the visibility, if the sending author is the only author, set visibility to 1, otherwise init the authorizations and co-authors
                        authors.forEach(function (author) {
                            console.log(author);
                            var valAuthor = (author != thisAuthorId) ? { author: author, validate: false } : { author: author, validate: true };
                            validators.push(valAuthor);
                        });
                        if (authors.length === 1) {
                            visible = true;
                        }
                        else {
                            visible = false;
                        }
                        post = { title: title, body: body, authors: authors, visible: visible, validators: validators };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_service_js_1.Collections.posts.insertOne(post)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                text: "Success", title: post.title, message: post.body, authors: authors, visible: visible, validators: validators
                            })];
                    case 3:
                        error_2 = _b.sent();
                        return [2 /*return*/, res.status(500).json({ error: error_2 })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Posts.validate = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var postId, thisAuthorId, valAuth, postData, updatedValidators_1, finalPostDataCursor, finalPostData, fullyValidated_1, visible, updatedVisible, error_3, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postId = req.body.postId;
                        thisAuthorId = req.authData.id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        valAuth = { author: thisAuthorId, validate: true };
                        return [4 /*yield*/, database_service_js_1.Collections.posts.findOne({ $and: [{ _id: postId }, { "validators.author": thisAuthorId }] })];
                    case 2:
                        postData = _a.sent();
                        updatedValidators_1 = new Array();
                        postData.validators.forEach(function (validator) {
                            if (validator.author == thisAuthorId) {
                                updatedValidators_1.push({ author: thisAuthorId, validate: true });
                            }
                            else {
                                updatedValidators_1.push({ author: validator.author, validate: validator.validate });
                            }
                        });
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 7, , 8]);
                        return [4 /*yield*/, database_service_js_1.Collections.posts.findOneAndUpdate({ $and: [{ _id: postId }, { validators: postData.validators }] }, { validators: updatedValidators_1 }, { returnDocument: "after" })];
                    case 4:
                        finalPostDataCursor = _a.sent();
                        finalPostData = finalPostDataCursor.value;
                        fullyValidated_1 = true;
                        finalPostData.validators.forEach(function (Validator) { return fullyValidated_1 = (Validator.validate == false) ? false : fullyValidated_1; });
                        visible = false;
                        if (!fullyValidated_1) return [3 /*break*/, 6];
                        return [4 /*yield*/, database_service_js_1.Collections.posts.updateOne({ _id: postId }, { visible: true })];
                    case 5:
                        updatedVisible = _a.sent();
                        visible = true;
                        _a.label = 6;
                    case 6: return [2 /*return*/, res.status(200).json({ text: "Status 200: Success", validators: finalPostData.validators, visible: visible })];
                    case 7:
                        error_3 = _a.sent();
                        return [2 /*return*/, res.status(410).json({ text: "Error 410: the ressource you are trying to access is not available anymore", error: error_3 })];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_4 = _a.sent();
                        return [2 /*return*/, res.status(404).json({ text: "Error 404: not found", error: error_4 })];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Posts.put = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var thisAuthorId, postId, updatedValues, wallPost, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        thisAuthorId = req.authData.id;
                        postId = req.body.postId;
                        updatedValues = {};
                        Object.keys(req.body).forEach(function (key) {
                            if (["title", "body"].includes(key)) {
                                updatedValues[key] = req.body[key];
                            }
                        });
                        if (!updatedValues) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_service_js_1.Collections.posts.findOneAndUpdate({ $and: [{ _id: postId }, { "authors": thisAuthorId }] }, updatedValues)];
                    case 2:
                        wallPost = _a.sent();
                        return [2 /*return*/, res.status(200).json({ text: "Status 200: Success", data: wallPost })];
                    case 3:
                        error_5 = _a.sent();
                        return [2 /*return*/, res.status(404).json({ text: "Error 404: Ressource not found, unable to modify" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Posts.get = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var reqParams, wallPosts, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        reqParams = req.query;
                        return [4 /*yield*/, (database_service_js_1.Collections.posts.find(reqParams))];
                    case 1:
                        wallPosts = _a.sent();
                        return [2 /*return*/, res.status(200).json({ text: "Status 200: Success", data: wallPosts })];
                    case 2:
                        error_6 = _a.sent();
                        return [2 /*return*/, res.status(400).json({
                                text: "Error 400: bad request",
                                error: error_6
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* For testing purposes only */
    Posts.delAll = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_service_js_1.Collections.posts.deleteMany({})];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({ text: "Status 200: Success" })];
                    case 2:
                        error_7 = _a.sent();
                        res.status(400).json({ err: error_7 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Posts.del = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = (req.body.id);
                        return [4 /*yield*/, database_service_js_1.Collections.posts.deleteOne({ "_id": new mongodb_1.ObjectId(id) })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({ text: "Status 200: Success" })];
                    case 2:
                        error_8 = _a.sent();
                        res.status(400).json({ err: error_8 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Posts;
}());
exports.Posts = Posts;
