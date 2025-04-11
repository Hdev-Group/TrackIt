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

        req.user = decodedToken;

        await connectToDatabase();

        const { status } = await req.json();
        console.log("Status:", status);

        if (!status) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }
        const existingStatus = await statusCollection?.findOne({ user_id: req.user.user_id });

        if (existingStatus) {
            await statusCollection.updateOne(
            { user_id: req.user.user_id },
            { $set: { status: status, timestamp: new Date() } }
            );
            console.log("Status updated:", status);
        } else {
            await statusCollection.insertOne({
            user_id: req.user.user_id,
            status: status,
            timestamp: new Date()
            });
            console.log("New status created:", status);
        }

        return NextResponse.json({ status: status }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}