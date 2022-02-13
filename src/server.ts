// Modules
//
import cors = require('cors');
import express from "express";
import { PublicUserMiddleware, PrivateUserMiddleware } from "./controllers/user/userController"
import { Authentificate } from './controllers/common/userAuthentification';
import { PublicWallMiddleware, PrivateWallMiddleware } from './controllers/post/postController';
import { PublicCommentsMiddleware, PrivateCommentsMiddleware } from './controllers/comments/commentsController';
import { ConnectToDatabase } from './services/database.service';
import config from "config";
import morgan from "morgan";

// Create an express app, exported for testing purposes
export const app = express();

// Body Parser
const urlencodedParser = express.urlencoded({
	extended: true

});

//don't show the log when it is test, and set morgan dev environment for development
if (config.util.getEnv('NODE_ENV') == "dev") {
	app.use(morgan('dev'));
} else if (config.util.getEnv('NODE_ENV') !== 'test') {
	//use morgan to log at command line
	app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

// DataBase connection

ConnectToDatabase().then(() => {
	// CORS definition
	app.use(cors());

	app.use(urlencodedParser);
	app.use(express.json());

	// Router definition

	const publicUserRouter = express.Router();
	PublicUserMiddleware(publicUserRouter);
	app.use("/users", publicUserRouter);

	const privateUserRouter = express.Router();
	PrivateUserMiddleware(privateUserRouter);
	app.use("/users", Authentificate.parseToken, Authentificate.authMiddleware, privateUserRouter);

	const publicWallRouter = express.Router();
	PublicWallMiddleware(publicWallRouter);
	app.use("/posts", publicWallRouter);

	const privateWallRouter = express.Router();
	PrivateWallMiddleware(privateWallRouter);
	app.use("/posts", Authentificate.parseToken, Authentificate.authMiddleware, privateWallRouter);

	const publicCommentsRouter = express.Router();
	PublicCommentsMiddleware(publicCommentsRouter);
	app.use("/comments", publicCommentsRouter);

	const privateCommentsRouter = express.Router();
	PrivateCommentsMiddleware(privateCommentsRouter);
	app.use("/comments", Authentificate.parseToken, Authentificate.authMiddleware, privateCommentsRouter);

	app.get("/", (req, res) => { res.status(200).json({ text: "Status 200: Success" }) });

	// Listen on port 8080
	const port = 8080;

	app.listen(port, () => console.log(`Listening on port ${port}`));


}).catch(err => {
	console.log(err);
	process.exit();
});