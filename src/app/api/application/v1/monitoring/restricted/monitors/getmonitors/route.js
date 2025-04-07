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
let monitorsCollection;

async function connectToDB() {
    if (!client) {
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        db = client.db("monitoring");
        monitorsCollection = db.collection("monitors");
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

        let body = {};
        if (req.body) {
            body = await req.json();
        }

        await connectToDB();

        const orgid = req.nextUrl.searchParams.get("orgid");

        const monitors = await monitorsCollection
            .find({ "spaceid.id": String(orgid) }) 
            .sort({ timestamp: -1 })
            .toArray();
        console.log("Monitors:", monitors);

        return NextResponse.json({ monitors }, { status: 200 });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
