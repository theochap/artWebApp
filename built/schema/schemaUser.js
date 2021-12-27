"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var mongoose = require("mongoose");
var passwordHash = require("password-hash");
var jwt = require("jwt-simple");
var config_1 = require("../config/config");
var mongodb_1 = require("mongodb");
var userSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    lastPosts: [{
            postId: {
                type: mongodb_1.ObjectId,
                required: true
            },
            authors: [{
                    type: String,
                    required: true
                }],
            title: {
                type: String,
                required: true
            },
            body: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                required: true
            },
        }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});
userSchema.methods = {
    authenticate: function (password) {
        return passwordHash.verify(password, this.password);
    },
    getToken: function () {
        var data = { id: this._id };
        return jwt.encode(data, config_1.Config.secret);
    },
};
exports.User = mongoose.model("User", userSchema);
