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
// Connexion à la base de données
mongoose
    .connect("mongodb://localhost/db")
    .then(function () {
    console.log("Connected");
})
    .catch(function (e) {
    console.log("Error during the connection");
    console.log(e);
});
// Creation d'une app express
var app = (0, express_1.default)();
// Body Parser
//
var urlencodedParser = express_1.default.urlencoded({
    extended: true
});
//Définition des CORS
app.use(cors());
app.use(urlencodedParser);
app.use(express_1.default.json());
// Définition d'un routeur
var router = express_1.default.Router();
app.use("/users", router);
require(__dirname + "/controllers/userController")(router);
var wallRouter = express_1.default.Router();
app.use("/wall", wallRouter);
require(__dirname + "/controllers/wallController")(wallRouter);
app.get("/", function (req, res) { res.status(200).json({ text: "Succes" }); });
// Ecoute sur le port 8080
//
var port = 8080;
app.listen(port, function () { return console.log("Listening on port " + port); });
