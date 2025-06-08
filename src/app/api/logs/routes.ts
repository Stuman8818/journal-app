// src/app/api/logs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

let cachedClient: MongoClient | null = null;
async function getClient() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  cachedClient = client;
  return client;
}

export async function POST(req: NextRequest) {
  // 1) Authenticate
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 2) Parse body & attach userId
  const body = await req.json();
  const doc = {
    userId: session.user.id,
    date: body.date,
    emotion: body.emotion,
    notes: body.notes,
    water: Number(body.water),
    sleep: Number(body.sleep),
    outdoors: Number(body.outdoors),
    activity: Number(body.activity),
    cookedAtHome: Boolean(body.cookedAtHome),
    eatingOutCost: Number(body.eatingOutCost || 0),
  };

  // 3) Insert
  const client = await getClient();
  const db = client.db(process.env.MONGODB_DB);
  const result = await db.collection("dailyLogs").insertOne(doc);

  return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json([], { status: 401 });
  }

  const client = await getClient();
  const db = client.db(process.env.MONGODB_DB);
  const logs = await db
    .collection("dailyLogs")
    .find({ userId: session.user.id })
    .toArray();

  return NextResponse.json(logs);
}
