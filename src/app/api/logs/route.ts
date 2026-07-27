// app/api/logs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "../../lib/mongodb";

export async function POST(req: NextRequest) {
  const db = await getDatabase();
  const data = await req.json();
  const result = await db.collection("dailyLogs").insertOne(data);
  return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
}

export async function GET() {
  const db = await getDatabase();
  const logs = await db
    .collection("dailyLogs")
    .find()
    .sort({ date: -1 })
    .toArray(); // always an array!
  return NextResponse.json(logs);
}
