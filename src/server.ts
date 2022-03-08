// Modules
//
import cors = require('cors');
import express from "express";
import { PublicUserMiddleware, PrivateUserMiddleware } from "./controllers/user/userController"
import { Authentificate } from './controllers/common/userAuthentification';
import { PublicWallMiddleware, PrivateWallMiddleware } from './controllers/post/postController';
import { PublicReactionsMiddleware, PrivateReactionsMiddleware } from './controllers/reactions/reactionsController';
import { ConnectToDatabase } from './services/database.service';
import config from "config";
import morgan from "morgan";

export const Routes = { users: "/users", posts: "/posts", reactions: "/reactions" }
export const SubRoutes = {
	users: { login: "/login", auth: "/auth", follow: "/follow" },
	posts: { validate: "/validate" },
	reactions: { comments: "/comments", emojis: "/emojis" }
}

// Create an express app, exported for testing purposes
export const App = express();

// Body Parser
const urlencodedParser = express.urlencoded({
	extended: true

});

//don't show the log when it is test, and set morgan dev environment for development
if (config.util.getEnv('NODE_ENV') == "dev") {
	App.use(morgan('dev'));
} else if (config.util.getEnv('NODE_ENV') !== 'test') {
	//use morgan to log at command line
	App.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

// DataBase connection

ConnectToDatabase().then(() => {
	// CORS definition
	App.use(cors());

	App.use(urlencodedParser);
	App.use(express.json());

	// Router definition

	const publicUserRouter = express.Router();
	PublicUserMiddleware(publicUserRouter);
	App.use(Routes.users, publicUserRouter);

	const privateUserRouter = express.Router();
	PrivateUserMiddleware(privateUserRouter);
	App.use(Routes.users, Authentificate.parseToken, Authentificate.authMiddleware, privateUserRouter);

	const publicWallRouter = express.Router();
	PublicWallMiddleware(publicWallRouter);
	App.use(Routes.posts, publicWallRouter);

	const privateWallRouter = express.Router();
	PrivateWallMiddleware(privateWallRouter);
	App.use(Routes.posts, Authentificate.parseToken, Authentificate.authMiddleware, privateWallRouter);

	const publicCommentsRouter = express.Router();
	PublicReactionsMiddleware(publicCommentsRouter);
	App.use(Routes.reactions, publicCommentsRouter);

	const privateCommentsRouter = express.Router();
	PrivateReactionsMiddleware(privateCommentsRouter);
	App.use(Routes.reactions, Authentificate.parseToken, Authentificate.authMiddleware, privateCommentsRouter);

	App.get("/", (req, res) => { res.status(200).json({ text: "Status 200: Success" }) });

	// Listen on port 8080
	const port = 8080;

	App.listen(port, () => console.log(`Listening on port ${port}`));


}).catch(err => {
	console.log(err);
	process.exit();
});