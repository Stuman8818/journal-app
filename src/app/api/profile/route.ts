import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/app/lib/log-action";

export async function POST(req: NextRequest) {
  const client = await getClient();
  const db = client.db(process.env.MONGODB_DB || "myDatabase");
  const data = await req.json();
  const result = await db.collection("profile").insertOne(data);
  return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
}

export async function GET() {
  const client = await getClient();
  const db = client.db(process.env.MONGODB_DB!);
  const profile = await db
    .collection("profile")
    .find()
    .sort({ date: -1 })
    .toArray(); // always an array!
  return NextResponse.json(profile);
}
