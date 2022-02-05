import { ObjectId } from "mongodb";

export interface Validator {
	authorId: string,
	validate: boolean
}

export interface Posts {
	_id?: ObjectId,
	authors: [string],
	title: string,
	body: string,
	timestamp?: Date,
	visible?: boolean,
	validators?: Validator[]
};

export const PostsValidator = {
	bsonType: "object",
	required: ["authors", "title", "body", "visible"],
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
				bsonType: "string",
				description: "should be an objectId indicating the author objectId"
			},
			uniqueItems: true,
			description: "must be an array of unique objectIds and is required"
		},
		body: {
			bsonType: "string",
			description: "must be a string and is required"
		},
		visible: {
			bsonType: "bool",
			description: "must be a boolean and is required"
		},
		validators: {
			bsonType: "array",
			description: "must be an array of objects",
			items: {
				bsonType: "object",
				additionalProperties: false,
				properties: {
					authorId: {
						bsonType: "string",
						description: "must be a string",
					},
					validate: {
						bsonType: "bool",
						description: "must be a boolean",
					}
				}
			}
		}
	}
};
