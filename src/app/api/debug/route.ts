import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getInstallationId } from "@/lib/github-app";

export async function GET() {
  const session = await auth();
  const installationId = session?.githubUsername
    ? await getInstallationId(session.githubUsername)
    : null;

  return NextResponse.json({
    hasSession: !!session,
    githubUsername: session?.githubUsername || null,
    appInstalled: !!installationId,
    installationId,
  });
}
