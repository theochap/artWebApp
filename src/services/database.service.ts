// External Dependencies
import * as mongoDB from "mongodb"
import config from "config";
import { User } from "../schema/modelUser";
import { PostsValidator } from "../schema/modelPosts";
import { Posts } from "../schema/modelPosts";

// Global Variables
export const DBVars: { users?: mongoDB.Collection, posts?: mongoDB.Collection, client?: mongoDB.MongoClient } = {}

// Initialize Connection
export async function ConnectToDatabase() {

    const dbConnString: string = config.get("db.prefix") + "://" + config.get("db.host") + ":" + config.get("db.port");

    const Client = new mongoDB.MongoClient(dbConnString);
    await Client.connect();

    const db: mongoDB.Db = Client.db(config.get("db.name"));

    const postsCollectionName: string = config.get<Posts>("collections.posts");
    const postsCollection = db.collection(postsCollectionName);

    const usersCollectionName: string = config.get<User>("collections.users")
    const usersCollection = db.collection(usersCollectionName);


    await db.command({
        "collMod": postsCollectionName,
        "validator": {
            $jsonSchema: PostsValidator,
            "validationLevel": "moderate"
        }
    });

    await db.command({
        "collMod": usersCollectionName,
        "validator": {
            $jsonSchema: User.DBValidator()
        },
        "validationLevel": "moderate"
    });

    await usersCollection.createIndexes([{ key: { pseudo: 1 }, unique: true }, { key: { email: 1 }, unique: true }]);

    DBVars.users = usersCollection;
    DBVars.posts = postsCollection;
    DBVars.client = Client;


    if (config.util.getEnv('NODE_ENV') !== 'test') {
        console.log(`Successfully connected to db : ${db.databaseName}. Loaded the collections ${usersCollection.collectionName} and ${postsCollection.collectionName}`);
    }
}