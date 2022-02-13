import { DBVars } from "../../services/database.service";
import { Request, Response } from "express";
import { User as UserSchema, UserCredentials } from "../../schema/modelUser";
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { AuthData, Error } from "../common/routesTypes";
import HTTP from "../common/errorCodes";
import { Comments as CommentSchema } from "../../schema/modelComments";
import config from "config";
const jwt = require("jsonwebtoken");
const burl = "localhost:8080";

export namespace Comments {
    export async function add(
        req: Request<AuthData, never, { content: string, post: ObjectId }, never>,
        res: Response<InsertOneResult | Error>
    ) {

        try {
            const thisAuthor: ObjectId = req.authData._id;
            const { content, post } = req.body;

            // Create the comment.
            const comment: CommentSchema = { author: thisAuthor, content, post, timestamp: new Date() };

            const retComment = await DBVars.comments.insertOne(comment);

            return res.status(HTTP.CREATED).json(
                retComment
            );

        } catch (error) {
            if (config.util.getEnv('NODE_ENV') !== 'test') {
                console.log(error)
            }
            return res.status(HTTP.BAD_REQUEST).json({ error });
        }

    }


    export async function put(
        req: Request<AuthData, never, { _id: string, updatedContent: string }, never>,
        res: Response<UpdateResult | Error>) {

        const author: ObjectId = req.authData._id;
        const comment: ObjectId = new ObjectId(req.body._id);

        try {
            const resUpdate = await DBVars.posts.updateOne({ _id: comment, author }, { $set: req.body.updatedContent });
            if (resUpdate.matchedCount == 0) {
                return res.status(HTTP.NOT_FOUND).json({ error: resUpdate })
            } else if (resUpdate.modifiedCount == 0) {
                return res.status(HTTP.NOT_MODIFIED).json(resUpdate)
            } else {
                return res.status(HTTP.CREATED).json(resUpdate);
            }
        } catch (error) {
            return res.status(HTTP.BAD_REQUEST).json({ error: error });
        }


    }

    export async function get(
        req: Request<never, never, never, Partial<CommentSchema>>,
        res: Response<CommentSchema[] | Error>) {
        try {
            const reqParams: Partial<CommentSchema> = req.query

            if (reqParams._id) {
                reqParams._id = new ObjectId(req.query._id);
            }

            const foundComments = (DBVars.comments.find<CommentSchema>(reqParams));
            const returnedData = await foundComments.toArray();

            return res.status(200).json(returnedData);

        } catch (error) {
            return res.status(400).json({
                error
            }
            );
        }
    }

    export async function del(
        req: Request<never, never, { _id: string }, never>,
        res: Response<DeleteResult | Error>) {
        try {
            const _id: ObjectId = new ObjectId(req.body._id);
            const resDelete = await DBVars.posts.deleteOne({ _id: _id, author: req.authData._id });

            if (resDelete.deletedCount == 0) {
                return res.status(404).json(resDelete)
            } else {
                return res.status(200).json(resDelete);
            }
        }
        catch (error) {
            res.status(400).json({ error: error });
        }
    }
}


