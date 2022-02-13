import { User } from './lib';

export function PublicUserMiddleware(app) {
	/* Routes and functions for the /users api
	 */
	app.get("/", User.get);
	app.post("/login", User.login);
	app.post("/", User.signup);
}

export function PrivateUserMiddleware(app) {
	app.get("/auth", User.authTest);
	app.delete("/", User.del);
	app.put("/", User.put);
}