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
	timestamp: Date,
	visible: boolean,
	validators: Validator[]
};

