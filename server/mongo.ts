import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/fi-rise";
const client = new MongoClient(uri);

let db: Db;

export async function connectToMongo() {
  if (!db) {
    await client.connect();
    db = client.db();
  }
  return db;
}
