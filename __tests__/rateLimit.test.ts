import { describe, expect, it } from "vitest";
import { isWithinRateLimit } from "@/lib/rateLimit";

describe("isWithinRateLimit", () => {
  it("allows a request when there is no prior history", () => {
    expect(isWithinRateLimit([], Date.now(), 60_000, 5)).toBe(true);
  });

  it("allows a request under the max within the window", () => {
    const now = 100_000;
    const timestamps = [now - 1000, now - 2000, now - 3000];
    expect(isWithinRateLimit(timestamps, now, 60_000, 5)).toBe(true);
  });

  it("blocks a request at the max within the window", () => {
    const now = 100_000;
    const timestamps = [now - 1000, now - 2000, now - 3000, now - 4000, now - 5000];
    expect(isWithinRateLimit(timestamps, now, 60_000, 5)).toBe(false);
  });

  it("ignores timestamps outside the window", () => {
    const now = 100_000;
    const timestamps = [now - 120_000, now - 130_000, now - 140_000, now - 150_000, now - 160_000];
    expect(isWithinRateLimit(timestamps, now, 60_000, 5)).toBe(true);
  });
});
