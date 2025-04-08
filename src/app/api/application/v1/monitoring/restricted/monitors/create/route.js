import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/mongodb";
import checkCredentials from "../../../../../../../../lib/credscheck";

// POST handler
export async function POST(req) {
  try {

    const authed = checkCredentials(req);
    if (!authed) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const monitorData = await req.json();

    const { monitoring, spaceid } = monitorData;

    if (
      !monitoring ||
      typeof monitoring.webURL !== "string" ||
      typeof monitoring.monitorType !== "string" ||
      !spaceid ||
      typeof spaceid.id !== "string"
    ) {
      return NextResponse.json(
        { error: "Missing or invalid fields: webURL, monitorType, and spaceid.id are required" },
        { status: 400 }
      );
    }

    const client = await getMongoClient();
    const db = client.db("monitoring");
    const monitorsCollection = db.collection("monitors");

    const existingMonitor = await monitorsCollection.findOne({
      "monitoring.webURL": monitoring.webURL,
      "spaceid.id": spaceid.id,
    });

    if (existingMonitor) {
      return NextResponse.json(
        { error: "A monitor with this webURL already exists in the same space" },
        { status: 409 }
      );
    }

    await monitorsCollection.insertOne({
      ...monitorData,
      createdBy: userId,
      timestamp: new Date(),
    });

    return NextResponse.json(
      {
        message: "Monitor created successfully",
        monitorURL: monitoring.webURL,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating monitor:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
