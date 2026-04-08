import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateApiKey } from "@/lib/api-key";

export async function GET() {
  const session = await auth();
  if (!session?.githubUsername) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const apiKey = generateApiKey(session.githubUsername);
  return NextResponse.json({ apiKey });
}
