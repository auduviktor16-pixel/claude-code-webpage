import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/validation/contactSchema";

const validPayload = {
  name: "Jordan Smith",
  email: "jordan@example.com",
  company: "Acme Inc",
  message: "We need help automating our lead routing workflow end to end.",
  company_website: "",
};

describe("contactSchema", () => {
  it("accepts a fully valid submission", () => {
    const result = contactSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("accepts a valid submission without a company", () => {
    const { company, ...rest } = validPayload;
    void company;
    const result = contactSchema.safeParse(rest);
    expect(result.success).toBe(true);
  });

  it("rejects a missing name", () => {
    const result = contactSchema.safeParse({ ...validPayload, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a single-character name", () => {
    const result = contactSchema.safeParse({ ...validPayload, name: "J" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = contactSchema.safeParse({ ...validPayload, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing email", () => {
    const result = contactSchema.safeParse({ ...validPayload, email: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an empty message", () => {
    const result = contactSchema.safeParse({ ...validPayload, message: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a trivially short message", () => {
    const result = contactSchema.safeParse({ ...validPayload, message: "hi there" });
    expect(result.success).toBe(false);
  });

  it("rejects a submission with a filled honeypot field", () => {
    const result = contactSchema.safeParse({
      ...validPayload,
      company_website: "http://spam.example",
    });
    expect(result.success).toBe(false);
  });

  it("trims whitespace-padded fields", () => {
    const result = contactSchema.safeParse({
      ...validPayload,
      name: "  Jordan Smith  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Jordan Smith");
    }
  });
});
