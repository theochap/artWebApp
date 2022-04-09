import { ObjectId } from "mongodb";
import internal from "stream";

export interface UserPostData {
	_id: ObjectId,
	pseudo: string
}

export interface Posts {
	_id?: ObjectId,
	authors: UserPostData[] | ObjectId[],
	title: string,
	body: string,
	timestamp?: Date,
	content?: { mimetype: string, size: number, data: BinaryData },
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
				bsonType: "object",
				required: ["_id", "pseudo"],
				additionalProperties: false,
				properties: {
					_id: {
						bsonType: "objectId",
						description: "should be an objectId indicating the author objectId"
					},
					pseudo: {
						bsonType: "string",
						description: "should be a string containing the author pseudo"
					}
				},
				minItems: 1
			},
			uniqueItems: true,
			description: "must be an array of unique objectIds and is required"
		},
		content: {
			bsonType: "object",
			required: ["mimetype", "size", "data"],
			additionalProperties: false,
			properties: {
				data: {
					bsonType: "binData",
					description: "a binary file of relatively small size (<10 MB)"
				},
				size: {
					bsonType: "int",
					description: "Size of the data file"
				},
				mimetype: {
					bsonType: "string",
					description: "mimetype of the file"
				}
			}
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
		lastComments: {
			bsonType: "array",
			description: "must be an array of [ObjectId (comment Id), string (author pseudo), string (comment content)]",
			items: {
				bsonType: "object",
				required: ["_id", "pseudo", "content", "timestamp"],
				additionalProperties: false,
				properties: {
					_id: {
						bsonType: "objectId",
						description: "must be a string representing the Comment ID"
					},
					pseudo: {
						bsonType: "string",
						description: "must be a string indicating the author pseudo"
					},
					content: {
						bsonType: "string",
						description: "must be a string indicating the comment content"
					},
					timestamp: {
						bsonType: "date",
						description: "the date at which the comment was created"
					}
				}
			}
		},
		timestamp: {
			bsonType: "date",
			description: "must be a date that indicates the creation of the document. Is required"
		}
	}
};
