// External Dependencies
import * as mongoDB from "mongodb"
import config from "config";
import { User } from "../schema/modelUser";

// Global Variables
export const DBVars: { users?: mongoDB.Collection, posts?: mongoDB.Collection, client?: mongoDB.MongoClient } = {}

// Initialize Connection
export async function ConnectToDatabase() {

    const dbConnString: string = config.get("db.prefix") + "://" + config.get("db.host") + ":" + config.get("db.port");

    const Client = new mongoDB.MongoClient(dbConnString);
    await Client.connect();

    const db: mongoDB.Db = Client.db(config.get("db.name"));

    const usersCollectionName: string = config.get("collections.users")
    const usersCollection = db.collection(usersCollectionName);

    await usersCollection.createIndexes([{ key: { pseudo: 1 }, unique: true }, { key: { email: 1 }, unique: true }]);

    await db.command({
        "collMod": usersCollectionName,
        "validator": {
            $jsonSchema: User.DBValidator()
        },
        "validationLevel": "moderate"
    });

    const postsCollection: mongoDB.Collection = db.collection(config.get("collections.posts"));

    DBVars.users = usersCollection;
    DBVars.posts = postsCollection;
    DBVars.client = Client;


    if (config.util.getEnv('NODE_ENV') !== 'test') {
        console.log(`Successfully connected to db : ${db.databaseName}. Loaded the collections ${usersCollection.collectionName} and ${postsCollection.collectionName}`);
    }
}