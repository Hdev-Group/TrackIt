import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/mongodb";
import checkCredentials from "../../../../../../../lib/credscheck"; 
import dns from 'dns/promises';

export async function POST(req) {
  try {
    const userId = checkCredentials(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { domain, orgid } = await req.json();

    if (!domain || !orgid) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await getMongoClient();
    const db = client.db("statuspages");
    const statusPagesCollection = db.collection("statuspages");

    const page = await statusPagesCollection.findOne({
      customURL: domain,
      orgid: orgid,
    });

    if (!page || !page.verificationToken) {
      return NextResponse.json({ error: "Domain not found or not pending verification" }, { status: 404 });
    }

    // Check DNS TXT record
    try {
      const records = await dns.resolveTxt(`_verify.${domain}`);
      const verified = records.some(record => 
        record.includes(`statuspage-verification=${page.verificationToken}`)
      );

      if (verified) {
        await statusPagesCollection.updateOne(
          { customURL: domain, orgid },
          { $set: { verified: true, verificationTimestamp: new Date() } }
        );
      }

      return NextResponse.json({ verified }, { status: 200 });
    } catch (dnsError) {
      return NextResponse.json({ verified: false }, { status: 200 });
    }

  } catch (error) {
    console.error("Error verifying domain:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}