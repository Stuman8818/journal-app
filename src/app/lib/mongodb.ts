import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in env");
}

const uri = process.env.MONGODB_URI;
let cachedClient: MongoClient | null = null;

/** Returns a connected MongoClient, cached across hot-reloads */
export default async function clientPromise() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}
