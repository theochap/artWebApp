import { ObjectId } from "mongodb";

export interface Comments {
    _id?: ObjectId,
    author: ObjectId,
    post: ObjectId,
    content: string,
    timestamp: Date
}

export const CommentsValidator = {
    bsonType: "object",
    required: ["author", "post", "content", "timestamp"],
    additionalProperties: false,
    properties: {
        _id: { bsonType: "objectId" },
        author: {
            bsonType: "objectId",
            description: "must be an objectId and is required"
        },
        post: {
            bsonType: "objectId",
            description: "must be an objectId and is required"
        },
        content: {
            bsonType: "string",
            description: "must be a string and is required"
        },
        timestamp: {
            bsonType: "date",
            description: "must be a date that indicates the creation of the document. Is required"
        }
    }

}