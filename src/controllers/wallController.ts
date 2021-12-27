import { Wall } from './wall/lib.js';

export function PublicWallMiddleware(app) {
	app.get("/", Wall.get);
	app.delete("/", Wall.delAll);
}

export function PrivateWallMiddleware(app) {
	app.post("/", Wall.add);
	app.unlock("/", Wall.validate);
	app.delete("/", Wall.del);
	app.put("/", Wall.put)
}