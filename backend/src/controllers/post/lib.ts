import { Posts as PostSchema, UserPostData } from "../../schema/modelPosts.js";
import { User as UserSchema } from "../../schema/modelUser.js";
import { Request, Response } from "express";
import { DBVars } from "../../services/database.service.js";
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';
import { AuthData, Error } from "../common/routes.js";
import HTTP from "../common/errorCodes.js";
import HttpStatusCode from "../common/errorCodes.js";

var LIMIT_CONST = 15;

export namespace Posts {
	export namespace Request {
		export type Add = { title: string, body: string, authors: string[] }
		export type Validate = { _id: string }
		export type Put = { postId: string, updatedFields: Partial<PostSchema> }
		export type Get = Partial<PostSchema>
		export type Del = { _id: string }
	}

	export async function Add(
		req: Request<AuthData, never, Request.Add, never>,
		res: Response<InsertOneResult | Error>
	) {

		try {
			const thisAuthor: ObjectId = req.authData._id;
			let { title, body, authors: authorsIdStr }: { title: string, body: string, authors: string[] | string } = req.body;

			if (!title || !body || !authorsIdStr || !Array.isArray(authorsIdStr) || !(authorsIdStr.includes(thisAuthor.toHexString()))) {
				//No title / body / Authors / publisher is not an author

				return res.status(HTTP.BAD_REQUEST).json({
					error: "The request does not have the correct format."
				});
			}
			const authorsId: Array<ObjectId> = new Array();
			const validators: Array<ObjectId> = new Array();

			// Check the visibility, if the sending author is the only author, set visibility to 1, otherwise init the authorizations and co-authors
			authorsIdStr.forEach(author => {
				const authorId = new ObjectId(author)
				authorsId.push(authorId)
				if (author != thisAuthor.toString()) {
					validators.push(authorId)
				}
			});

			const authors: UserPostData[] = await DBVars.users.find<UserPostData>({ _id: { $in: authorsId } }, { projection: { _id: 1, pseudo: 1 } }).toArray()

			// Create the post.
			const post: PostSchema = { authors, title, body, validators, timestamp: new Date() };

			if ("file" in req)
				post.content = { data: req.file.buffer, mimetype: req.file.mimetype, size: req.file.size }

			const retPost = await DBVars.posts.insertOne(post);

			return res.status(HTTP.CREATED).json(
				retPost
			);

		} catch (error) {
			console.log(error)
			return res.status(HTTP.BAD_REQUEST).json({ error });
		}

	}

	export async function Validate(
		req: Request<AuthData, never, Request.Validate, never>,
		res: Response<UpdateResult | Error>) {

		let { _id: postIdStr } = req.body;
		const _id = new ObjectId(postIdStr)

		const thisAuthorId = req.authData._id;

		try {
			const finalPostDataCursor = await DBVars.posts.updateOne({ _id: _id },
				{ $pull: { validators: thisAuthorId } });

			if (finalPostDataCursor.matchedCount == 0) {
				return res.status(HTTP.NOT_FOUND).json({ error: finalPostDataCursor })
			} else if (finalPostDataCursor.modifiedCount == 0) {
				return res.status(HTTP.NOT_MODIFIED).json(finalPostDataCursor)
			} else {
				return res.status(HTTP.CREATED).json(finalPostDataCursor);
			}

		} catch (error) {
			return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ error: error });
		}

	}

	export async function Put(
		req: Request<AuthData, never, Request.Put, never>,
		res: Response<UpdateResult | Error>) {

		const authorId: ObjectId = req.authData._id;
		const postId: ObjectId = new ObjectId(req.body.postId);

		const updatedValues: { title?: string, body?: string } = req.body.updatedFields;

		try {
			const resUpdate = await DBVars.posts.updateOne({ _id: postId, "authors._id": authorId }, { $set: updatedValues });

			if (resUpdate.matchedCount == 0) {
				return res.status(HTTP.NOT_FOUND).json({ error: resUpdate })
			} else if (resUpdate.modifiedCount == 0) {
				return res.status(HTTP.NOT_MODIFIED).json(resUpdate)
			} else {
				return res.status(HTTP.CREATED).json(resUpdate);
			}

		} catch (error) {
			return res.status(HTTP.BAD_REQUEST).json({ error: error });
		}


	}

	export async function Get(
		req: Request<never, never, never, Request.Get>,
		res: Response<PostSchema[] | Error>) {
		try {
			const reqParams: Partial<PostSchema> = req.query

			if (reqParams._id) {
				reqParams._id = new ObjectId(req.query._id);
			}

			const wallPosts = (DBVars.posts.find<PostSchema>(reqParams));
			const returnedData = await wallPosts.toArray();

			return res.status(HttpStatusCode.ACCEPTED).json(returnedData);

		} catch (error) {
			return res.status(HTTP.BAD_REQUEST).json({
				error
			}
			);
		}
	}

	export async function Del(
		req: Request<never, never, Request.Del, never>,
		res: Response<DeleteResult | Error>) {
		try {
			const id: ObjectId = new ObjectId(req.body._id);
			const resDelete = await DBVars.posts.deleteOne({ _id: id, "authors._id": req.authData._id });

			if (resDelete.deletedCount == 0) {
				return res.status(404).json(resDelete)
			} else {
				return res.status(200).json(resDelete);
			}
		}
		catch (error) {
			res.status(400).json({ error: error });
		}
	}
}

