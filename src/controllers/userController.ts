import { Account } from './account/lib';

export function PublicUserMiddleware(app) {
	/* Routes et fonctions associées pour l'api /users
	 */
	app.get("/", Account.getUsers);
	app.get("/:id", Account.getUserById);
	app.post("/login", Account.login);
	app.post("/", Account.signup);
}

export function PrivateUserMiddleware(app) {
	app.get("/auth", Account.authTest);
	app.delete("/:id", Account.delUser);
	app.put("/:id", Account.updateUserById);
}