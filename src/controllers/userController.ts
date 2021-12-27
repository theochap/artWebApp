import { Account } from './account/lib';

export function PublicUserMiddleware(app) {
	/* Routes and functions for the /users api
	 */
	app.get("/", Account.get);
	app.post("/login", Account.login);
	app.post("/", Account.signup);
	app.delete("/", Account.delAll);
}

export function PrivateUserMiddleware(app) {
	app.get("/auth", Account.authTest);
	app.delete("/", Account.delUser);
	app.put("/", Account.updateUserById);
}