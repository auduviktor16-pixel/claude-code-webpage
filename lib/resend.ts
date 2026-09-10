import "server-only";
import { Resend } from "resend";
import { serverEnv } from "@/lib/serverEnv";

let client: Resend | null = null;

/**
 * Returns null when RESEND_API_KEY isn't configured so callers can fail
 * gracefully instead of throwing at import time (keeps `next build` working
 * without the secret set).
 */
export function getResendClient(): Resend | null {
  if (!serverEnv.resendApiKey) {
    return null;
  }
  if (!client) {
    client = new Resend(serverEnv.resendApiKey);
  }
  return client;
}
