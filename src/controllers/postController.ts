import { Posts } from './post/lib.js';

export function PublicWallMiddleware(app) {
	app.get("/", Posts.get)
	app.delete("/", Posts.delAll);
}

export function PrivateWallMiddleware(app) {
	app.post("/", Posts.add);
	app.unlock("/", Posts.validate);
	app.delete("/", Posts.del);
	app.put("/", Posts.put);
	app.patch("/", Posts.updatePosts);
}