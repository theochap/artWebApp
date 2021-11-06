import { Wall } from './wall/lib.js';

export function PublicWallMiddleware(app) {
	app.get("/", Wall.get);
	app.delete("/delAll", Wall.delAll);
}

export function PrivateWallMiddleware(app) {
	app.post("/add", Wall.add);
	app.delete("/del", Wall.del);
}