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
        const token = req.headers.get("Authorization")?.split("Bearer ")[1];

        if (!token) {
            return NextResponse.json({ error: "Unauthorized: Missing Firebase ID token" }, { status: 401 });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);

        req.user = decodedToken;

        await connectToDB();

        const channelID = req.nextUrl.searchParams.get("channel");
        console.log("Channel ID:", channelID);
        const page = parseInt(req.nextUrl.searchParams.get("page") || 0);

        if (!channelID) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        const messages = await messagesCollection
            .find({ channel: parseInt(channelID) }) 
            .sort({ timestamp: -1 }) 
            .toArray();

        return NextResponse.json({ messages }, { status: 200 });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
