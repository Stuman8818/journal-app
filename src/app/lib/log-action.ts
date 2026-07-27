"use server";

import { revalidatePath } from "next/cache";
import { getDatabase } from "./mongodb";

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

  const db = await getDatabase();
  await db.collection("dailyLogs").insertOne(data);
  console.log(db.collection);
  // optionally revalidate the page:
  revalidatePath("/journal");
}
