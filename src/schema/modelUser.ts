import { ObjectId } from "mongodb";
import jwt = require("jwt-simple");
import config from "config";
import passwordHash = require("password-hash");

export interface UserCredentials {
    email: string,
    pseudo: string,
    password: string
}

export class User {
    constructor(
        public _id: ObjectId,
        public pseudo: string,
        public email: string,
        public password?: string,
        public createdAt?: Date,) {

    }

    public getToken(): string {
        const data = { _id: this._id };
        return jwt.encode(data, config.get("jwt.pass"));
    }

    public authenticate(password) {
        return passwordHash.verify(password, this.password);
    }

    public static DBValidator() {
        return {
            bsonType: "object",
            required: ["pseudo", "email", "password", "timestamp"],
            additionalProperties: false,
            properties: {
                _id: {
                    bsonType: "objectId"
                },
                pseudo: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                email: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                password: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                follows: {
                    bsonType: "array",
                    description: "List of users followed by a given user",
                    items: {
                        bsonType: "objectId"
                    },
                    uniqueItems: true
                },
                timestamp: {
                    bsonType: "date",
                    description: "must be a date indicating the creation of the document. Is required"
                }

            }
        }
    }
}
