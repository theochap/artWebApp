import { ObjectId } from "mongodb";

export default class User {
    constructor(
        public pseudo: string,
        public email: string,
        public password: string,
        public lastPosts: [{
            id: string,
            authors: string[],
            title: string
            body: string,
            timestamp: Date,
        }],
        public createdAt?: Date,
        public id?: ObjectId) { }
}
