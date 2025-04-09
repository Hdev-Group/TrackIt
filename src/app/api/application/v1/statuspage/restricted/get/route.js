import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import admin from "firebase-admin";
import checkCredentials from "@/lib/credscheck";

let client;
let db;
let monitorsCollection;

async function connectToDB() {
    if (!client) {
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        db = client.db("statuspages");
        monitorsCollection = db.collection("statuspages");
    }
}

export async function GET(req) {
    try {

        const auth = checkCredentials(req)

        if (!auth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let body = {};
        if (req.body) {
            body = await req.json();
        }

        await connectToDB();

        const orgid = req.nextUrl.searchParams.get("orgid");

        const monitors = await monitorsCollection
            .find({ "orgid": String(orgid) }) 
            .sort({ timestamp: -1 })
            .toArray();
        console.log("Pages:", monitors);

        return NextResponse.json({ monitors }, { status: 200 });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
