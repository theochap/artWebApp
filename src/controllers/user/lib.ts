import { DBVars } from "../../services/database.service";
import { Request, Response } from "express";
import { User as UserSchema } from "../../schema/modelUser";
import { ObjectId } from "mongodb";
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
				text: "Error 400: Bad request",
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

			// Save if the user does not exist
			const userObject = await DBVars.users.insertOne(user);
			res.location(
				"http://" + burl + "/users/" + userObject.insertedId
			);

			return res.status(201).json({
				text: "201 Success : User created",
				id: userObject.insertedId,
			});

		}
		catch (error) {
			return res.status(400).json({ text: "Error 400: Impossible to create a new user", error });
		}

	}

	static async login(req: Request, res: Response) {
		const { password, email }: { password: string, email: string } = req.body;
		if (!email || !password) {
			return res.status(400).json({
				text: "Error 400 : Invalid request",
			});
		}
		try {
			// Verify that the user exists

			const findUserDoc = await DBVars.users.findOne({ email: email });
			const findUser = new UserSchema(findUserDoc._id, findUserDoc.pseudo, findUserDoc.email, findUserDoc.password);
			if (!findUser)
				return res.status(404).json({
					text: "Error 404: This user does not exist",
				});
			if (!findUser.authenticate(password))
				return res.status(401).json({
					text: "Error 401: Invalid password",
				});

			return res.status(200).json({
				token: findUser.getToken(),
				id: findUser._id,
				text: "Status 200: Successful authentification",
			});
		} catch (error) {
			return res.status(500).json({
				text: "Error 500: internal server error",
				error,
			});
		}
	}

	/* For testing purposes only */
	static async delAll(req: Request, res: Response) {
		try {
			await DBVars.users.deleteMany({});
			return res.status(200).json({ text: "Status 200: Success" });

		}
		catch (error) {
			res.status(400).json({ err: error });
		}
	}

	static async delUser(req: Request, res: Response) {
		const idStr: string = req.authData._id;
		const id = new ObjectId(idStr);
		const deletePosts = req.body.deletePosts;

		try {
			const delUser = await DBVars.users.deleteOne({ _id: id });

			if (delUser.deletedCount == 0) {
				return res.status(404).json({
					error: "Error 404: the user to delete has not been found"
				});

			} else {
				if (deletePosts) {
					const delPosts = await DBVars.posts.deleteMany({ $and: [{ authors: idStr }, { authors: { $size: 1 } }] }, { retryWrites: true });
					const updatedPosts = await DBVars.posts.updateMany(
						{ $and: [{ authors: idStr }, { authors: { $size: { $gt: 1 } } }] },
						{ authors: { $pull: idStr } });


					return res
						.status(200)
						.json({
							text: "Status 200: User and posts deleted successfully",
							delUser,
							delPosts
						});

				} else {
					return res
						.status(200)
						.json({
							text: "Status 200: User deleted successfully",
							delUser,
						});
				}

			}


		} catch (err) {

			return res
				.status(400)
				.json({
					status: "Error 500: internal server error",
					err: err,
				})
		}
	}

	static async get(req: Request, res: Response) {

		const reqParams = req.query;

		if (reqParams._id) {
			reqParams._id = new ObjectId(reqParams._id);
		}

		try {
			const userData = (DBVars.users.find(reqParams, { projection: { _id: 1, pseudo: 1, email: 1, lastPosts: 1, }, }));
			const returnedData = await userData.toArray();
			return res.status(200)
				.json({
					status: "200 : Request completed",
					returnedData,
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

		const idStr: string = req.authData._id;
		const id = new ObjectId(idStr);
		let updatedValues = {};
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
						status: "Error 401 : You're not authorized to change a user ID",
					});
			} else {
				updatedValues[field] = req.body[field];
			}
		});

		if (updatedValues) {
			return DBVars.users.updateOne(
				{ _id: id },
				{ $set: updatedValues }
			)
				.then((result) => {
					let userData =
						"http://" + burl + "/users/" + id;
					result["links"] = {
						href: userData,
						method: "GET",
						rel: "data",
					};
					res.status(201).json({
						status: "Status 201 : Ressource successfully created",
						result,
					});
				})
				.catch((err) =>
					res
						.status(400)
						.json({
							status: "Error 400 : Bad Request",
							error: err,
						})
				);
		}
	}
}
