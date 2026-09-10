import { describe, expect, it } from "vitest";
import { shouldReveal } from "@/lib/scrollReveal";

describe("shouldReveal", () => {
  it("is false when not intersecting, regardless of ratio", () => {
    expect(shouldReveal(false, 1, 0.2)).toBe(false);
  });

  it("is false when intersecting but below threshold", () => {
    expect(shouldReveal(true, 0.1, 0.2)).toBe(false);
  });

  it("is true when intersecting and at the threshold", () => {
    expect(shouldReveal(true, 0.2, 0.2)).toBe(true);
  });

  it("is true when intersecting and above the threshold", () => {
    expect(shouldReveal(true, 0.9, 0.2)).toBe(true);
  });

  it("uses the default threshold when none is provided", () => {
    expect(shouldReveal(true, 0.05)).toBe(false);
    expect(shouldReveal(true, 0.5)).toBe(true);
  });
});
