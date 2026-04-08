import crypto from "crypto";

function getSecret(): string {
  const secret = process.env.MYSWIPE_API_SECRET;
  if (!secret) throw new Error("MYSWIPE_API_SECRET is not set");
  return secret;
}

/**
 * Generate a signed API key that encodes the username.
 * Format: base64url(username).base64url(HMAC signature)
 * No database needed — verifiable standalone.
 */
export function generateApiKey(username: string): string {
  const secret = getSecret();
  const encodedUsername = Buffer.from(username).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(encodedUsername)
    .digest("base64url");
  return `${encodedUsername}.${signature}`;
}

/**
 * Verify an API key and return the username, or null if invalid.
 */
export function verifyApiKey(apiKey: string): string | null {
  try {
    const secret = getSecret();
    const [encodedUsername, signature] = apiKey.split(".");
    if (!encodedUsername || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(encodedUsername)
      .digest("base64url");

    if (signature !== expectedSignature) return null;
    return Buffer.from(encodedUsername, "base64url").toString("utf-8");
  } catch {
    return null;
  }
}
