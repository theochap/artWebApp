"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateWallMiddleware = exports.PublicWallMiddleware = void 0;
var lib_js_1 = require("./wall/lib.js");
function PublicWallMiddleware(app) {
    app.get("/", lib_js_1.Wall.get);
    app.delete("/", lib_js_1.Wall.delAll);
}
exports.PublicWallMiddleware = PublicWallMiddleware;
function PrivateWallMiddleware(app) {
    app.post("/", lib_js_1.Wall.add);
    app.unlock("/", lib_js_1.Wall.validate);
    app.delete("/", lib_js_1.Wall.del);
    app.put("/", lib_js_1.Wall.put);
    app.patch("/", lib_js_1.Wall.updatePosts);
}
exports.PrivateWallMiddleware = PrivateWallMiddleware;
