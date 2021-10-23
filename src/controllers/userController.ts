import {Account} from './account/lib';


module.exports = function(app){

	/* Routes et fonctions associées pour l'api /users
	 */
	app.get("/", Account.getUsers);
	app.get("/:id", Account.getUserById);
	app.get("/auth", Account.auth);
	app.post("/login", Account.login);
	app.post("/", Account.signup);
	app.delete("/:id", Account.delUser);
	app.put("/:id", Account.updateUserById);
}
