// app/journal/page.tsx
import JournalHistory, { Post } from "./journal-history";
import { getClient } from "../lib/log-action";

export default async function JournalPage() {
  const client = await getClient();
  const raw = await client
    .db(process.env.MONGODB_DB)
    .collection("dailyLogs")
    .find()
    .sort({ date: -1 })
    .toArray();

  return <JournalHistory />;
}
