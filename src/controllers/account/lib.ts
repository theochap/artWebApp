import { User } from "../../schema/schemaUser";
import { Config } from "../../config/config";
import passwordHash = require("password-hash");

const jwt = require("jwt-simple");
const burl = "localhost:8080";

export class Account {
	static async auth(req, res) {
		const token: string = req.body.token;

		if (token) {
			const decode = jwt.verify(token, Config.secret)

			return res.status(200)
				.json({
					text: "Successful authentification",
					data: decode
				})

		}
		else {
			return res.status(400)
				.json({
					text: "Error 400: Bad Request"
				})
		}


	}

	static async signup(req, res) {
		const { password, pseudo, email }: { password: string, pseudo: string, email: string } = req.body;

		if (!email || !password || !pseudo) {
			// Pas de mail ou de password
			return res.status(400).json({
				text: "Requête invalide",
			});
		}

		// Création d'un user, dans lequel on hash son mot de passe

		const user = {
			email,
			pseudo,
			password: passwordHash.generate(password),
		};

		// Vérification si l'utilisateur existe déjà
		try {
			const findUser = await User.findOne({
				email,
			});
			if (findUser) {
				return res.status(400).json({
					text: "L'utilisateur existe déjà",
				});
			}
		} catch (error) {
			return res.status(500).json({ error });
		}

		try {
			// Sauvegarde si l'user n'existe pas
			const userData = new User(user);
			const userObject = await userData.save();
			res.location(
				"http://" + burl + "/users/" + userObject._id
			);

			return res.status(201).json({
				text: "201 Success : User created",
				token: userObject.getToken(),
				id: userObject._id,
			});
		} catch (error) {
			return res.status(500).json({ error });
		}
	}

	static async login(req, res) {
		const { password, email }: { password: string, email: string } = req.body;
		if (!email || !password) {
			return res.status(400).json({
				text: "Requête invalide",
			});
		}
		try {
			// Vérification si l'utilisateur existe

			const findUser = await User.findOne({ email });
			if (!findUser)
				return res.status(401).json({
					text: "L'utilisateur n'existe pas",
				});
			if (!findUser.authenticate(password))
				return res.status(401).json({
					text: "Mot de passe incorrect",
				});

			return res.status(200).json({
				token: findUser.getToken(),
				id: findUser._id,
				text: "Authentification réussie",
			});
		} catch (error) {
			return res.status(500).json({
				error,
			});
		}
	}

	static async getUsers(req, res): Promise<any> {
		try {
			return User.find()
				.then((users) =>
					res
						.status(200)
						.json({
							text: "Users retrieved successfully",
							users: users,
						})
				)
				.catch((err) => res.status(400).json({ err }));
		} catch (error) {
			return res.status(500).json({
				error,
			});
		}
	}

	static async delUser(req, res): Promise<any> {
		try {
			const id = req.params.id;
			return User.remove({ _id: id })
				.then((result) =>
					res
						.status(200)
						.json({
							text: "User deleted successfully",
							result: result,
						})
				)
				.catch((err) =>
					res
						.status(400)
						.json({
							status: "400",
							err: err,
						})
				);
		} catch (error) {
			return res
				.status(500)
				.json({
					status: "Error 500 : Internal server error",
					error: error,
				});
		}
	}

	static async getUserById(req, res): Promise<any> {
		try {
			const id = req.params.id;
			return User.find(
				{ _id: id },
				{ _id: 1, pseudo: 1, email: 1 }
			)
				.then((userInfo) =>
					res
						.status(200)
						.json({
							status: "200 : Request completed",
							userInfo,
						})
				)
				.catch((err) =>
					res
						.status(400)
						.json({
							status: "400 : Bad Request",
							err,
						})
				);
		} catch (err) {
			return res
				.status(500)
				.json({
					status: "Error 500 : Internal server error",
					err,
				});
		}
	}

	static async updateUserById(req, res): Promise<any> {
		try {
			const id = req.params.id;
			const updatedValues = {};
			Object.keys(req.body).forEach((field) => {
				if (field == "password") {
					updatedValues["password"] =
						passwordHash.generate(
							req.body.password
						);
				} else if (field == "_id") {
					return res
						.status(401)
						.json({
							status: "401 : You're not authorized to change a user ID",
						});
				} else {
					updatedValues[field] = req.body[field];
				}
			});

			console.log(updatedValues);
			if (updatedValues) {
				return User.updateOne(
					{ _id: id },
					updatedValues
				)
					.then((result) => {
						let userData =
							"http://" +
							burl +
							"/users/" +
							id;
						result["links"] = {
							href: userData,
							method: "GET",
							rel: "data",
						};
						res.status(201).json({
							status: "201 : Ressource successfully created",
							result,
						});
					})
					.catch((err) =>
						res
							.status(400)
							.json({
								status: "400 : Bad Request",
								error: err,
							})
					);
			}
		} catch (error) {
			return res
				.status(500)
				.json({
					status: "Error 500 : Internal server error",
					error,
				});
		}
	}
}
