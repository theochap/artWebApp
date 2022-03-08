import { SubRoutes } from '../../server';
import { User } from './lib';

export function PublicUserMiddleware(app) {
	/* Routes and functions for the /users api
	 */
	app.get("/", User.Get);
	app.post(SubRoutes.users.login, User.Login);
	app.post("/", User.Signup);
}

export function PrivateUserMiddleware(app) {
	app.get(SubRoutes.users.auth, User.AuthTest);
	app.delete("/", User.Del);
	app.put("/", User.Put);
}