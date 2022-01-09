import { Posts as PostSchema, Validator } from "../../schema/modelPosts.js";
import { User as UserSchema } from "../../schema/modelUser.js";
import { Collections } from "../../services/database.service.js";
import { ObjectId } from 'mongodb';

var LIMIT_CONST = 15;

export class Posts {

	static async updatePosts(req, res) {
		const thisAuthorId = req.authData.id;
		try {

			const lastPosts: Posts[] = new Array();

			const lastPostsQuery = await Collections.posts.find<PostSchema>(
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

			const updatedUser = await Collections.posts.updateOne({ _id: thisAuthorId }, {
				lastPosts: lastPosts
			});
			return res.status(200).json({ text: "Status 200: Success", updatedUser })
		} catch (error) {
			return res.status(404).json({ error: "Error 404: Unable to update the last posts of this user" });
		}
	}

	static async add(req, res) {

		const thisAuthorId = req.authData.id;
		const { title, body, authors } = req.body;

		if (!title || !body || !authors || !(authors.includes(thisAuthorId))) {
			//No title / body / Authors / publisher is not an author
			return res.status(400).json({
				text: "Error 400: Invalid format"
			});
		}

		var visible: boolean;

		const validators: Validator[] = new Array();

		// Check the visibility, if the sending author is the only author, set visibility to 1, otherwise init the authorizations and co-authors
		authors.forEach(author => {
			console.log(author);
			var valAuthor: Validator = (author != thisAuthorId) ? { author: author, validate: false } : { author: author, validate: true };
			validators.push(valAuthor);
		});

		if (authors.length === 1) {
			visible = true;
		}
		else {
			visible = false;
		}

		// Create the post.
		const post = { title, body, authors, visible, validators };

		try {
			await Collections.posts.insertOne(post);

			return res.status(200).json({
				text: "Success", title: post.title, message: post.body, authors: authors, visible: visible, validators: validators
			});

		} catch (error) {
			return res.status(500).json({ error });
		}

	}

	static async validate(req, res) {
		const { postId } = req.body;
		const thisAuthorId = req.authData.id;

		try {
			const valAuth: Validator = { author: thisAuthorId, validate: true };
			const postData = await Collections.posts.findOne({ $and: [{ _id: postId }, { "validators.author": thisAuthorId }] })
			const updatedValidators: Validator[] = new Array();

			postData.validators.forEach(validator => {

				if (validator.author == thisAuthorId) {
					updatedValidators.push({ author: thisAuthorId, validate: true });
				}
				else {
					updatedValidators.push({ author: validator.author, validate: validator.validate });
				}
			});

			try {
				const finalPostDataCursor = await Collections.posts.findOneAndUpdate({ $and: [{ _id: postId }, { validators: postData.validators }] },
					{ validators: updatedValidators }, { returnDocument: "after" });

				const finalPostData = finalPostDataCursor.value;

				let fullyValidated = true;
				finalPostData.validators.forEach(Validator => fullyValidated = (Validator.validate == false) ? false : fullyValidated);

				let visible = false;

				if (fullyValidated) {
					const updatedVisible = await Collections.posts.updateOne({ _id: postId }, { visible: true });
					visible = true;
				}

				return res.status(200).json({ text: "Status 200: Success", validators: finalPostData.validators, visible: visible });

			} catch (error) {
				return res.status(410).json({ text: "Error 410: the ressource you are trying to access is not available anymore", error: error });
			}

		} catch (error) {
			return res.status(404).json({ text: "Error 404: not found", error: error });
		}
	}

	static async put(req, res) {
		const thisAuthorId = req.authData.id;
		const postId = req.body.postId;
		const updatedValues = {};

		Object.keys(req.body).forEach((key) => {
			if (["title", "body"].includes(key)) {
				updatedValues[key] = req.body[key];
			}
		});

		if (updatedValues) {
			try {
				const wallPost = await Collections.posts.findOneAndUpdate({ $and: [{ _id: postId }, { "authors": thisAuthorId }] }, updatedValues);
				return res.status(200).json({ text: "Status 200: Success", data: wallPost });
			} catch (error) {
				return res.status(404).json({ text: "Error 404: Ressource not found, unable to modify" });
			}

		}

	}

	static async get(req, res) {
		try {
			const reqParams = req.query;

			const wallPosts = await (Collections.posts.find(reqParams));

			return res.status(200).json({ text: "Status 200: Success", data: wallPosts });
		} catch (error) {
			return res.status(400).json({
				text: "Error 400: bad request",
				error
			}
			);
		}
	}

	/* For testing purposes only */
	static async delAll(req, res) {
		try {
			await Collections.posts.deleteMany({});
			return res.status(200).json({ text: "Status 200: Success" });

		}
		catch (error) {
			res.status(400).json({ err: error });
		}
	}

	static async del(req, res) {
		try {

			const id = (req.body.id);
			await Collections.posts.deleteOne({ "_id": new ObjectId(id) });

			return res.status(200).json({ text: "Status 200: Success" });

		}
		catch (error) {
			res.status(400).json({ err: error });
		}
	}
}

