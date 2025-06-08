import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      /** The user’s unique ID in your database */
      id: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    /** Stored in the adapter when you authorize */
    id: string;
  }
}
