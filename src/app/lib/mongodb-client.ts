import { MongoClient } from "mongodb";

let cached: MongoClient | null = null;

export async function getClient() {
  if (cached) return cached;
  const uri = process.env.MONGODB_URI!;
  const client = new MongoClient(uri);
  await client.connect();
  cached = client;
  return client;
}