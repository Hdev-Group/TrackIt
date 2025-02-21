import { MongoClient } from "mongodb";
import admin from "firebase-admin";
import { NextResponse } from "next/server";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("messages");
const messagesCollection = db.collection("message");

export async function POST(req) {
  try {
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Missing Firebase ID token" }, { status: 401 });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Decoded token:", decodedToken); 

    req.user = decodedToken;

    const body = await req.json();
    const { message, channel, userid } = body;

    if (!message || !channel || !userid) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await messagesCollection.insertOne({
      message,
      channel,
      userid,
      timestamp: new Date(),
    });

    return NextResponse.json({ message: "Message sent" }, { status: 200 });
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ error: "Unauthorized: Invalid Firebase ID token", details: error.message }, { status: 401 });
  }
}
