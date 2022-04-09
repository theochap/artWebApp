"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var mongodb_1 = require("mongodb");
var jwt = require("jwt-simple");
var config_1 = __importDefault(require("config"));
var passwordHash = require("password-hash");
var User = /** @class */ (function () {
    function User(pseudo, email, password, timestamp, _id, follows) {
        if (timestamp === void 0) { timestamp = new Date(); }
        if (_id === void 0) { _id = new mongodb_1.ObjectId(); }
        if (follows === void 0) { follows = []; }
        this.pseudo = pseudo;
        this.email = email;
        this.password = password;
        this.timestamp = timestamp;
        this._id = _id;
        this.follows = follows;
    }
    User.prototype.getToken = function () {
        var data = { _id: this._id };
        return jwt.encode(data, config_1.default.get("jwt.pass"));
    };
    User.prototype.authenticate = function (password) {
        return passwordHash.verify(password, this.password);
    };
    User.DBValidator = function () {
        return {
            bsonType: "object",
            required: ["pseudo", "email", "password", "timestamp"],
            additionalProperties: false,
            properties: {
                _id: {
                    bsonType: "objectId"
                },
                pseudo: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                email: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                password: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                follows: {
                    bsonType: "array",
                    description: "List of users followed by a given user",
                    items: {
                        bsonType: "objectId"
                    },
                    uniqueItems: true
                },
                timestamp: {
                    bsonType: "date",
                    description: "must be a date indicating the creation of the document. Is required"
                }
            }
        };
    };
    return User;
}());
exports.User = User;
