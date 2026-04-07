import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getInstallationId, getInstallationToken } from "@/lib/github-app";
import { repoExists } from "@/lib/github";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.githubUsername) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const installationId = await getInstallationId(session.githubUsername);
    if (!installationId) {
      return NextResponse.json({ status: "not_installed" });
    }

    const token = await getInstallationToken(installationId);
    const exists = await repoExists(token, session.githubUsername);

    if (exists) {
      return NextResponse.json({ status: "ready" });
    }

    return NextResponse.json({ status: "needs_repo" });
  } catch (error) {
    console.error("Onboarding failed:", error);
    return NextResponse.json({ error: "Onboarding failed" }, { status: 500 });
  }
}
