const wall = require('./wall/lib.js');

module.exports = function(app){

	app.post("/add", wall.add);
	app.get("/", wall.get);
	app.post("/del", wall.del);
}

