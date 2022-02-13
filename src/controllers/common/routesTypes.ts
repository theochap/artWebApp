import { Request, Response } from "express"
import { InsertOneResult, ObjectId } from "mongodb"
import HttpStatusCode from "./errorCodes"

declare global {
    namespace Express {
        export interface Request {
            authData: { _id: ObjectId },
            token: string
        }
    }
}

export type Error = { error: string | Object }

export type AuthData = { authData: { _id: ObjectId } }