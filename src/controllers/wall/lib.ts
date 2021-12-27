import { Wall as WallSchema } from "../../schema/schemaWall.js";
import { User } from "../../schema/schemaUser";

import { ObjectId } from 'mongodb';

interface validator {
	author: string,
	validate: boolean
};

export class Wall {

	static async add(req, res) {

		const thisAuthorId = req.authData.id;
		const { title, body, authors } = req.body;

		if (!title || !body || !authors || !(authors.includes(thisAuthorId))) {
			//No title / body / Authors / publisher is not an author
			return res.status(400).json({
				text: "Invalid format"
			});
		}

		var visible: boolean;

		const validators: validator[] = new Array();

		// Check the visibility, if the sending author is the only author, set visibility to 1, otherwise init the authorizations and co-authors
		authors.forEach(author => {
			console.log(author);
			var valAuthor: validator = (author != thisAuthorId) ? { author: author, validate: false } : { author: author, validate: true };
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
			const postData = new WallSchema(post);
			await postData.save();

			return res.status(200).json({
				text: "Success", title: postData.title, message: postData.body, authors: authors, visible: visible, validators: validators
			});

		} catch (error) {
			return res.status(500).json({ error });
		}

	}

	static async validate(req, res) {
		const { postId } = req.body;
		const thisAuthorId = req.authData.id;

		try {
			const valAuth: validator = { author: thisAuthorId, validate: true };
			const postData = await WallSchema.findOne({ $and: [{ _id: postId }, { "validators.author": thisAuthorId }] })
			const updatedValidators: validator[] = new Array();

			postData.validators.forEach(validator => {

				if (validator.author == thisAuthorId) {
					updatedValidators.push({ author: thisAuthorId, validate: true });
				}
				else {
					updatedValidators.push({ author: validator.author, validate: validator.validate });
				}
			});

			try {
				const finalPostData = await WallSchema.findOneAndUpdate({ $and: [{ _id: postId }, { validators: postData.validators }] },
					{ validators: updatedValidators }, { returnDocument: "after" });

				let fullyValidated = true;
				finalPostData.validators.forEach(validator => fullyValidated = (validator.validate == false) ? false : fullyValidated);

				let visible = false;

				if (fullyValidated) {
					const updatedVisible = await WallSchema.updateOne({ _id: postId }, { visible: true });
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
				const wallPost = await WallSchema.findOneAndUpdate({ $and: [{ _id: postId }, { "authors": thisAuthorId }] }, updatedValues);
				return res.status(200).json({ text: "Status 200: Success", data: wallPost });
			} catch (error) {
				return res.status(404).json({ text: "Error 404: Ressource not found, unable to modify" });
			}

		}

	}

	static async get(req, res) {
		try {
			const reqParams = req.query;

			const wallPosts = await (WallSchema.find(reqParams));

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
			await WallSchema.deleteMany();
			return res.status(200).json({ text: "Status 200: Success" });

		}
		catch (error) {
			res.status(400).json({ err: error });
		}
	}

	static async del(req, res) {
		try {

			const id = (req.body.id);
			await WallSchema.deleteOne({ "_id": new ObjectId(id) });

			return res.status(200).json({ text: "Status 200: Success" });

		}
		catch (error) {
			res.status(400).json({ err: error });
		}
	}
}

