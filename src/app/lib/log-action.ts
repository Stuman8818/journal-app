"use server";

import { revalidatePath } from "next/cache";
import { getClient } from "./mongodb-client";

export async function createLog(formData: FormData) {
  const date = formData.get("date") as string;
  const emotion = formData.get("emotion") as string;
  const notes = formData.get("notes") as string;

  const data = {
    water: Number(formData.get("water")),
    sleep: Number(formData.get("sleep")),
    outdoors: Number(formData.get("outdoors")),
    activity: Number(formData.get("activity")),
    cookedAtHome: formData.get("cookedAtHome") === "true",
    eatingOutCost: Number(formData.get("eatingOutCost") ?? 0),
    date,
    emotion,
    notes,
  };

  const client = await getClient();
  const db = client.db(process.env.MONGODB_DB);
  await db.collection("dailyLogs").insertOne(data);
  console.log(db.collection);
  // optionally revalidate the page:
  revalidatePath("/journal");
}
