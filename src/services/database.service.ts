// External Dependencies
import * as mongoDB from "mongodb"
import config from "config";
var ip = require("ip");
// Global Variables
export const DBVars: { users?: mongoDB.Collection, posts?: mongoDB.Collection, client?: mongoDB.MongoClient } = {}

// Initialize Connection
export async function ConnectToDatabase() {

    const dbConnString: string = config.get("db.prefix") + "://" + ip.address() + ":" + config.get("db.port");
    console.log(dbConnString);

    const Client = new mongoDB.MongoClient(dbConnString);
    await Client.connect();

    const db: mongoDB.Db = Client.db(config.get("db.name"));

    const usersCollection: mongoDB.Collection = db.collection("Users");
    const postsCollection: mongoDB.Collection = db.collection("Posts");

    DBVars.users = usersCollection;
    DBVars.posts = postsCollection;
    DBVars.client = Client;

    await usersCollection.createIndexes([{ key: { pseudo: 1 }, unique: true }, { key: { email: 1 }, unique: true }]);

    console.log(`Successfully connected to db : ${db.databaseName}. Loaded the collections ${usersCollection.collectionName} and ${postsCollection.collectionName}`);

}