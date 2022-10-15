// External Dependencies
import * as mongoDB from "mongodb"
import config from "config";
import { User } from "../schema/modelUser";
import { PostsValidator } from "../schema/modelPosts";
import { Posts } from "../schema/modelPosts";
import { Comments, ReactionsValidator } from "../schema/modelReactions";

// Global Variables
export var DBVars: { users?: mongoDB.Collection<User>, posts?: mongoDB.Collection<Posts>, reactions?: mongoDB.Collection<Comments>, client?: mongoDB.MongoClient, db?: mongoDB.Db, collNames?: string[] } = {}

async function safeCreateDB<T>(collectionName: string, collectionValidator?: Object): Promise<mongoDB.Collection<T>> {

    let retCollection: mongoDB.Collection<T>

    if (DBVars.collNames.includes(collectionName)) {

        retCollection = DBVars.db.collection<T>(collectionName);

        await DBVars.db.command({
            "collMod": collectionName,
            "validator": {
                $jsonSchema: collectionValidator,
            },
            "validationLevel": "moderate"
        });

    } else {
        retCollection = await DBVars.db.createCollection(collectionName, {
            validator: {
                $jsonSchema: PostsValidator,
            }, validationLevel: "moderate"
        })
        DBVars.collNames.push(collectionName)
    }

    return retCollection
}

// Initialize Connection
export async function ConnectToDatabase() {

    const dbConnString: string = config.get("db.prefix") + "://" + config.get("db.host") + ":" + config.get("db.port");

    DBVars.client = new mongoDB.MongoClient(dbConnString);
    await DBVars.client.connect();

    DBVars.db = DBVars.client.db(config.get("db.name"));

    let collectionsObj = await DBVars.db.listCollections().toArray()
    DBVars.collNames = collectionsObj.map(collectionEl => collectionEl.name)

    DBVars.posts = await safeCreateDB<Posts>(config.get("collections.posts"), PostsValidator)
    DBVars.users = await safeCreateDB<User>(config.get("collections.users"), User.DBValidator())
    await DBVars.users.createIndexes([{ key: { pseudo: 1 }, unique: true }, { key: { email: 1 }, unique: true }]);
    DBVars.reactions = await safeCreateDB<Comments>(config.get("collections.comments"), ReactionsValidator)

    if (config.util.getEnv('NODE_ENV') !== 'test') {
        console.log(`Successfully connected to db : ${DBVars.db.databaseName}. Loaded the collections ${DBVars.users.collectionName} and ${DBVars.posts.collectionName}`);
    }
}