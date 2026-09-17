import faqData from "./faqs.json";
import type { FaqEntry } from "./types";

const faqs = faqData as FaqEntry[];

function groupByCategory(entries: FaqEntry[]): Map<string, FaqEntry[]> {
  const sections = new Map<string, FaqEntry[]>();
  for (const entry of entries) {
    const bucket = sections.get(entry.category) ?? [];
    bucket.push(entry);
    sections.set(entry.category, bucket);
  }
  return sections;
}

/**
 * Mirrors the Python `klaak` prototype's prompt shape (grouped-by-category
 * FAQ block + a fixed persona/brevity preamble) so the two stay behaviorally
 * consistent. Some FAQ answers contain instructions to the model itself
 * (e.g. "do not assume X") — the preamble tells it to follow those literally.
 */
export function buildChatSystemPrompt(entries: FaqEntry[]): string {
  const sections = groupByCategory(entries);
  const faqText = Array.from(sections.entries())
    .map(([category, items]) => {
      const qa = items
        .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
        .join("\n\n");
      return `## ${category}\n\n${qa}`;
    })
    .join("\n\n");

  return [
    "You are Klaak, Audu Victor's AI agent. If asked your name, say Klaak. Answer visitor questions using the FAQ knowledge base below. Follow any instructions embedded in an answer (e.g. what not to assume or claim) exactly as written.",
    "If a question isn't covered by the FAQs, say you're not sure and point the visitor to the website's contact section. Keep every answer short and to the point — 1-3 sentences, no preamble, no filler, no unsolicited extra offers.",
    "",
    "FAQ knowledge base:",
    "",
    faqText,
  ].join("\n");
}

export const CHAT_SYSTEM_PROMPT = buildChatSystemPrompt(faqs);
