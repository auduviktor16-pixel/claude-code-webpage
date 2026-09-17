import "server-only";

/**
 * Secret, server-only values. Import this ONLY from route handlers or other
 * server-only modules (e.g. `lib/resend.ts`) — never from `siteConfig.ts` or
 * anything a client component might import, or the value risks being
 * referenced from client-bundled code.
 */
export const serverEnv = {
  resendApiKey: process.env.RESEND_API_KEY?.trim() || undefined,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY?.trim() || undefined,
};
