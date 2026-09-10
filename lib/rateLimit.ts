const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

/**
 * Pure predicate: given the request timestamps already recorded for a key
 * within the window, decide whether a new request at `now` is allowed.
 * The route handler owns the actual storage (a `Map` — best-effort on a
 * single serverless instance, not a durable distributed limiter).
 */
export function isWithinRateLimit(
  timestamps: number[],
  now: number,
  windowMs: number = WINDOW_MS,
  maxRequests: number = MAX_REQUESTS_PER_WINDOW,
): boolean {
  const recent = timestamps.filter((ts) => now - ts < windowMs);
  return recent.length < maxRequests;
}

const requestLog = new Map<string, number[]>();

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(key) ?? [];
  const allowed = isWithinRateLimit(timestamps, now);

  const recent = timestamps.filter((ts) => now - ts < WINDOW_MS);
  recent.push(now);
  requestLog.set(key, recent);

  return allowed;
}
