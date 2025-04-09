import { NextResponse } from "next/server";
import admin from "@/lib/firebaseAdmin";
import { getMessagesCollection } from "@/lib/mongodb";

export async function POST(req) {


  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Missing Firebase ID token" }, { status: 401 });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const { message, channel, userid } = await req.json();

    if (!message || !channel || !userid) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const messagesCollection = await getMessagesCollection();

    await messagesCollection.insertOne({
      message,
      channel,
      userid,
      sentBy: userId,
      timestamp: new Date(),
    });

    return NextResponse.json({ message: "Message sent" }, { status: 200 });

  } catch (error) {
    console.error("Error handling message send:", error);
    return NextResponse.json({
      error: "Unauthorized or internal server error",
      details: error.message
    }, { status: error.code === "auth/argument-error" ? 401 : 500 });
  }
}
