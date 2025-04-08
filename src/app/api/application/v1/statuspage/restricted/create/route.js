import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/mongodb";
import checkCredentials from "../../../../../../../../lib/credscheck";

export async function POST(req) {
  try {
    const userId = checkCredentials(req);

    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const statusPageData = await req.json();
    const { 
      orgid, 
      name, 
      monitors, 
      layout, 
      webURL, 
      uptimeVisible, 
      responseTimeVisible, 
      customURL, 
      logo 
    } = statusPageData;

    // Required fields validation
    if (!orgid || !name || !monitors || !Array.isArray(monitors)) {
      return NextResponse.json(
        { error: "Missing or invalid required fields: orgid, name, and monitors are required" },
        { status: 400 }
      );
    }

    if (customURL) {
        const domainPattern = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.[A-Za-z]{2,}$/i;
        if (!domainPattern.test(customURL)) {
          return NextResponse.json({ error: "Invalid custom URL format" }, { status: 400 });
        }
        
        const existingDomain = await statusPagesCollection.findOne({
          customURL: customURL,
          orgid: orgid,
        });
        
        if (existingDomain && !existingDomain.verified) {
          return NextResponse.json({ error: "Domain is pending verification" }, { status: 400 });
        }
        if (existingDomain) {
          return NextResponse.json({ error: "This custom URL is already in use" }, { status: 409 });
        }
    }

    const client = await getMongoClient();
    const db = client.db("statuspages");
    const statusPagesCollection = db.collection("statuspages");

    if (customURL) {
      const existingDomain = await statusPagesCollection.findOne({
        customURL: customURL,
        orgid: orgid,
      });
      if (existingDomain) {
        return NextResponse.json(
          { error: "This custom URL is already in use" },
          { status: 409 }
        );
      }
    }

    const existingPage = await statusPagesCollection.findOne({
      name: name,
      orgid: orgid,
    });
    if (existingPage) {
      return NextResponse.json(
        { error: "A status page with this name already exists in the organization" },
        { status: 409 }
      );
    }

    const newStatusPage = {
      orgid,
      name,
      monitors,
      layout: layout || "layout1",
      webURL: webURL || "",
      uptimeVisible: uptimeVisible !== undefined ? uptimeVisible : true,
      responseTimeVisible: responseTimeVisible !== undefined ? responseTimeVisible : true,
      customURL: customURL || "",
      logo: logo || "",
      createdBy: userId,
      timestamp: new Date(),
    };

    const result = await statusPagesCollection.insertOne(newStatusPage);

    return NextResponse.json(
      {
        message: "Status page created successfully",
        statusPageId: result.insertedId,
        customURL: customURL || null,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating status page:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}