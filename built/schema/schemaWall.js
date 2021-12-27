"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wall = void 0;
var mongoose = require("mongoose");
var wallSchema = new mongoose.Schema({
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
        required: true,
        default: Date.now
    },
    visible: {
        type: Boolean,
        required: true,
        default: false
    },
    validators: [{
            author: {
                type: String,
                required: true
            },
            validate: {
                type: Boolean,
                required: true
            }
        }]
});
exports.Wall = mongoose.model("Wall", wallSchema);
