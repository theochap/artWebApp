import { ObjectId } from "mongodb";
import jwt = require("jwt-simple");
import * as dotenv from "dotenv";
import passwordHash = require("password-hash");

export class User {
    constructor(
        public _id: ObjectId,
        public pseudo?: string,
        public email?: string,
        public password?: string,
        public lastPosts?: [{
            id: string,
            authors: string[],
            title: string
            body: string,
            timestamp: Date,
        }],
        public createdAt?: Date,) {

    }

    getToken(): string {
        const data = { _id: this._id };
        dotenv.config();
        return jwt.encode(data, process.env.JWT_PASS);
    }
    authenticate(password) {
        return passwordHash.verify(password, this.password);
    }
}
