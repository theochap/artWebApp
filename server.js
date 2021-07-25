// Modules
//
const cors = require('cors');
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Connexion à la base de données

mongoose
	.connect("mongodb://localhost/db")
	.then( () => {
		console.log("Connected");
	})
	.catch( e => {
		console.log("Error during the connection");
		console.log(e);
	});



// Creation d'une app express

const app = express();

// Body Parser
//

const urlencodedParser = bodyParser.urlencoded({
	extended: true

});

//Définition des CORS
app.use(cors());

app.use(urlencodedParser);
app.use(bodyParser.json());

// Définition d'un routeur

const router = express.Router();
app.use("/users", router);
require(__dirname + "/controllers/userController")(router);

const wallRouter = express.Router();
app.use("/wall", wallRouter);
require(__dirname + "/controllers/wallController")(wallRouter);

app.get("/", (req, res) => {res.status(200).json({ text : "Succes"})});

// Ecoute sur le port 8080
//

const port = 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
