"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateUserMiddleware = exports.PublicUserMiddleware = void 0;
var lib_1 = require("./user/lib");
function PublicUserMiddleware(app) {
    /* Routes and functions for the /users api
     */
    app.get("/", lib_1.User.get);
    app.post("/login", lib_1.User.login);
    app.post("/", lib_1.User.signup);
    app.delete("/", lib_1.User.delAll);
}
exports.PublicUserMiddleware = PublicUserMiddleware;
function PrivateUserMiddleware(app) {
    app.get("/auth", lib_1.User.authTest);
    app.delete("/", lib_1.User.delUser);
    app.put("/", lib_1.User.updateUserById);
}
exports.PrivateUserMiddleware = PrivateUserMiddleware;
