"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateUserMiddleware = exports.PublicUserMiddleware = void 0;
var lib_1 = require("./account/lib");
function PublicUserMiddleware(app) {
    /* Routes et fonctions associées pour l'api /users
     */
    app.get("/", lib_1.Account.getUsers);
    app.get("/:id", lib_1.Account.getUserById);
    app.post("/login", lib_1.Account.login);
    app.post("/", lib_1.Account.signup);
}
exports.PublicUserMiddleware = PublicUserMiddleware;
function PrivateUserMiddleware(app) {
    app.get("/auth", lib_1.Account.authTest);
    app.delete("/:id", lib_1.Account.delUser);
    app.put("/:id", lib_1.Account.updateUserById);
}
exports.PrivateUserMiddleware = PrivateUserMiddleware;
