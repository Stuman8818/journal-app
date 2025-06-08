"use server";

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
  const data = {
    water: Number(formData.get("water")),
    sleep: Number(formData.get("sleep")),
    outdoors: Number(formData.get("outdoors")),
    activity: Number(formData.get("activity")),
    cookedAtHome: formData.get("cookedAtHome") === "true",
    eatingOutCost: Number(formData.get("eatingOutCost") ?? 0),
  };

  const client = await getClient();
  const db = client.db(process.env.MONGODB_DB);
  await db.collection("dailyLogs").insertOne(data);
  // optionally: revalidatePath('/');
}
