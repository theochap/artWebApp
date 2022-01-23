"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var jwt = require("jwt-simple");
var config_1 = __importDefault(require("config"));
var passwordHash = require("password-hash");
var User = /** @class */ (function () {
    function User(_id, pseudo, email, password, lastPosts, createdAt) {
        this._id = _id;
        this.pseudo = pseudo;
        this.email = email;
        this.password = password;
        this.lastPosts = lastPosts;
        this.createdAt = createdAt;
    }
    User.prototype.getToken = function () {
        var data = { _id: this._id };
        return jwt.encode(data, config_1.default.get("jwt.pass"));
    };
    User.prototype.authenticate = function (password) {
        return passwordHash.verify(password, this.password);
    };
    return User;
}());
exports.User = User;
