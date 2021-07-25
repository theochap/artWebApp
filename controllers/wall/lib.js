const Wall = require("../../schema/schemaWall.js");
ObjectId = require('mongodb').ObjectID;
async function add(req, res){
	
	const {title, body, authorId} = req.body;

	if (!title || !body || !authorId){
		//Pas de titre ou de body
		return res.status(400).json({
			text:"Format invalide"
		});
	}

	// Création du poste sur le mur.
	
	const post = {title, body, authorId};

	// Sauvegarde du poste
	
	try {
		const postData = new Wall(post);
		const postObject = await postData.save();
		return res.status(200).json({
			text:"Succès", title: postData.title, message: postData.body, author: authorId});
	
	} catch(error){
		return res.status(500).json({error});
	}

}



async function get(req, res){
	try{
		
		Wall.find().then(posts => res.json(posts)).catch(err => res.status(404).json({err:"No posts found"}) );

	} catch (error){
		return res.status(500).json({
			error}
		);
	}
}

async function del(req, res){
	try{

	const id = (req.body.id);
	await Wall.deleteOne({"_id" : ObjectId(id) } );
	 
	return res.status(200).json({text:"Succès"});

	}
	catch (error){
		 res.status(400).json({err: error});
	}
}

exports.del = del;
exports.get = get;
exports.add = add;
