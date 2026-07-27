import { Db, MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI?.trim();
const databaseName = process.env.MONGODB_DB?.trim();

if (!uri) {
  throw new Error("MONGODB_URI is not set. Add it to .env.local or .env.");
}

if (!databaseName) {
  throw new Error("MONGODB_DB is not set. Add it to .env.local or .env.");
}

const options = {
  serverSelectionTimeoutMS: 10_000,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

declare global {
  // Reuse the connection while Next.js reloads modules in development.
  // eslint-disable-next-line no-var
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

const clientPromise =
  global.mongoClientPromise ?? new MongoClient(uri, options).connect();

if (process.env.NODE_ENV !== "production") {
  global.mongoClientPromise = clientPromise;
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db(databaseName);
}

export { databaseName };
export default clientPromise;
