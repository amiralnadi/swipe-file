import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "octokit";

export async function GET() {
  const session = await auth();

  let installationId = null;
  let error = null;

  if (session?.githubUsername) {
    try {
      const privateKey = process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, "\n");
      const octokit = new Octokit({
        authStrategy: createAppAuth,
        auth: {
          appId: process.env.GITHUB_APP_ID!,
          privateKey,
          clientId: process.env.GITHUB_APP_CLIENT_ID!,
          clientSecret: process.env.GITHUB_APP_CLIENT_SECRET!,
        },
      });
      const { data } = await octokit.rest.apps.getUserInstallation({ username: session.githubUsername });
      installationId = data.id;
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }

  return NextResponse.json({
    hasSession: !!session,
    githubUsername: session?.githubUsername || null,
    appInstalled: !!installationId,
    installationId,
    error,
    envCheck: {
      hasAppId: !!process.env.GITHUB_APP_ID,
      hasClientId: !!process.env.GITHUB_APP_CLIENT_ID,
      hasClientSecret: !!process.env.GITHUB_APP_CLIENT_SECRET,
      hasPrivateKey: !!process.env.GITHUB_APP_PRIVATE_KEY,
      privateKeyStart: process.env.GITHUB_APP_PRIVATE_KEY?.substring(0, 40) || null,
    },
  });
}
