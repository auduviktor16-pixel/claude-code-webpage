import { describe, expect, it } from "vitest";
import { buildChatSystemPrompt } from "@/lib/chat/systemPrompt";
import type { FaqEntry } from "@/lib/chat/types";

const sampleFaqs: FaqEntry[] = [
  { category: "About Audu", question: "Who is Audu?", answer: "Audu is a builder." },
  { category: "Contact", question: "How do I reach Audu?", answer: "Use the contact form." },
];

describe("buildChatSystemPrompt", () => {
  it("groups FAQ entries under a heading per category", () => {
    const prompt = buildChatSystemPrompt(sampleFaqs);
    expect(prompt).toContain("## About Audu");
    expect(prompt).toContain("## Contact");
  });

  it("includes every question and answer verbatim", () => {
    const prompt = buildChatSystemPrompt(sampleFaqs);
    for (const faq of sampleFaqs) {
      expect(prompt).toContain(faq.question);
      expect(prompt).toContain(faq.answer);
    }
  });

  it("instructs the model to defer to the contact section when unsure", () => {
    const prompt = buildChatSystemPrompt(sampleFaqs);
    expect(prompt).toMatch(/contact section/i);
  });

  it("instructs the model to keep answers short", () => {
    const prompt = buildChatSystemPrompt(sampleFaqs);
    expect(prompt).toMatch(/short/i);
  });

  it("groups entries sharing a category under one heading rather than repeating it", () => {
    const grouped: FaqEntry[] = [
      ...sampleFaqs,
      { category: "About Audu", question: "What does he build?", answer: "AI agents." },
    ];
    const prompt = buildChatSystemPrompt(grouped);
    const occurrences = prompt.split("## About Audu").length - 1;
    expect(occurrences).toBe(1);
  });
});
