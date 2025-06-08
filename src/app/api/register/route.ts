// src/app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "../../lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const client = await clientPromise();
    const users = client.db(process.env.MONGODB_DB).collection("users");

    // check exists
    if (await users.findOne({ username })) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }

    // hash & insert
    const passwordHash = await bcrypt.hash(password, 10);
    await users.insertOne({ username, passwordHash });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
