import * as dotenv from "dotenv";
const jwt = require("jsonwebtoken");

export class Authentificate {

    static async authMiddleware(req, res, next) {
        const token: string = req.token;
        dotenv.config();
        console.log(token);

        if (token) {
            try {
                const decode = await jwt.verify(token, process.env.JWT_PASS);
                req.authData = decode;
                next();
            }
            catch (error) {
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
            console.log(token);
            next();
        } else {
            res.status(403).json({
                error: "Error 403: Unauthorized"
            })
        }
    }
}