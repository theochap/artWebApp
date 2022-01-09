import { Collections } from "../../services/database.service";
import { Request, Response } from "express";
import { User as UserSchema } from "../../schema/modelUser";
import passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const burl = "localhost:8080";

export class User {
	static async authTest(req: Request, res: Response) {
		if (req.authData) {
			return res.status(203).json({ text: "Status 200: Access Authorized", data: req.authData });
		}
		else {
			return res.status(400)
				.json({
					error: "Error 400: Bad Request"
				})
		}


	}

	static async signup(req: Request, res: Response) {
		const { password, pseudo, email }: { password: string, pseudo: string, email: string } = req.body;

		if (!email || !password || !pseudo) {
			// email, password or pseudo empty
			return res.status(400).json({
				text: "Invalid request",
			});
		}

		// create a user, and hash his password

		const user = {
			email: email,
			pseudo: pseudo,
			password: passwordHash.generate(password),
			toConfirm: []
		};

		// verify that a user already exists
		try {
			const findUser = await Collections.users.findOne<UserSchema>({
				email: email,
			});

			if (findUser) {
				return res.status(400).json({
					text: "The user already exists",
				});
			}
		}
		catch (error) {
			return res.status(500).json({ error });
		}

		try {
			// Save if the user does not exist
			const userObject = await Collections.users.insertOne(user);
			res.location(
				"http://" + burl + "/users/" + userObject.insertedId
			);

			return res.status(201).json({
				text: "201 Success : User created",
				id: userObject.insertedId,
			});
		} catch (error) {
			return res.status(500).json({ error });
		}
	}

	static async login(req: Request, res: Response) {
		const { password, email }: { password: string, email: string } = req.body;
		if (!email || !password) {
			return res.status(400).json({
				text: "Invalid request",
			});
		}
		try {
			// Verify that the user exists

			const findUser = await Collections.users.findOne({ email }) as UserSchema;
			if (!findUser)
				return res.status(401).json({
					text: "This user does not exist",
				});
			if (!findUser.authenticate(password))
				return res.status(401).json({
					text: "Invalid password",
				});

			return res.status(200).json({
				token: findUser.getToken(),
				id: findUser._id,
				text: "Successful authentification",
			});
		} catch (error) {
			return res.status(500).json({
				error,
			});
		}
	}

	/* For testing purposes only */
	static async delAll(req: Request, res: Response) {
		try {
			await Collections.users.deleteMany({});
			return res.status(200).json({ text: "Success" });

		}
		catch (error) {
			res.status(400).json({ err: error });
		}
	}

	static async delUser(req: Request, res: Response) {
		try {
			const id = req.authData.id;
			const delWall = await Collections.posts.deleteMany({ authors: { $in: [id] } });
			const delUser = await Collections.users.deleteOne({ _id: id });

			return res
				.status(200)
				.json({
					text: "User deleted successfully",
					delUser: delUser,
					delWall: delWall
				})

		} catch (err) {
			res
				.status(400)
				.json({
					status: "400",
					err: err,
				})
		}

	}


	static async get(req: Request, res: Response) {

		const reqParams: UserSchema = req.query;
		try {

			const userData = await (Collections.users.findOne(reqParams, { projection: { _id: 1, pseudo: 1, email: 1, lastPosts: 1, }, }));

			return res.status(200)
				.json({
					status: "200 : Request completed",
					userData,
				});

		} catch (err) {
			return res.status(400)
				.json({
					status: "400 : Bad Request",
					err,
				})
		}
	}

	static async updateUserById(req: Request, res: Response) {
		try {
			const id = req.authData.id;
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

			if (updatedValues) {
				return Collections.users.updateOne(
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
