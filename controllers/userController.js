const account = require('./account/lib.js');


module.exports = function(app){

	/* Routes et fonctions associées pour l'api /users
	 */
	app.get("/", account.getUsers);
	app.get("/:id", account.getUserById);
	app.post("/login", account.login);
	app.post("/", account.signup);
	app.delete("/:id", account.delUser);
	app.put("/:id", account.updateUserPseudo);
}
