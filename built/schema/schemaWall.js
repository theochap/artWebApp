"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wall = void 0;
var mongoose = require("mongoose");
var wallSchema = new mongoose.Schema({
    authorPseudo: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.Wall = mongoose.model("Wall", wallSchema);
