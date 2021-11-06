// Modules
//
import cors = require('cors');
import express from "express";
import mongoose = require("mongoose");
import { PublicUserMiddleware, PrivateUserMiddleware } from "./controllers/userController"
import { Authentificate } from './controllers/userAuthentification';
import { PublicWallMiddleware, PrivateWallMiddleware } from './controllers/wallController';

// Connexion à la base de données

mongoose
	.connect("mongodb://localhost/db")
	.then(() => {
		console.log("Connected");
	})
	.catch(e => {
		console.log("Error during the connection");
		console.log(e);
	});



// Creation d'une app express

const app = express();

// Body Parser
//

const urlencodedParser = express.urlencoded({
	extended: true

});

//Définition des CORS
app.use(cors());

app.use(urlencodedParser);
app.use(express.json());

// Définition d'un routeur

const privateUserRouter = express.Router();
PrivateUserMiddleware(privateUserRouter);
app.use("/users/private", Authentificate.parseToken, Authentificate.authMiddleware, privateUserRouter);

const publicUserRouter = express.Router();
PublicUserMiddleware(publicUserRouter);
app.use("/users", publicUserRouter);

const publicWallRouter = express.Router();
PublicWallMiddleware(publicWallRouter);
app.use("/wall", publicWallRouter);

const privateWallRouter = express.Router();
PrivateWallMiddleware(privateWallRouter);
app.use("/wall/private", privateWallRouter);


app.get("/", (req, res) => { res.status(200).json({ text: "Succes" }) });

// Ecoute sur le port 8080
//

const port = 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
