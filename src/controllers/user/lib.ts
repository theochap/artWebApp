import { DBVars } from "../../services/database.service";
import { Request, Response } from "express";
import { User as UserSchema, UserCredentials } from "../../schema/modelUser";
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import passwordHash = require("password-hash");
import { fail } from "assert";
import { AuthData, Error } from "../common/routesTypes";
import HTTP from "../common/errorCodes";
const jwt = require("jsonwebtoken");
const burl = "localhost:8080";

export namespace User {
	export async function authTest(
		req: Request<AuthData, never, never, never>,
		res: Response<{ _id: ObjectId } | Error>) {
		try {
			if (req.authData) {
				return res.status(HTTP.ACCEPTED).json(req.authData);
			}
			else {
				return res.status(HTTP.UNAUTHORIZED)
					.json({
						error: "Error 403: Bad Request"
					})
			}
		} catch (error) {
			return res.status(HTTP.INTERNAL_SERVER_ERROR).json(error)
		}
	}

	export async function signup(
		req: Request<never, never, UserCredentials, never>,
		res: Response<InsertOneResult | Error>) {

		const { password, pseudo, email }: { password: string, pseudo: string, email: string } = req.body;

		if (!email || !password || !pseudo) {
			// email, password or pseudo empty
			return res.status(HTTP.BAD_REQUEST).json({
				error: "Error 400: Bad request",
			});
		}

		// create a user, and hash his password

		const user = {
			email: email,
			pseudo: pseudo,
			password: passwordHash.generate(password),
			timestamp: new Date()
		};

		// verify that a user already exists
		try {

			// Save if the user does not exist
			const userObject = await DBVars.users.insertOne(user);
			res.location(
				"http://" + burl + "/users/" + userObject.insertedId
			);

			return res.status(HTTP.CREATED).json(userObject);

		}
		catch (error) {
			return res.status(HTTP.BAD_REQUEST).json({ error });
		}

	}

	export async function login(
		req: Request<never, never, { password: string, email: string }, never>,
		res: Response<{ token: string, id: ObjectId } | Error>) {
		const { password, email }: { password: string, email: string } = req.body
		if (!email || !password) {
			return res.status(400).json({
				error: "Error 400 : Invalid request",
			});
		}

		try {
			// Verify that the user exists

			const findUserDoc = await DBVars.users.findOne<UserSchema>({ email: email });

			const findUser = new UserSchema(findUserDoc._id, findUserDoc.pseudo, findUserDoc.email, findUserDoc.password);

			if (!findUser.authenticate(password)) {
				throw new Error("Can't authenticate")
			}

			return res.status(HTTP.ACCEPTED).json({
				token: findUser.getToken(),
				id: findUser._id,
			});
		} catch (error) {
			return res.status(HTTP.NOT_FOUND).json({
				error,
			});
		}
	}

	export async function del(
		req: Request<AuthData, never, { deletePosts: number }, never>,
		res: Response<DeleteResult | { deletedUser: DeleteResult, deletedPosts: DeleteResult } | Error>) {

		const id: ObjectId = req.authData._id;

		try {
			if ("deletePosts" in req.body && req.body.deletePosts == 1) {
				const delPosts = await DBVars.posts.deleteMany({ "authors._id": id, authors: { $size: 1 } }, { retryWrites: true });

				if (delPosts.acknowledged) {
					const delUser = await DBVars.users.deleteOne({ _id: id });

					if (delUser.acknowledged && delUser.deletedCount == 0) {
						return res.status(HTTP.NOT_FOUND).json({
							error: "Error 404: the user to delete has not been found"
						});
					}

					return res
						.status(HTTP.ACCEPTED)
						.json({
							deletedUser: delUser,
							deletedPosts: delPosts
						});

				} else {
					return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ error: "Error 500: internal server error" })
				}



			} else {
				const delUser = await DBVars.users.deleteOne({ _id: id });

				if (delUser.deletedCount == 0) {
					return res.status(HTTP.NOT_FOUND).json({
						error: "Error 404: the user to delete has not been found"
					});
				}

				return res
					.status(HTTP.ACCEPTED)
					.json(
						delUser,
					);
			}

		} catch (err) {

			return res
				.status(HTTP.NOT_FOUND)
				.json({
					error: err,
				})
		}
	}

	export async function get(
		req: Request<any, any, any, Partial<UserSchema>>,
		res: Response<UserSchema[] | Error>) {

		const reqParams: Partial<UserSchema> = req.query;

		// Converts the request id to an objectId because the get request parameters are strings
		if (reqParams._id) {
			reqParams._id = new ObjectId(req.query._id);
		}

		try {
			const returnedData = await DBVars.users.find<UserSchema>(reqParams,
				{ projection: { _id: 1, pseudo: 1, email: 1, lastPosts: 1, timestamp: 1 }, }).toArray();
			return res.status(200)
				.json(
					returnedData,
				);

		} catch (err) {
			return res.status(400)
				.json({
					error: err,
				})
		}
	}

	export async function put(
		req: Request<AuthData, never, Partial<UserSchema>, never>,
		res: Response<UpdateResult | Error>) {
		const id: ObjectId = req.authData._id;

		let updatedValues: Partial<UserSchema> = req.body;
		updatedValues.password = "password" in req.body ? passwordHash.generate(req.body.password) : null

		try {

			const result = await DBVars.users.updateOne(
				{ _id: id },
				{ $set: updatedValues }
			)

			if (result.matchedCount == 0) {
				return res.status(HTTP.NOT_FOUND).json(
					result
				)
			} else if (result.modifiedCount == 0) {
				return res.status(HTTP.NOT_MODIFIED).json({
					error: "Status 304: Ressource not modified"
				})
			}

			let userData =
				"<http://" + burl + "/users/" + id + ">; rel='data'; method='GET'";

			return res.status(HTTP.CREATED).header("Link",
				userData).json(result);
		}
		catch (err) {
			return res
				.status(400)
				.json({
					error: err,
				})

		}
	}
}

