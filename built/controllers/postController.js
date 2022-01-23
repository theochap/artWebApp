"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateWallMiddleware = exports.PublicWallMiddleware = void 0;
var lib_js_1 = require("./post/lib.js");
function PublicWallMiddleware(app) {
    app.get("/", lib_js_1.Posts.get);
    app.delete("/", lib_js_1.Posts.delAll);
}
exports.PublicWallMiddleware = PublicWallMiddleware;
function PrivateWallMiddleware(app) {
    app.post("/", lib_js_1.Posts.add);
    app.unlock("/", lib_js_1.Posts.validate);
    app.delete("/", lib_js_1.Posts.del);
    app.put("/", lib_js_1.Posts.put);
    app.patch("/", lib_js_1.Posts.updatePosts);
}
exports.PrivateWallMiddleware = PrivateWallMiddleware;
