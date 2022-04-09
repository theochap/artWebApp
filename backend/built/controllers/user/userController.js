"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateUserMiddleware = exports.PublicUserMiddleware = void 0;
var server_1 = require("../../server");
var lib_1 = require("./lib");
function PublicUserMiddleware(app) {
    /* Routes and functions for the /users api
     */
    app.get("/", lib_1.User.Get);
    app.post(server_1.SubRoutes.users.login, lib_1.User.Login);
    app.post("/", lib_1.User.Signup);
}
exports.PublicUserMiddleware = PublicUserMiddleware;
function PrivateUserMiddleware(app) {
    app.get(server_1.SubRoutes.users.auth, lib_1.User.AuthTest);
    app.post(server_1.SubRoutes.users.follow, lib_1.User.Follow);
    app.delete(server_1.SubRoutes.users.follow, lib_1.User.UnFollow);
    app.delete("/", lib_1.User.Del);
    app.put("/", lib_1.User.Put);
}
exports.PrivateUserMiddleware = PrivateUserMiddleware;
