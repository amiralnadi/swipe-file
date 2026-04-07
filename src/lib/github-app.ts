import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "octokit";

function parsePrivateKey(key: string): string {
  // If stored as base64 (no PEM header present), decode it first
  if (!key.includes("-----")) {
    return Buffer.from(key, "base64").toString("utf8");
  }
  // Otherwise handle literal \n sequences
  return key.replace(/\\n/g, "\n");
}

function getAppOctokit() {
  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.GITHUB_APP_ID!,
      privateKey: parsePrivateKey(process.env.GITHUB_APP_PRIVATE_KEY!),
      clientId: process.env.GITHUB_APP_CLIENT_ID!,
      clientSecret: process.env.GITHUB_APP_CLIENT_SECRET!,
    },
  });
}

/**
 * Get the installation ID for a given GitHub username.
 * Returns null if the app is not installed by that user.
 */
export async function getInstallationId(username: string): Promise<number | null> {
  const octokit = getAppOctokit();
  try {
    const { data } = await octokit.rest.apps.getUserInstallation({ username });
    return data.id;
  } catch {
    return null;
  }
}

/**
 * Get a short-lived installation token for a given installation ID.
 * This token is scoped to only the repos the user granted access to.
 */
export async function getInstallationToken(installationId: number): Promise<string> {
  const auth = createAppAuth({
    appId: process.env.GITHUB_APP_ID!,
    privateKey: parsePrivateKey(process.env.GITHUB_APP_PRIVATE_KEY!),
    clientId: process.env.GITHUB_APP_CLIENT_ID!,
    clientSecret: process.env.GITHUB_APP_CLIENT_SECRET!,
  });
  const result = await auth({ type: "installation", installationId });
  return (result as { token: string }).token;
}

/**
 * Get the GitHub App installation URL for onboarding users.
 */
export function getInstallUrl(): string {
  return `https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_SLUG}/installations/new`;
}
