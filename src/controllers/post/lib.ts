import { Posts as PostSchema, UserPostData } from "../../schema/modelPosts.js";
import { User as UserSchema } from "../../schema/modelUser.js";
import { Request, Response } from "express";
import { DBVars } from "../../services/database.service.js";
import { ObjectId } from 'mongodb';

var LIMIT_CONST = 15;

export class Posts {

	static async add(req: Request, res: Response): Response {

		try {
			const thisAuthor: ObjectId = req.authData._id;
			const { title, body, authors: authorsIdStr }: { title: string, body: string, authors: string[] } = req.body;

			if (!title || !body || !authorsIdStr || !Array.isArray(authorsIdStr) || !(authorsIdStr.includes(thisAuthor.toHexString()))) {
				//No title / body / Authors / publisher is not an author

				return res.status(400).json({
					status: "Error 400: Invalid format"
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

			const retPost = await DBVars.posts.insertOne(post);

			return res.status(201).json({
				result: retPost,
				insertedPost: post
			});

		} catch (error) {
			console.log(error)
			return res.status(400).json({ error });
		}

	}

	static async validate(req: Request, res: Response): Response {
		const { postId: postIdStr } = req.body;
		const postId = new ObjectId(postIdStr)
		const thisAuthorId = req.authData._id;

		try {
			const finalPostDataCursor = await DBVars.posts.updateOne({ _id: postId },
				{ $pull: { validators: thisAuthorId } });

			if (finalPostDataCursor.modifiedCount == 0) {
				return res.status(304).json({ result: finalPostDataCursor })
			} else if (finalPostDataCursor.matchedCount == 0) {
				return res.status(404).json({ result: finalPostDataCursor })
			} else {
				return res.status(201).json({ result: finalPostDataCursor });
			}

		} catch (error) {
			return res.status(400).json({ error: error });
		}

	}

	static async put(req: Request, res: Response): Response {
		const authorId: ObjectId = req.authData._id;

		const postIdStr: string = req.body.postId;
		const postId: ObjectId = new ObjectId(postIdStr);

		const updatedValues: { title?: string, body?: string } = req.body.updatedFields;

		try {
			const resUpdate = await DBVars.posts.updateOne({ _id: postId, "authors._id": authorId }, { $set: updatedValues });
			if (resUpdate.matchedCount == 0) {
				return res.status(404).json({ result: resUpdate })
			} else if (resUpdate.modifiedCount == 0) {
				return res.status(304).json({ result: resUpdate })
			} else {
				return res.status(201).json({ result: resUpdate });
			}
		} catch (error) {
			return res.status(400).json({ error: error });
		}


	}

	static async get(req: Request, res: Response): Response {
		try {
			const reqParams = req.query;

			if (reqParams._id) {
				reqParams._id = new ObjectId(reqParams._id);
			}

			const wallPosts = (DBVars.posts.find<PostSchema>(reqParams));
			const returnedData = await wallPosts.toArray();

			return res.status(200).json({ status: "Status 200: Success", result: returnedData });

		} catch (error) {
			return res.status(400).json({
				status: "Error 400: bad request",
				error
			}
			);
		}
	}

	static async del(req: Request, res: Response): Response {
		try {
			const idStr: string = (req.body._id);
			const id: ObjectId = new ObjectId(idStr)
			const resDelete = await DBVars.posts.deleteOne({ _id: id, "authors._id": req.authData._id });

			if (resDelete.deletedCount == 0) {
				return res.status(404).json({ result: resDelete })
			} else {
				return res.status(200).json({ result: resDelete });
			}
		}
		catch (error) {
			res.status(400).json({ error: error });
		}
	}
}

