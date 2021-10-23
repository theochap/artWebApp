"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_js_1 = require("./wall/lib.js");
module.exports = function (app) {
    app.post("/add", lib_js_1.Wall.add);
    app.get("/", lib_js_1.Wall.get);
    app.post("/del", lib_js_1.Wall.del);
};
