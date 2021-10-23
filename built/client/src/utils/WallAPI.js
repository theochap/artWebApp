"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var headers = {
    "Content-Type": "application/json"
};
var burl = "http://localhost:8080";
exports.default = {
    add: function (data) {
        var title = data.title, body = data.body, authorId = data.authorId;
        console.log(title);
        console.log(body);
        console.log(authorId);
        return axios_1.default.post(burl + "/wall/add", {
            title: title,
            body: body,
            authorId: authorId
        }, {
            headers: headers
        });
    },
    get: function () {
        return axios_1.default.get(burl + "/wall/get");
    },
    del: function (id) {
        return axios_1.default.post(burl + "/wall/del", {
            id: id
        }, {
            headers: headers
        });
    }
};
