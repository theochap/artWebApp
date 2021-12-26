import { Wall as WallSchema } from "../../schema/schemaWall.js";
import { User } from "../../schema/schemaUser";

import { ObjectId } from 'mongodb';

export class Wall {
	static async add(req, res) {

		const thisAuthorId = req.authData.id;
		console.log("thisAuthorId " + thisAuthorId);
		const { title, body, authors } = req.body;
		console.log("title " + title);
		console.log("body " + body);
		console.log("authors " + authors);

		if (!title || !body || !authors || !(authors.includes(thisAuthorId))) {
			//No title / body / Authors / publisher is not an author
			return res.status(400).json({
				text: "Invalid format"
			});
		}

		var visible;
		// Check the visibility, if the sending author is the only author, set visibility to 1, otherwise check the authorizations and co-authors
		if (authors.length === 1) {
			visible = true;
		}
		else {
			try {
				visible = false;

			} catch (err) {
				return res.status(400).json({ text: "Error 400: Bad Request", error: err });
			}

		}


		// Create the post.
		const post = { title, body, authors, visible };

		try {
			const postData = new WallSchema(post);
			await postData.save();

			return res.status(200).json({
				text: "Success", title: postData.title, message: postData.body, authors: authors, visible: visible
			});

		} catch (error) {
			return res.status(500).json({ error });
		}

	}

	static async put(req, res) {
		const thisAuthorId = req.authData.id;
		const postId = req.body.id;
		const updatedValues = {};

		Object.keys(req.body).forEach((key) => {
			if (["title", "body"].includes(key)) {
				updatedValues[key] = req.body[key];
			}
		});

		console.log(updatedValues);

		if (updatedValues) {
			try {
				const wallPost = await WallSchema.findOneAndUpdate({ $and: [{ _id: postId }, { "authors": thisAuthorId }] }, updatedValues);
				return res.status(200).json({ text: "Success", data: wallPost });
			} catch (error) {
				return res.status(404).json({ text: "Error 404: Ressource not found, unable to modify" });
			}

		}

	}



	static async get(req, res) {
		try {

			await WallSchema.find().then(posts => res.json(posts)).catch(err => res.status(404).json({ err: "No posts found" }));

		} catch (error) {
			return res.status(500).json({
				error
			}
			);
		}
	}

	/* For testing purposes only */
	static async delAll(req, res) {
		try {
			await WallSchema.deleteMany();
			return res.status(200).json({ text: "Success" });

		}
		catch (error) {
			res.status(400).json({ err: error });
		}
	}

	static async del(req, res) {
		try {

			const id = (req.body.id);
			await WallSchema.deleteOne({ "_id": new ObjectId(id) });

			return res.status(200).json({ text: "Success" });

		}
		catch (error) {
			res.status(400).json({ err: error });
		}
	}
}

