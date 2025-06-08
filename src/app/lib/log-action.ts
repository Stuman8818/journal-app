// app/lib/log-action.ts
"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { MongoClient } from "mongodb";

let cached: MongoClient | null = null;
async function getClient() {
  if (cached) return cached;
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  cached = client;
  return client;
}

export async function createLog(formData: FormData) {
  // 1) Get the user session
  const session = await getServerSession(authOptions);
  console.log(session, "session");
  //   if (!session?.user?.id) {
  //     throw new Error("Not authenticated");
  //   }
  const userId = (session?.user as any).id as string;

  // 2) Build your data object, including userId
  const data = {
    userId,
    date: formData.get("date") as string,
    emotion: formData.get("emotion") as string,
    notes: formData.get("notes") as string,
    water: Number(formData.get("water")),
    sleep: Number(formData.get("sleep")),
    outdoors: Number(formData.get("outdoors")),
    activity: Number(formData.get("activity")),
    cookedAtHome: formData.get("cookedAtHome") === "true",
    eatingOutCost: Number(formData.get("eatingOutCost") ?? 0),
  };

  // 3) Insert
  const client = await getClient();
  const db = client.db(process.env.MONGODB_DB);
  await db.collection("dailyLogs").insertOne(data);
}
