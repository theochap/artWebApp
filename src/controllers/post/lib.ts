import { Posts as PostSchema, Validator } from "../../schema/modelPosts.js";
import { User as UserSchema } from "../../schema/modelUser.js";
import { Request, Response } from "express";
import { DBVars } from "../../services/database.service.js";
import { ObjectId } from 'mongodb';

var LIMIT_CONST = 15;

export class Posts {

	static async updatePosts(req: Request, res: Response) {

		const author: string = req.authData._id;
		const thisAuthorId: ObjectId = new ObjectId(author)

		try {

			const lastPosts: Posts[] = new Array();

			const lastPostsQuery = await DBVars.posts.find<PostSchema>(
				{
					$and: [{ "authors": thisAuthorId }, { "visible": true }]
				},

				{
					sort: { timestamp: -1 }, projection: { _id: 1, authors: 1, body: 1, title: 1 }, limit: LIMIT_CONST
				}
			);

			lastPostsQuery.forEach(post => {
				console.log(post);
			});

			const updatedUser = await DBVars.posts.updateOne({ _id: thisAuthorId }, {
				lastPosts: lastPosts
			});
			return res.status(200).json({ status: "Status 200: Success", updatedUser })
		} catch (error) {
			return res.status(400).json({ error: "Error 400: Unable to update the last posts of this user" });
		}
	}

	static async add(req: Request, res: Response) {

		const thisAuthor: ObjectId = req.authData._id;
		const { title, body, authors }: { title: string, body: string, authors: string[] } = req.body;

		if (!title || !body || !authors || !Array.isArray(authors) || !(authors.includes(thisAuthor.toHexString()))) {
			//No title / body / Authors / publisher is not an author

			return res.status(400).json({
				status: "Error 400: Invalid format"
			});
		}

		var visible: boolean;

		const validators: Array<Validator> = new Array();
		const authorsId: Array<ObjectId> = new Array();

		// Check the visibility, if the sending author is the only author, set visibility to 1, otherwise init the authorizations and co-authors
		authors.forEach(author => {
			const authorId = new ObjectId(author)
			authorsId.push(authorId)

			var valAuthor: Validator = (authorId != thisAuthor) ? { authorId: authorId, validate: false } : { authorId: authorId, validate: true };
			validators.push(valAuthor);

		});

		if (authors.length === 1) {
			visible = true;
		}
		else {
			visible = false;
		}

		// Create the post.
		const post = { authors: authorsId, title, body, visible, validators };

		try {
			const retPost = await DBVars.posts.insertOne(post);

			return res.status(201).json({
				result: retPost
			});

		} catch (error) {
			console.log(error)
			return res.status(400).json({ error });
		}

	}

	static async validate(req: Request, res: Response) {
		const { postId } = req.body;
		const thisAuthorId = req.authData._id;

		try {
			const valAuth: Validator = { authorId: thisAuthorId, validate: true };
			const postData = await DBVars.posts.findOne({ $and: [{ _id: postId }, { "validators.author": thisAuthorId }] })
			const updatedValidators: Validator[] = new Array();

			postData.validators.forEach(validator => {

				if (validator.author == thisAuthorId) {
					updatedValidators.push({ authorId: thisAuthorId, validate: true });
				}
				else {
					updatedValidators.push({ authorId: validator.author, validate: validator.validate });
				}
			});

			try {
				const finalPostDataCursor = await DBVars.posts.findOneAndUpdate({ $and: [{ _id: postId }, { validators: postData.validators }] },
					{ validators: updatedValidators }, { returnDocument: "after" });

				const finalPostData = finalPostDataCursor.value;

				let fullyValidated = true;
				finalPostData.validators.forEach(Validator => fullyValidated = (Validator.validate == false) ? false : fullyValidated);

				let visible = false;

				if (fullyValidated) {
					const updatedVisible = await DBVars.posts.updateOne({ _id: postId }, { visible: true });
					visible = true;
				}

				return res.status(200).json({ status: "Status 200: Success", validators: finalPostData.validators, visible: visible });

			} catch (error) {
				return res.status(410).json({ status: "Error 410: the ressource you are trying to access is not available anymore", error: error });
			}

		} catch (error) {
			return res.status(404).json({ status: "Error 404: not found", error: error });
		}
	}

	static async put(req: Request, res: Response) {
		const authorId: ObjectId = req.authData._id;

		const postIdStr: string = req.body.postId;
		const postId: ObjectId = new ObjectId(postIdStr);

		const updatedValues: { title?: string, body?: string } = req.body.updatedFields;

		try {
			const resUpdate = await DBVars.posts.updateOne({ _id: postId, authors: authorId }, { $set: updatedValues });
			if (resUpdate.matchedCount == 0) {
				return res.status(404).json({ result: resUpdate })
			} else if (resUpdate.modifiedCount == 0) {
				return res.status(304).json({ result: resUpdate })
			} else {
				return res.status(200).json({ result: resUpdate });
			}
		} catch (error) {
			return res.status(400).json({ error: error });
		}


	}

	static async get(req: Request, res: Response) {
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

	static async del(req: Request, res: Response) {
		try {
			const idStr: string = (req.body._id);
			const id: ObjectId = new ObjectId(idStr)
			const resDelete = await DBVars.posts.deleteOne({ _id: id, authors: req.authData._id });

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

