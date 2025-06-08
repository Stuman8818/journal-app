// app/api/logs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

let cached: MongoClient | null = null;
async function getClient() {
  if (cached) return cached;
  const uri = process.env.MONGODB_URI!;
  const client = new MongoClient(uri);
  await client.connect();
  cached = client;
  return client;
}

export async function POST(req: NextRequest) {
  const client = await getClient();
  const db = client.db(process.env.MONGODB_DB || "myDatabase");
  const data = await req.json();
  const result = await db.collection("dailyLogs").insertOne(data);
  return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
}

export async function GET() {
  const client = await getClient();
  const db = client.db(process.env.MONGODB_DB || "myDatabase");
  const logs = await db.collection("dailyLogs").find().toArray();
  return NextResponse.json(logs);
}
