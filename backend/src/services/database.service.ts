// External Dependencies
import {Pool} from "pg";
import config from "config";
import { User } from "../schema/modelUser";
import { PostsValidator } from "../schema/modelPosts";
import { Posts } from "../schema/modelPosts";
import { Comments, ReactionsValidator } from "../schema/modelReactions";


// Global Variables
export var DBVars: { users?: mongoDB.Collection<User>, posts?: mongoDB.Collection<Posts>, reactions?: mongoDB.Collection<Comments>, client?: mongoDB.MongoClient, db?: mongoDB.Db, collNames?: string[] } = {}


// Initialize Connection
export async function ConnectToDatabase() {

    const dbConnString: string = config.get("db.prefix") + "://" + config.get("db.host") + ":" + config.get("db.port");

    DBVars.client = new Pool({
        user: config.get("db.user"),
        host: config.get("db.host"),
        database: config.get("db.name"),
        password: config.get("db.password"),
        port: config.get("db.port"),
    });
    await DBVars.client.connect();

    DBVars.db = DBVars.client.db(config.get("db.name"));

    if (config.util.getEnv('NODE_ENV') !== 'test') {
        console.log(`Successfully connected to db : ${DBVars.db.databaseName}. Loaded the collections ${DBVars.users.collectionName} and ${DBVars.posts.collectionName}`);
    }
}