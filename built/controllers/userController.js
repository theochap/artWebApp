"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("./account/lib");
module.exports = function (app) {
    /* Routes et fonctions associées pour l'api /users
     */
    app.get("/", lib_1.Account.getUsers);
    app.get("/:id", lib_1.Account.getUserById);
    app.post("/login", lib_1.Account.login);
    app.post("/", lib_1.Account.signup);
    app.delete("/:id", lib_1.Account.delUser);
    app.put("/:id", lib_1.Account.updateUserPseudo);
};
