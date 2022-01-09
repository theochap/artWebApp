// External Dependencies
import * as mongoDB from "mongodb"
import * as dotenv from "dotenv"

// Global Variables
export const Collections: { users?: mongoDB.Collection, posts?: mongoDB.Collection } = {}

// Initialize Connection
export async function ConnectToDatabase() {
    dotenv.config();

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
    await client.connect();

    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    const usersCollection: mongoDB.Collection = db.collection("Users");
    const postsCollection: mongoDB.Collection = db.collection("Posts");

    Collections.users = usersCollection;
    Collections.posts = postsCollection;

    console.log(`Successfully connected to db : ${db.databaseName}. Loaded the collections ${usersCollection.collectionName} and ${postsCollection.collectionName}`);

}