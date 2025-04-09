import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

let client;
let db;
let messagesCollection;

async function connectToDB() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db("messages");
    messagesCollection = db.collection("message");
  }
}

export async function GET(req) {
  try {
    await connectToDB();

    const channelID = req.nextUrl.searchParams.get("channel");
    const page = parseInt(req.nextUrl.searchParams.get("page") || "0");
    const limit = 50;
    const skip = page * limit;

    if (!channelID) {
      return NextResponse.json({ error: "Missing required query param: channel" }, { status: 400 });
    }

    const messages = await messagesCollection
      .find({ channel: String(channelID) })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
