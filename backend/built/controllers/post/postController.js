"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateWallMiddleware = exports.PublicWallMiddleware = void 0;
var server_js_1 = require("../../server.js");
var lib_js_1 = require("./lib.js");
var multer = require("multer");
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
function PublicWallMiddleware(app) {
    app.get("/", lib_js_1.Posts.Get);
}
exports.PublicWallMiddleware = PublicWallMiddleware;
function PrivateWallMiddleware(app) {
    app.post("/", upload.single("file"), lib_js_1.Posts.Add);
    app.post(server_js_1.SubRoutes.posts.validate, lib_js_1.Posts.Validate);
    app.delete("/", lib_js_1.Posts.Del);
    app.put("/", lib_js_1.Posts.Put);
}
exports.PrivateWallMiddleware = PrivateWallMiddleware;
