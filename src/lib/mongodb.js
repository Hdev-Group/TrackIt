import { MongoClient } from "mongodb";

let cachedClient = null;

export async function getMongoClient() {
  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGODB_URI);
    await cachedClient.connect();
  }
  return cachedClient;
}

export async function getMessagesCollection() {
    if (!client) {
      client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      db = client.db("messages");
    }
    return db.collection("message");
  }