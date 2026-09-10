import { describe, expect, it } from "vitest";
import { pickActiveSection, type SectionObservation } from "@/hooks/useActiveSection";

function observation(overrides: Partial<SectionObservation>): SectionObservation {
  return {
    id: "services",
    isIntersecting: false,
    intersectionRatio: 0,
    boundingTop: 0,
    ...overrides,
  };
}

describe("pickActiveSection", () => {
  it("keeps the current active section when nothing is intersecting", () => {
    const result = pickActiveSection(
      [observation({ id: "services", isIntersecting: false })],
      "work",
    );
    expect(result).toBe("work");
  });

  it("picks the only intersecting section", () => {
    const result = pickActiveSection(
      [
        observation({ id: "services", isIntersecting: false }),
        observation({ id: "work", isIntersecting: true, intersectionRatio: 0.6 }),
      ],
      null,
    );
    expect(result).toBe("work");
  });

  it("picks the section with the highest intersection ratio", () => {
    const result = pickActiveSection(
      [
        observation({ id: "services", isIntersecting: true, intersectionRatio: 0.3 }),
        observation({ id: "work", isIntersecting: true, intersectionRatio: 0.8 }),
      ],
      null,
    );
    expect(result).toBe("work");
  });

  it("breaks ties by proximity to the top of the viewport", () => {
    const result = pickActiveSection(
      [
        observation({
          id: "services",
          isIntersecting: true,
          intersectionRatio: 0.5,
          boundingTop: 200,
        }),
        observation({
          id: "work",
          isIntersecting: true,
          intersectionRatio: 0.5,
          boundingTop: 20,
        }),
      ],
      null,
    );
    expect(result).toBe("work");
  });
});
