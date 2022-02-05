import config from "config";
import { ObjectId } from "mongodb";
const jwt = require("jsonwebtoken");

export class Authentificate {

    static async authMiddleware(req, res, next) {
        const token: string = req.token;

        if (token) {
            try {
                const decode: { _id: string } = await jwt.verify(token, config.get("jwt.pass"));
                const id = ObjectId.createFromHexString(decode._id);
                req.authData = { _id: id };
                next();
            }
            catch (error) {
                console.log(error)
                return res.status(400).json({ text: "Error 400: Token invalid", err: error })
            }
        }
        else {
            return res.status(400)
                .json({
                    error: "Error 400: Bad Request"
                })
        }


    }

    static async parseToken(req, res, next) {
        const authorizationHeader = req.header("Authorization");
        if (typeof authorizationHeader !== "undefined" && authorizationHeader.startsWith("Bearer ")) {
            const token = authorizationHeader.substring(7, authorizationHeader.length);
            req.token = token;
            next();
        } else {
            res.status(403).json({
                error: "Error 403: Unauthorized"
            })
        }
    }
}