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
    login: function (email, password) {
        return axios_1.default.post(burl + "/users/login", {
            email: email,
            password: password
        }, {
            headers: headers
        });
    },
    signup: function (send) {
        return axios_1.default.post(burl + "/user/signup", send, { headers: headers });
    },
    isAuth: function () {
        return localStorage.getItem("token") !== null;
    },
    findPseudo: function (send) {
        return axios_1.default.post(burl + "/user/get", send, { headers: headers });
    },
    logout: function () {
        localStorage.clear();
    }
};
