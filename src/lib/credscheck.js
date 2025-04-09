import { NextResponse } from "next/server";
import admin from "firebase-admin";
import firebaseActive from "@/lib/firebaseadmin";

export default async function checkCredentials(req) {
    firebaseActive();

    const token = req.headers.get("Authorization")?.split("Bearer ")[1];
    if (!token) {
    return NextResponse.json({ error: "Unauthorized: Missing Firebase ID token" }, { status: 401 });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
return NextResponse.next();
}