import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
    });
}

let client;
let db;
let statusCollection;

async function connectToDatabase() {
    if (!client) {
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        db = client.db("statusStore");
        statusCollection = db.collection("status");
    }
}

export async function POST(req) {
    try {
        const token = req.headers.get("Authorization")?.split("Bearer ")[1];
        if (!token) {
            return NextResponse.json({ error: "Unauthorized: Missing Firebase ID token" }, { status: 401 });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log("Decoded token:", decodedToken);

        req.user = decodedToken;

        await connectToDatabase();

        const { user_id } = await req.json();
        console.log("User ID:", user_id);

        if (!user_id) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        const getStatus = await statusCollection
            .find({ user_id })
            .sort({ timestamp: -1 })
            .toArray();
        console.log("Status:", getStatus);

        return NextResponse.json({ status: getStatus }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}