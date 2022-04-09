"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = exports.SubRoutes = exports.Routes = void 0;
// Modules
//
var cors = require("cors");
var express_1 = __importDefault(require("express"));
var userController_1 = require("./controllers/user/userController");
var userAuthentification_1 = require("./controllers/common/userAuthentification");
var postController_1 = require("./controllers/post/postController");
var reactionsController_1 = require("./controllers/reactions/reactionsController");
var database_service_1 = require("./services/database.service");
var config_1 = __importDefault(require("config"));
var morgan_1 = __importDefault(require("morgan"));
exports.Routes = { users: "/users", posts: "/posts", reactions: "/reactions" };
exports.SubRoutes = {
    users: { login: "/login", auth: "/auth", follow: "/follow" },
    posts: { validate: "/validate" },
    reactions: { comments: "/comments", emojis: "/emojis" }
};
// Create an express app, exported for testing purposes
exports.App = (0, express_1.default)();
// Body Parser
var urlencodedParser = express_1.default.urlencoded({
    extended: true
});
//don't show the log when it is test, and set morgan dev environment for development
if (config_1.default.util.getEnv('NODE_ENV') == "dev") {
    exports.App.use((0, morgan_1.default)('dev'));
}
else if (config_1.default.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    exports.App.use((0, morgan_1.default)('combined')); //'combined' outputs the Apache style LOGs
}
// DataBase connection
(0, database_service_1.ConnectToDatabase)().then(function () {
    // CORS definition
    exports.App.use(cors());
    exports.App.use(urlencodedParser);
    exports.App.use(express_1.default.json());
    // Router definition
    var publicUserRouter = express_1.default.Router();
    (0, userController_1.PublicUserMiddleware)(publicUserRouter);
    exports.App.use(exports.Routes.users, publicUserRouter);
    var privateUserRouter = express_1.default.Router();
    (0, userController_1.PrivateUserMiddleware)(privateUserRouter);
    exports.App.use(exports.Routes.users, userAuthentification_1.Authentificate.parseToken, userAuthentification_1.Authentificate.authMiddleware, privateUserRouter);
    var publicWallRouter = express_1.default.Router();
    (0, postController_1.PublicWallMiddleware)(publicWallRouter);
    exports.App.use(exports.Routes.posts, publicWallRouter);
    var privateWallRouter = express_1.default.Router();
    (0, postController_1.PrivateWallMiddleware)(privateWallRouter);
    exports.App.use(exports.Routes.posts, userAuthentification_1.Authentificate.parseToken, userAuthentification_1.Authentificate.authMiddleware, privateWallRouter);
    var publicCommentsRouter = express_1.default.Router();
    (0, reactionsController_1.PublicReactionsMiddleware)(publicCommentsRouter);
    exports.App.use(exports.Routes.reactions, publicCommentsRouter);
    var privateCommentsRouter = express_1.default.Router();
    (0, reactionsController_1.PrivateReactionsMiddleware)(privateCommentsRouter);
    exports.App.use(exports.Routes.reactions, userAuthentification_1.Authentificate.parseToken, userAuthentification_1.Authentificate.authMiddleware, privateCommentsRouter);
    exports.App.get("/", function (req, res) { res.status(200).json({ text: "Status 200: Success" }); });
    // Listen on port 8080
    var port = 8080;
    exports.App.listen(port, function () { return console.log("Listening on port ".concat(port)); });
}).catch(function (err) {
    console.log(err);
    process.exit();
});
