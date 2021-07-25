const User = require("../../schema/schemaUser.js");
const passwordHash = require("password-hash");

exports.signup = async function(req, res) {
	const {password, pseudo, email} = req.body;

	if (!email || !password || !pseudo){
		// Pas de mail ou de password
		return res.status(400).json({
			text: "Requête invalide"
		});
	}

	// Création d'un user, dans lequel on hash son mot de passe
	
	const user = {
		email,
		pseudo,
		password: passwordHash.generate(password)
	};

	// Vérification si l'utilisateur existe déjà
	try {
		const findUser = await User.findOne({
			email
		});
		if (findUser){
			return res.status(400).json({
				text: "L'utilisateur existe déjà"
			});
		}

	} catch(error){
		return res.status(500).json({ error});
	}

	try {
		// Sauvegarde si l'user existe
		const userData = new User(user);
		const userObject = await userData.save();
		return res.status(200).json({
			text: "Succès",
			token : userObject.getToken(),
			id: userObject._id
		});
	} catch(error) {
		return res.status(500).json({error});
	}
}

exports.login = async function(req, res){
	const {password, email} = req.body;
	if (!email || !password){
		return res.status(400).json({
			text: "Requête invalide"
		});
	}
	try {
		// Vérification si l'utilisateur existe

		const findUser = await User.findOne({email});
		if (!findUser)
			return res.status(401).json({
				text: "L'utilisateur n'existe pas"
			});
		if (!findUser.authenticate(password))
			return res.status(401).json({
				text: "Mot de passe incorrect"
			});
		
		return res.status(200).json({
			token: findUser.getToken(),
			id: findUser._id,
			text: "Authentification réussie"
		});
	} catch (error){
		return res.status(500).json({
			error}
		);
	}
}

exports.getUsers = async function(req, res){
	
		try{
			return User.find().then(users => res.status(200).json({text : "Users retrieved successfully", users: users})).catch(err => res.status(400).json({err}));
		} catch(error){
				return res.status(500).json({
						error});

	}
}

exports.delUser = async function(req, res){
		try{
			const id = req.params.id;
			return User.remove({_id : id}, {justOne: true})
						.then(result => res.status(200).json({text : "User deleted successfully", result : result}))
						.catch(err => res.status(400).json({status : '400', err: err}));
	
		}
	catch(error){
		return res.status(500).json({status : 'Error 500 : Internal server error', error: error});
}

}

exports.getUserById = async function(req, res){
	try{
			const id = req.params.id;
			return User.find({_id : id}, {_id : 1, pseudo : 1, email : 1})
				.then(userInfo => res.status(200).json({status : "200 : Request completed", userInfo})).catch(err => res.status(400).json({status: "400 : Bad Request", err}));

} catch(err){	
		return res.status(500).json({status : 'Error 500 : Internal server error', error});
}
}

exports.updateUserPseudo = async function(req, res){
		try{
			const id= req.params.id;
			const updatedValues = {}
			Object.keys(req.body).forEach( field => {
				if(field == "password"){
					updatedValues["password"] = passwordHash.generate(req.body.password)
				}
				else if(field == "_id"){
					return res.status(401).json({status : "401 : You're not authorized to change a user ID"});
				}
				else{
					updatedValues[field] = req.body[field];
				}
			});
			console.log(updatedValues);
			if(updatedValues){
				return User.updateOne(
						 {_id : id},
						updatedValues
			)
							.then(result => res.status(201).json({status : '201 : Ressource successfully created', result}))
							.catch(err => res.status(400).json({status: '400 : Bad Request', error : err }) );
			}	
		
			}
					catch(error){
			return res.status(500).json({status : 'Error 500 : Internal server error', error});
		}
}

