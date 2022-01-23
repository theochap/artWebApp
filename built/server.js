"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// Modules
//
var cors = require("cors");
var express_1 = __importDefault(require("express"));
var userController_1 = require("./controllers/userController");
var userAuthentification_1 = require("./controllers/userAuthentification");
var postController_1 = require("./controllers/postController");
var database_service_1 = require("./services/database.service");
var config_1 = __importDefault(require("config"));
var morgan_1 = __importDefault(require("morgan"));
// Create an express app, exported for testing purposes
exports.app = (0, express_1.default)();
// Body Parser
var urlencodedParser = express_1.default.urlencoded({
    extended: true
});
//don't show the log when it is test, and set morgan dev environment for development
if (config_1.default.util.getEnv('NODE_ENV') == "dev") {
    exports.app.use((0, morgan_1.default)('dev'));
}
else if (config_1.default.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    exports.app.use((0, morgan_1.default)('combined')); //'combined' outputs the Apache style LOGs
}
// DataBase connection
(0, database_service_1.ConnectToDatabase)().then(function () {
    // CORS definition
    exports.app.use(cors());
    exports.app.use(urlencodedParser);
    exports.app.use(express_1.default.json());
    // Router definition
    var privateUserRouter = express_1.default.Router();
    (0, userController_1.PrivateUserMiddleware)(privateUserRouter);
    exports.app.use("/users/private", userAuthentification_1.Authentificate.parseToken, userAuthentification_1.Authentificate.authMiddleware, privateUserRouter);
    var publicUserRouter = express_1.default.Router();
    (0, userController_1.PublicUserMiddleware)(publicUserRouter);
    exports.app.use("/users", publicUserRouter);
    var privateWallRouter = express_1.default.Router();
    (0, postController_1.PrivateWallMiddleware)(privateWallRouter);
    exports.app.use("/posts/private", userAuthentification_1.Authentificate.parseToken, userAuthentification_1.Authentificate.authMiddleware, privateWallRouter);
    var publicWallRouter = express_1.default.Router();
    (0, postController_1.PublicWallMiddleware)(publicWallRouter);
    exports.app.use("/posts", publicWallRouter);
    exports.app.get("/", function (req, res) { res.status(200).json({ text: "Status 200: Success" }); });
    // Listen on port 8080
    var port = 8080;
    exports.app.listen(port, function () { return console.log("Listening on port " + port); });
}).catch(function (err) {
    console.log(err);
    process.exit();
});
