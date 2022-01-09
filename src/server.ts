// Modules
//
import cors = require('cors');
import express from "express";
import { PublicUserMiddleware, PrivateUserMiddleware } from "./controllers/userController"
import { Authentificate } from './controllers/userAuthentification';
import { PublicWallMiddleware, PrivateWallMiddleware } from './controllers/wallController';
import { ConnectToDatabase } from './services/database.service';

// Create an express app
const app = express();

// Body Parser
const urlencodedParser = express.urlencoded({
	extended: true

});

// DataBase connection

ConnectToDatabase().then(() => {
	// CORS definition
	app.use(cors());

	app.use(urlencodedParser);
	app.use(express.json());

	// Router definition
	const privateUserRouter = express.Router();
	PrivateUserMiddleware(privateUserRouter);
	app.use("/users/private", Authentificate.parseToken, Authentificate.authMiddleware, privateUserRouter);

	const publicUserRouter = express.Router();
	PublicUserMiddleware(publicUserRouter);
	app.use("/users", publicUserRouter);

	const privateWallRouter = express.Router();
	PrivateWallMiddleware(privateWallRouter);
	app.use("/wall/private", Authentificate.parseToken, Authentificate.authMiddleware, privateWallRouter);

	const publicWallRouter = express.Router();
	PublicWallMiddleware(publicWallRouter);
	app.use("/wall", publicWallRouter);

	app.get("/", (req, res) => { res.status(200).json({ text: "Status 200: Success" }) });

	// Listen on port 8080
	const port = 8080;
	app.listen(port, () => console.log(`Listening on port ${port}`));

}).catch(err => {
	console.log(err);
	process.exit();
});