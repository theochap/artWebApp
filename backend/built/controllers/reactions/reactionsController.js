"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateReactionsMiddleware = exports.PublicReactionsMiddleware = void 0;
var server_js_1 = require("../../server.js");
var lib_js_1 = require("./lib.js");
function PublicReactionsMiddleware(app) {
    app.get("/", lib_js_1.Reactions.GetAll);
    app.get(server_js_1.SubRoutes.reactions.comments, lib_js_1.Reactions.GetComments);
    app.get(server_js_1.SubRoutes.reactions.emojis, lib_js_1.Reactions.GetEmojis);
}
exports.PublicReactionsMiddleware = PublicReactionsMiddleware;
function PrivateReactionsMiddleware(app) {
    app.post("/", lib_js_1.Reactions.Add);
    app.delete("/", lib_js_1.Reactions.Del);
    app.put("/", lib_js_1.Reactions.Put);
}
exports.PrivateReactionsMiddleware = PrivateReactionsMiddleware;
