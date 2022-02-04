import { ObjectId } from "mongodb";

export interface Validator {
	authorId: ObjectId,
	validate: boolean
}

export interface Posts {
	_id: ObjectId,
	authors: [ObjectId],
	title: string,
	body: string,
	timestamp?: Date,
	visible?: boolean,
	validators?: Validator[]
};

export const PostsValidator = {
	bsonType: "object",
	required: ["authors", "title", "body"],
	properties: {
		authors: {
			bsonType: "array",
			items: {
				bsonType: "objectId",
				description: "should be an objectId indicating the author objectId"
			},
			uniqueItems: true,
			minItems: 1,
			description: "must be an array of unique objectIds and is required"
		},
		title: {
			bsonType: "string",
			description: "must be a string and is required"
		},
		body: {
			bsonType: "string",
			description: "must be a string and is required"
		},
	}
};
