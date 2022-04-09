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
exports.Posts = void 0;
var database_service_js_1 = require("../../services/database.service.js");
var mongodb_1 = require("mongodb");
var errorCodes_js_1 = __importDefault(require("../common/errorCodes.js"));
var errorCodes_js_2 = __importDefault(require("../common/errorCodes.js"));
var LIMIT_CONST = 15;
var Posts;
(function (Posts) {
    function Add(req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var thisAuthor_1, _a, title, body, authorsIdStr, authorsId_1, validators_1, authors, post, retPost, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        thisAuthor_1 = req.authData._id;
                        _a = req.body, title = _a.title, body = _a.body, authorsIdStr = _a.authors;
                        if (!title || !body || !authorsIdStr || !Array.isArray(authorsIdStr) || !(authorsIdStr.includes(thisAuthor_1.toHexString()))) {
                            //No title / body / Authors / publisher is not an author
                            return [2 /*return*/, res.status(errorCodes_js_1.default.BAD_REQUEST).json({
                                    error: "The request does not have the correct format."
                                })];
                        }
                        authorsId_1 = new Array();
                        validators_1 = new Array();
                        // Check the visibility, if the sending author is the only author, set visibility to 1, otherwise init the authorizations and co-authors
                        authorsIdStr.forEach(function (author) {
                            var authorId = new mongodb_1.ObjectId(author);
                            authorsId_1.push(authorId);
                            if (author != thisAuthor_1.toString()) {
                                validators_1.push(authorId);
                            }
                        });
                        return [4 /*yield*/, database_service_js_1.DBVars.users.find({ _id: { $in: authorsId_1 } }, { projection: { _id: 1, pseudo: 1 } }).toArray()
                            // Create the post.
                        ];
                    case 1:
                        authors = _b.sent();
                        post = { authors: authors, title: title, body: body, validators: validators_1, timestamp: new Date() };
                        if ("file" in req)
                            post.content = { data: req.file.buffer, mimetype: req.file.mimetype, size: req.file.size };
                        return [4 /*yield*/, database_service_js_1.DBVars.posts.insertOne(post)];
                    case 2:
                        retPost = _b.sent();
                        return [2 /*return*/, res.status(errorCodes_js_1.default.CREATED).json(retPost)];
                    case 3:
                        error_1 = _b.sent();
                        console.log(error_1);
                        return [2 /*return*/, res.status(errorCodes_js_1.default.BAD_REQUEST).json({ error: error_1 })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    Posts.Add = Add;
    function Validate(req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var postIdStr, _id, thisAuthorId, finalPostDataCursor, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postIdStr = req.body._id;
                        _id = new mongodb_1.ObjectId(postIdStr);
                        thisAuthorId = req.authData._id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_service_js_1.DBVars.posts.updateOne({ _id: _id }, { $pull: { validators: thisAuthorId } })];
                    case 2:
                        finalPostDataCursor = _a.sent();
                        if (finalPostDataCursor.matchedCount == 0) {
                            return [2 /*return*/, res.status(errorCodes_js_1.default.NOT_FOUND).json({ error: finalPostDataCursor })];
                        }
                        else if (finalPostDataCursor.modifiedCount == 0) {
                            return [2 /*return*/, res.status(errorCodes_js_1.default.NOT_MODIFIED).json(finalPostDataCursor)];
                        }
                        else {
                            return [2 /*return*/, res.status(errorCodes_js_1.default.CREATED).json(finalPostDataCursor)];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        return [2 /*return*/, res.status(errorCodes_js_1.default.INTERNAL_SERVER_ERROR).json({ error: error_2 })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    Posts.Validate = Validate;
    function Put(req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var authorId, postId, updatedValues, resUpdate, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        authorId = req.authData._id;
                        postId = new mongodb_1.ObjectId(req.body.postId);
                        updatedValues = req.body.updatedFields;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_service_js_1.DBVars.posts.updateOne({ _id: postId, "authors._id": authorId }, { $set: updatedValues })];
                    case 2:
                        resUpdate = _a.sent();
                        if (resUpdate.matchedCount == 0) {
                            return [2 /*return*/, res.status(errorCodes_js_1.default.NOT_FOUND).json({ error: resUpdate })];
                        }
                        else if (resUpdate.modifiedCount == 0) {
                            return [2 /*return*/, res.status(errorCodes_js_1.default.NOT_MODIFIED).json(resUpdate)];
                        }
                        else {
                            return [2 /*return*/, res.status(errorCodes_js_1.default.CREATED).json(resUpdate)];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        return [2 /*return*/, res.status(errorCodes_js_1.default.BAD_REQUEST).json({ error: error_3 })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    Posts.Put = Put;
    function Get(req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var reqParams, wallPosts, returnedData, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        reqParams = req.query;
                        if (reqParams._id) {
                            reqParams._id = new mongodb_1.ObjectId(req.query._id);
                        }
                        wallPosts = (database_service_js_1.DBVars.posts.find(reqParams));
                        return [4 /*yield*/, wallPosts.toArray()];
                    case 1:
                        returnedData = _a.sent();
                        return [2 /*return*/, res.status(errorCodes_js_2.default.ACCEPTED).json(returnedData)];
                    case 2:
                        error_4 = _a.sent();
                        return [2 /*return*/, res.status(errorCodes_js_1.default.BAD_REQUEST).json({
                                error: error_4
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    Posts.Get = Get;
    function Del(req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, resDelete, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = new mongodb_1.ObjectId(req.body._id);
                        return [4 /*yield*/, database_service_js_1.DBVars.posts.deleteOne({ _id: id, "authors._id": req.authData._id })];
                    case 1:
                        resDelete = _a.sent();
                        if (resDelete.deletedCount == 0) {
                            return [2 /*return*/, res.status(404).json(resDelete)];
                        }
                        else {
                            return [2 /*return*/, res.status(200).json(resDelete)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        res.status(400).json({ error: error_5 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    Posts.Del = Del;
})(Posts = exports.Posts || (exports.Posts = {}));
