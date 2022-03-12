import { SubRoutes } from '../../server.js';
import { Posts } from './lib.js';
import multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage })

export function PublicWallMiddleware(app) {
	app.get("/", Posts.Get)
}

export function PrivateWallMiddleware(app) {
	app.post("/", upload.single("file"), Posts.Add);
	app.post(SubRoutes.posts.validate, Posts.Validate);
	app.delete("/", Posts.Del);
	app.put("/", Posts.Put);
}