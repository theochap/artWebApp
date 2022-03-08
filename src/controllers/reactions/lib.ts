import { DBVars } from "../../services/database.service";
import { Request, Response } from "express";
import { User as UserSchema, UserCredentials } from "../../schema/modelUser";
import { DeleteResult, FindCursor, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { AuthData, Error } from "../common/routes";
import HTTP from "../common/errorCodes";
import { ReactionContent, Comments as ReactionSchema } from "../../schema/modelReactions";
import config from "config";
const jwt = require("jsonwebtoken");
const burl = "localhost:8080";



export namespace Reactions {
    export namespace Request {
        export type Add = { content: ReactionContent, post: ObjectId, parentComment?: ObjectId }
        export type Put = { _id: string, updatedContent: string }
        export type Get = Partial<ReactionSchema>
        export type Del = { _id: string }
    }

    export async function Add(
        req: Request<AuthData, never, Request.Add, never>,
        res: Response<InsertOneResult | Error>
    ) {

        try {
            const thisAuthor: ObjectId = req.authData._id;
            const { content, post } = req.body;

            // Create the comment.
            const comment: ReactionSchema = { author: thisAuthor, content, post: new ObjectId(post), timestamp: new Date() };

            // Insert a the parentCommentId to the comment variable if it exists.
            if ("parentComment" in req.body) comment.parentComment = new ObjectId(req.body.parentComment);

            const retComment = await DBVars.reactions.insertOne(comment);

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


    export async function Put(
        req: Request<AuthData, never, Request.Put, never>,
        res: Response<UpdateResult | Error>) {

        const author: ObjectId = req.authData._id;
        const comment: ObjectId = new ObjectId(req.body._id);

        try {
            const resUpdate = await DBVars.reactions.updateOne({ _id: comment, author }, { $set: req.body.updatedContent });
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


    function getAnd(queryParams) {
        return async function get(
            req: Request<never, never, never, Request.Get>,
            res: Response<ReactionSchema[] | Error>) {
            try {
                const reqParams: Request.Get = req.query

                if ("_id" in reqParams) reqParams._id = new ObjectId(req.query._id);

                const foundComments = DBVars.reactions.find<ReactionSchema>({ $and: [req.query, queryParams] });

                const returnedData = await foundComments.toArray();

                return res.status(HTTP.ACCEPTED).json(returnedData);

            } catch (error) {
                return res.status(HTTP.BAD_REQUEST).json({
                    error
                }
                );
            }
        }
    }

    export function GetAll(req: Request<never, never, never, Request.Get>,
        res: Response<ReactionSchema[] | Error>) { return getAnd({})(req, res) }

    export function GetComments(req, res) {
        return getAnd({ "content.text": { $exists: true } })(req, res)
    }

    export function GetEmojis(req, res) {
        return getAnd({ "content.emoji": { $exists: true } })(req, res)
    }

    export async function Del(
        req: Request<never, never, Request.Del, never>,
        res: Response<DeleteResult | Error>) {
        try {
            const _id: ObjectId = new ObjectId(req.body._id);
            const resDelete = await DBVars.reactions.deleteOne({ _id: _id, author: req.authData._id });

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


