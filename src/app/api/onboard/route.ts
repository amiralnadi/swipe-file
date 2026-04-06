import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { repoExists, createRepo, getUsername } from "@/lib/github";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const token = session.accessToken;
    const owner = await getUsername(token);

    // Check if repo already exists
    const exists = await repoExists(token, owner);
    if (exists) {
      return NextResponse.json({ status: "ready", owner });
    }

    // Create repo and seed it
    await createRepo(token);
    return NextResponse.json({ status: "created", owner });
  } catch (error) {
    console.error("Onboarding failed:", error);
    return NextResponse.json({ error: "Onboarding failed" }, { status: 500 });
  }
}
