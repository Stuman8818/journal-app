// app/api/logs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getClient } from "../../lib/mongodb-client";

export async function POST(req: NextRequest) {
  const client = await getClient();
  const db = client.db(process.env.MONGODB_DB || "myDatabase");
  const data = await req.json();
  const result = await db.collection("dailyLogs").insertOne(data);
  return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
}

export async function GET() {
  const client = await getClient();
  const db = client.db(process.env.MONGODB_DB!);
  const logs = await db
    .collection("dailyLogs")
    .find()
    .sort({ date: -1 })
    .toArray(); // always an array!
  return NextResponse.json(logs);
}
