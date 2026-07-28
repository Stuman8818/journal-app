import { Db, MongoClient, ServerApiVersion } from "mongodb";

const configuredUri = process.env.MONGODB_URI?.trim();
const databaseName = process.env.MONGODB_DB?.trim();

if (!configuredUri) {
  throw new Error("MONGODB_URI is not set. Add it to .env.local or .env.");
}

if (!databaseName) {
  throw new Error("MONGODB_DB is not set. Add it to .env.local or .env.");
}

function withoutSrvLookup(connectionString: string): string {
  const atlasHost = "journaldata.uk5jyqr.mongodb.net";

  if (!connectionString.startsWith(`mongodb+srv://${atlasHost}`)) {
    const parsed = new URL(connectionString);
    if (parsed.hostname !== atlasHost) return connectionString;
  }

  const parsed = new URL(connectionString);
  const hosts = [0, 1, 2]
    .map(
      (index) =>
        `ac-vzqxjld-shard-00-0${index}.uk5jyqr.mongodb.net:27017`
    )
    .join(",");

  parsed.searchParams.set("authSource", "admin");
  parsed.searchParams.set("replicaSet", "atlas-zjll4z-shard-0");
  parsed.searchParams.set("tls", "true");

  return `mongodb://${parsed.username}:${parsed.password}@${hosts}${parsed.pathname}?${parsed.searchParams}`;
}

// Avoid Node's SRV resolver on Windows networks where Compass can connect but
// direct DNS queries time out.
const uri = withoutSrvLookup(configuredUri);

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
