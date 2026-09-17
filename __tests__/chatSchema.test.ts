import { describe, expect, it } from "vitest";
import { chatRequestSchema } from "@/lib/validation/chatSchema";

describe("chatRequestSchema", () => {
  it("accepts a valid single-turn conversation", () => {
    const result = chatRequestSchema.safeParse({
      messages: [{ role: "user", content: "What services do you offer?" }],
    });
    expect(result.success).toBe(true);
  });

  it("accepts alternating multi-turn history", () => {
    const result = chatRequestSchema.safeParse({
      messages: [
        { role: "user", content: "Who is Audu?" },
        { role: "assistant", content: "Audu is an AI automation specialist." },
        { role: "user", content: "What does he build?" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty messages array", () => {
    const result = chatRequestSchema.safeParse({ messages: [] });
    expect(result.success).toBe(false);
  });

  it("rejects an empty message body", () => {
    const result = chatRequestSchema.safeParse({ messages: [{ role: "user", content: "" }] });
    expect(result.success).toBe(false);
  });

  it("rejects an overly long message", () => {
    const result = chatRequestSchema.safeParse({
      messages: [{ role: "user", content: "a".repeat(2001) }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid role", () => {
    const result = chatRequestSchema.safeParse({
      messages: [{ role: "system", content: "hello" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than the maximum number of messages", () => {
    const messages = Array.from({ length: 41 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: "hi",
    }));
    const result = chatRequestSchema.safeParse({ messages });
    expect(result.success).toBe(false);
  });
});
