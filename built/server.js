"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Modules
//
var cors = require("cors");
var express_1 = __importDefault(require("express"));
var mongoose = require("mongoose");
var userController_1 = require("./controllers/userController");
var userAuthentification_1 = require("./controllers/userAuthentification");
var wallController_1 = require("./controllers/wallController");
// Database connection
mongoose
    .connect("mongodb://localhost/ArteFact")
    .then(function () {
    console.log("Connected");
})
    .catch(function (e) {
    console.log("Error during the connection");
    console.log(e);
});
// Create an express app
var app = (0, express_1.default)();
// Body Parser
//
var urlencodedParser = express_1.default.urlencoded({
    extended: true
});
// CORS definition
app.use(cors());
app.use(urlencodedParser);
app.use(express_1.default.json());
// Router definition
var privateUserRouter = express_1.default.Router();
(0, userController_1.PrivateUserMiddleware)(privateUserRouter);
app.use("/users/private", userAuthentification_1.Authentificate.parseToken, userAuthentification_1.Authentificate.authMiddleware, privateUserRouter);
var publicUserRouter = express_1.default.Router();
(0, userController_1.PublicUserMiddleware)(publicUserRouter);
app.use("/users", publicUserRouter);
var privateWallRouter = express_1.default.Router();
(0, wallController_1.PrivateWallMiddleware)(privateWallRouter);
app.use("/wall/private", userAuthentification_1.Authentificate.parseToken, userAuthentification_1.Authentificate.authMiddleware, privateWallRouter);
var publicWallRouter = express_1.default.Router();
(0, wallController_1.PublicWallMiddleware)(publicWallRouter);
app.use("/wall", publicWallRouter);
app.get("/", function (req, res) { res.status(200).json({ text: "Status 200: Success" }); });
// Listen on port 8080
//
var port = 8080;
app.listen(port, function () { return console.log("Listening on port " + port); });
