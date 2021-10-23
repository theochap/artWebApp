import {Wall} from './wall/lib.js';

module.exports = function(app){

	app.post("/add", Wall.add);
	app.get("/", Wall.get);
	app.post("/del", Wall.del);
}

