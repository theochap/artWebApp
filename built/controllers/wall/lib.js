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
exports.Wall = void 0;
var schemaWall_js_1 = require("../../schema/schemaWall.js");
var mongodb_1 = require("mongodb");
var Wall = /** @class */ (function () {
    function Wall() {
    }
    Wall.add = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var thisAuthorId, _a, title, body, authors, visible, post, postData, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        thisAuthorId = req.authData.id;
                        console.log("thisAuthorId " + thisAuthorId);
                        _a = req.body, title = _a.title, body = _a.body, authors = _a.authors;
                        console.log("title " + title);
                        console.log("body " + body);
                        console.log("authors " + authors);
                        if (!title || !body || !authors || !(authors.includes(thisAuthorId))) {
                            //No title / body / Authors / publisher is not an author
                            return [2 /*return*/, res.status(400).json({
                                    text: "Invalid format"
                                })];
                        }
                        // Check the visibility, if the sending author is the only author, set visibility to 1, otherwise check the authorizations and co-authors
                        if (authors.length === 1) {
                            visible = true;
                        }
                        else {
                            try {
                                visible = false;
                            }
                            catch (err) {
                                return [2 /*return*/, res.status(400).json({ text: "Error 400: Bad Request", error: err })];
                            }
                        }
                        post = { title: title, body: body, authors: authors, visible: visible };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        postData = new schemaWall_js_1.Wall(post);
                        return [4 /*yield*/, postData.save()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                text: "Success", title: postData.title, message: postData.body, authors: authors, visible: visible
                            })];
                    case 3:
                        error_1 = _b.sent();
                        return [2 /*return*/, res.status(500).json({ error: error_1 })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Wall.put = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var thisAuthorId, postId, updatedValues, wallPost, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        thisAuthorId = req.authData.id;
                        postId = req.body.id;
                        updatedValues = {};
                        Object.keys(req.body).forEach(function (key) {
                            if (["title", "body"].includes(key)) {
                                updatedValues[key] = req.body[key];
                            }
                        });
                        console.log(updatedValues);
                        if (!updatedValues) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, schemaWall_js_1.Wall.findOneAndUpdate({ $and: [{ _id: postId }, { "authors": thisAuthorId }] }, updatedValues)];
                    case 2:
                        wallPost = _a.sent();
                        return [2 /*return*/, res.status(200).json({ text: "Success", data: wallPost })];
                    case 3:
                        error_2 = _a.sent();
                        return [2 /*return*/, res.status(404).json({ text: "Error 404: Ressource not found, unable to modify" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Wall.get = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, schemaWall_js_1.Wall.find().then(function (posts) { return res.json(posts); }).catch(function (err) { return res.status(404).json({ err: "No posts found" }); })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        return [2 /*return*/, res.status(500).json({
                                error: error_3
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* For testing purposes only */
    Wall.delAll = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, schemaWall_js_1.Wall.deleteMany()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({ text: "Success" })];
                    case 2:
                        error_4 = _a.sent();
                        res.status(400).json({ err: error_4 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Wall.del = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = (req.body.id);
                        return [4 /*yield*/, schemaWall_js_1.Wall.deleteOne({ "_id": new mongodb_1.ObjectId(id) })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({ text: "Success" })];
                    case 2:
                        error_5 = _a.sent();
                        res.status(400).json({ err: error_5 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Wall;
}());
exports.Wall = Wall;
