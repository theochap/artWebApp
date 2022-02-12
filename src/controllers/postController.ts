import { Posts } from './post/lib.js';

export function PublicWallMiddleware(app) {
	app.get("/", Posts.get)
}

export function PrivateWallMiddleware(app) {
	app.post("/", Posts.add);
	app.post("/validate", Posts.validate);
	app.delete("/", Posts.del);
	app.put("/", Posts.put);
	app.patch("/", Posts.updatePosts);
}