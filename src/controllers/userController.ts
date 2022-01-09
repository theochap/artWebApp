import { User } from './user/lib';

export function PublicUserMiddleware(app) {
	/* Routes and functions for the /users api
	 */
	app.get("/", User.get);
	app.post("/login", User.login);
	app.post("/", User.signup);
	app.delete("/", User.delAll);
}

export function PrivateUserMiddleware(app) {
	app.get("/auth", User.authTest);
	app.delete("/", User.delUser);
	app.put("/", User.updateUserById);
}