import { ObjectId } from "mongodb";

export interface Posts {
	_id?: ObjectId,
	authors: ObjectId[],
	title: string,
	body: string,
	timestamp?: Date,
	visible?: boolean,
	validators?: ObjectId[]
};

export const PostsValidator = {
	bsonType: "object",
	required: ["authors", "title", "body", "timestamp"],
	additionalProperties: false,
	properties: {
		_id: { bsonType: "objectId" },
		title: {
			bsonType: "string",
			description: "must be a string and is required"
		},
		authors: {
			bsonType: "array",
			items: {
				bsonType: "objectId",
				description: "should be an objectId indicating the author objectId"
			},
			uniqueItems: true,
			description: "must be an array of unique objectIds and is required"
		},
		body: {
			bsonType: "string",
			description: "must be a string and is required"
		},
		validators: {
			bsonType: "array",
			description: "must be an array of ObjectIds",
			items: {
				bsonType: "objectId"
			},
			uniqueItems: true
		},
		timestamp: {
			bsonType: "date",
			description: "must be a date that indicates the creation of the document. Is required"
		}
	}
};
