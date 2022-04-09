"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionsValidator = void 0;
exports.ReactionsValidator = {
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
        parentReaction: {
            bsonType: "objectId",
            description: "must be an objectId, not required, points to a parent comment"
        },
        content: {
            bsonType: "object",
            additionalProperties: false,
            properties: {
                text: {
                    bsonType: "string",
                    description: "the content as a string"
                },
                emoji: {
                    bsonType: "int",
                    description: "an emoji as an int"
                }
            }
        },
        timestamp: {
            bsonType: "date",
            description: "must be a date that indicates the creation of the document. Is required"
        }
    }
};
