import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/mongodb";
import checkCredentials from "../../../../../../../lib/credscheck";

export async function POST(req) {
  try {
    const userId = checkCredentials(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { domain, orgid } = await req.json();

    if (!domain || !orgid) {
      return NextResponse.json(
        { error: "Missing required fields: domain and orgid are required" },
        { status: 400 }
      );
    }

    // Basic domain validation
    const domainPattern = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})*\.[A-Za-z]{2,}$/i;
    if (!domainPattern.test(domain)) {
      return NextResponse.json(
        { error: "Invalid domain format" },
        { status: 400 }
      );
    }

    const client = await getMongoClient();
    const db = client.db("statuspages"); 
    const statusPagesCollection = db.collection("statuspages");

    const existingDomain = await statusPagesCollection.findOne({
        customURL: domain,
        orgid: orgid,
      });
  
      if (existingDomain) {
        return NextResponse.json({ available: false }, { status: 200 });
      }
  
      const verificationToken = Math.random().toString(36).substring(2, 15);
      const dnsRecords = {
        type: "TXT",
        name: `_verify.${domain}`,
        value: `statuspage-verification=${verificationToken}`,
      };
  
      await statusPagesCollection.updateOne(
        { orgid, customURL: domain },
        { $set: { verificationToken, verified: false, timestamp: new Date() } },
        { upsert: true }
      );
  
      return NextResponse.json({
        available: true,
        dnsRecords,
      }, { status: 200 });
  
    } catch (error) {
      console.error("Error checking domain:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }