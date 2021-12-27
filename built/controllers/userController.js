"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateUserMiddleware = exports.PublicUserMiddleware = void 0;
var lib_1 = require("./account/lib");
function PublicUserMiddleware(app) {
    /* Routes and functions for the /users api
     */
    app.get("/", lib_1.Account.get);
    app.post("/login", lib_1.Account.login);
    app.post("/", lib_1.Account.signup);
    app.delete("/", lib_1.Account.delAll);
}
exports.PublicUserMiddleware = PublicUserMiddleware;
function PrivateUserMiddleware(app) {
    app.get("/auth", lib_1.Account.authTest);
    app.delete("/", lib_1.Account.delUser);
    app.put("/", lib_1.Account.updateUserById);
}
exports.PrivateUserMiddleware = PrivateUserMiddleware;
