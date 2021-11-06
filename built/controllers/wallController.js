"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateWallMiddleware = exports.PublicWallMiddleware = void 0;
var lib_js_1 = require("./wall/lib.js");
function PublicWallMiddleware(app) {
    app.get("/", lib_js_1.Wall.get);
    app.delete("/delAll", lib_js_1.Wall.delAll);
}
exports.PublicWallMiddleware = PublicWallMiddleware;
function PrivateWallMiddleware(app) {
    app.post("/add", lib_js_1.Wall.add);
    app.delete("/del", lib_js_1.Wall.del);
}
exports.PrivateWallMiddleware = PrivateWallMiddleware;
