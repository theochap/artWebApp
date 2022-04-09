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
exports.Reactions = void 0;
var database_service_1 = require("../../services/database.service");
var mongodb_1 = require("mongodb");
var errorCodes_1 = __importDefault(require("../common/errorCodes"));
var config_1 = __importDefault(require("config"));
var jwt = require("jsonwebtoken");
var burl = "localhost:8080";
var Reactions;
(function (Reactions) {
    function Add(req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var thisAuthor, _a, content, post, comment, retComment, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        thisAuthor = req.authData._id;
                        _a = req.body, content = _a.content, post = _a.post;
                        comment = { author: thisAuthor, content: content, post: new mongodb_1.ObjectId(post), timestamp: new Date() };
                        // Insert a the parentCommentId to the comment variable if it exists.
                        if ("parentReaction" in req.body)
                            comment.parentReaction = new mongodb_1.ObjectId(req.body.parentReaction);
                        return [4 /*yield*/, database_service_1.DBVars.reactions.insertOne(comment)];
                    case 1:
                        retComment = _b.sent();
                        return [2 /*return*/, res.status(errorCodes_1.default.CREATED).json(retComment)];
                    case 2:
                        error_1 = _b.sent();
                        if (config_1.default.util.getEnv('NODE_ENV') !== 'test') {
                            console.log(error_1);
                        }
                        return [2 /*return*/, res.status(errorCodes_1.default.BAD_REQUEST).json({ error: error_1 })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    Reactions.Add = Add;
    function Put(req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var author, comment, resUpdate, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        author = req.authData._id;
                        comment = new mongodb_1.ObjectId(req.body._id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_service_1.DBVars.reactions.updateOne({ _id: comment, author: author }, { $set: { content: req.body.content } })];
                    case 2:
                        resUpdate = _a.sent();
                        if (resUpdate.matchedCount == 0) {
                            return [2 /*return*/, res.status(errorCodes_1.default.NOT_FOUND).json({ error: resUpdate })];
                        }
                        else if (resUpdate.modifiedCount == 0) {
                            return [2 /*return*/, res.status(errorCodes_1.default.NOT_MODIFIED).json(resUpdate)];
                        }
                        else {
                            return [2 /*return*/, res.status(errorCodes_1.default.CREATED).json(resUpdate)];
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
    Reactions.Put = Put;
    function getAnd(queryParams) {
        return function get(req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var reqParams, foundComments, returnedData, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            reqParams = req.query;
                            if ("_id" in reqParams)
                                reqParams._id = new mongodb_1.ObjectId(req.query._id);
                            if ("post" in reqParams)
                                reqParams.post = new mongodb_1.ObjectId(req.query.post);
                            if ("parentReaction" in reqParams)
                                reqParams.parentReaction = new mongodb_1.ObjectId(req.query.parentReaction);
                            if ("content.emoji" in reqParams) {
                                reqParams['content.emoji'] = parseInt(reqParams['content.emoji']);
                            }
                            foundComments = database_service_1.DBVars.reactions.find({ $and: [reqParams, queryParams] });
                            return [4 /*yield*/, foundComments.toArray()];
                        case 1:
                            returnedData = _a.sent();
                            return [2 /*return*/, res.status(errorCodes_1.default.ACCEPTED).json(returnedData)];
                        case 2:
                            error_3 = _a.sent();
                            return [2 /*return*/, res.status(errorCodes_1.default.BAD_REQUEST).json({
                                    error: error_3
                                })];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
    }
    function GetAll(req, res) { return getAnd({})(req, res); }
    Reactions.GetAll = GetAll;
    function GetComments(req, res) {
        return getAnd({ "content.text": { $exists: true } })(req, res);
    }
    Reactions.GetComments = GetComments;
    function GetEmojis(req, res) {
        return getAnd({ "content.emoji": { $exists: true } })(req, res);
    }
    Reactions.GetEmojis = GetEmojis;
    function Del(req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _id, resDelete, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        _id = new mongodb_1.ObjectId(req.body._id);
                        return [4 /*yield*/, database_service_1.DBVars.reactions.deleteOne({ _id: _id, author: req.authData._id })];
                    case 1:
                        resDelete = _a.sent();
                        if (resDelete.deletedCount == 0) {
                            return [2 /*return*/, res.status(errorCodes_1.default.NOT_FOUND).json(resDelete)];
                        }
                        else {
                            return [2 /*return*/, res.status(errorCodes_1.default.ACCEPTED).json(resDelete)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        res.status(errorCodes_1.default.BAD_REQUEST).json({ error: error_4 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    Reactions.Del = Del;
})(Reactions = exports.Reactions || (exports.Reactions = {}));
