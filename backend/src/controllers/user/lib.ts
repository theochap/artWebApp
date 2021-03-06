import { DBVars } from "../../services/database.service";
import { Request, Response } from "express";
import { User as UserSchema, UserCredentials } from "../../schema/modelUser";
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import passwordHash = require("password-hash");
import { fail } from "assert";
import { AuthData, Error } from "../common/routes";
import HTTP from "../common/errorCodes";
const jwt = require("jsonwebtoken");
const burl = "localhost:8080";

export namespace User {
	export namespace Request {
		export type Add = UserCredentials
		export type Login = { password: string, email: string }
		export type Follow = { _id: ObjectId }
		export type Del = { deleteData: number }
		export type Put = Partial<UserSchema>
	}

	export async function AuthTest(
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

	export async function Signup(
		req: Request<never, never, Request.Add, never>,
		res: Response<InsertOneResult | Error>) {

		const { password, pseudo, email }: { password: string, pseudo: string, email: string } = req.body;

		if (!email || !password || !pseudo) {
			// email, password or pseudo empty
			return res.status(HTTP.BAD_REQUEST).json({
				error: "Error 400: Bad request",
			});
		}

		// create a user, and hash his password

		const user = new UserSchema(
			pseudo,
			email,
			passwordHash.generate(password)
		);

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

	export async function Follow(
		req: Request<never, never, Request.Follow, never>,
		res: Response<UpdateResult | Error>) {

		const _id = new ObjectId(req.body._id)
		try {
			const updateRes = await DBVars.users.updateOne({ _id: req.authData._id }, { $push: { follows: _id } })
			if (updateRes.matchedCount == 0) {
				return res.status(HTTP.NOT_FOUND).json({ error: "User not found" })
			} else if (updateRes.modifiedCount == 0) {
				return res.status(HTTP.NOT_MODIFIED).json({ error: "Ressource not modified" })
			} else if (updateRes.acknowledged == false) {
				return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" })
			} else {
				return res.status(HTTP.CREATED).json(updateRes)
			}

		} catch (error) {
			return res.status(HTTP.BAD_REQUEST).json({ error })
		}

	}

	export async function UnFollow(
		req: Request<never, never, Request.Follow, never>,
		res: Response<UpdateResult | Error>) {

		const _id = new ObjectId(req.body._id)
		try {
			const updateRes = await DBVars.users.updateOne({ _id: req.authData._id }, { $pull: { follows: _id } })
			if (updateRes.matchedCount == 0) {
				return res.status(HTTP.NOT_FOUND).json({ error: "User not found" })
			} else if (updateRes.modifiedCount == 0) {
				return res.status(HTTP.NOT_MODIFIED).json({ error: "Ressource not modified" })
			} else if (updateRes.acknowledged == false) {
				return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" })
			} else {
				return res.status(HTTP.ACCEPTED).json(updateRes)
			}

		} catch (error) {
			return res.status(HTTP.BAD_REQUEST).json({ error })
		}

	}

	export async function Login(
		req: Request<never, never, Request.Login, never>,
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

			const findUser = new UserSchema(findUserDoc.pseudo, findUserDoc.email, findUserDoc.password, new Date(), findUserDoc._id);

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

	export async function Del(
		req: Request<AuthData, never, Request.Del, never>,
		res: Response<DeleteResult | { deletedUser: DeleteResult, deletedData: DeleteResult } | Error>) {

		const id: ObjectId = req.authData._id;

		try {
			if ("deleteData" in req.body && req.body.deleteData == 1) {
				const delPosts = await DBVars.posts.deleteMany({ "authors._id": id, authors: { $size: 1 } }, { retryWrites: true });
				await DBVars.posts.updateMany({ "authors._id": id }, { $pull: { authors: { _id: id } } }, { retryWrites: true });
				await DBVars.reactions.deleteMany({ author: id }, { retryWrites: true });
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
						deletedData: delPosts
					});

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
			console.log(err)
			return res
				.status(HTTP.INTERNAL_SERVER_ERROR)
				.json({
					error: err,
				})
		}
	}

	export async function Get(
		req: Request<any, any, any, any>,
		res: Response<UserSchema[] | Error>) {

		const reqParams = req.query;

		// Converts the request id to an objectId because the get request parameters are strings

		try {
			if ("_id" in reqParams)
				reqParams._id = new ObjectId(req.query._id);

			if ("follows" in reqParams)
				reqParams.follows = new ObjectId(req.query.follows)

			const returnedData = await DBVars.users.find<UserSchema>(reqParams,
				{ projection: { _id: 1, pseudo: 1, email: 1, lastPosts: 1, timestamp: 1, follows: 1 }, }).toArray();


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

	export async function Put(
		req: Request<AuthData, never, Request.Put, never>,
		res: Response<UpdateResult | Error>) {
		const id: ObjectId = req.authData._id;

		let updatedValues: Partial<UserSchema> = req.body;

		if ("password" in req.body) updatedValues.password = passwordHash.generate(req.body.password);

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

