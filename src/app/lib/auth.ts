import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "./mongodb";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise()),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Username/Password",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const client = await clientPromise();
        const users = client.db(process.env.MONGODB_DB).collection("users");

        const user = await users.findOne({
          username: credentials.username,
        });
        if (
          user &&
          (await bcrypt.compare(credentials.password, user.passwordHash))
        ) {
          return { id: user._id.toString(), name: user.username };
        }
        return null;
      },
    }),
  ],
};