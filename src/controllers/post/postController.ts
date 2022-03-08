import { SubRoutes } from '../../server.js';
import { Posts } from './lib.js';

export function PublicWallMiddleware(app) {
	app.get("/", Posts.Get)
}

export function PrivateWallMiddleware(app) {
	app.post("/", Posts.Add);
	app.post(SubRoutes.posts.validate, Posts.Validate);
	app.delete("/", Posts.Del);
	app.put("/", Posts.Put);
}