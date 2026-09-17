export interface FaqEntry {
  category: string;
  question: string;
  answer: string;
}

export type ChatRole = "user" | "assistant";

export interface ChatMessagePayload {
  role: ChatRole;
  content: string;
}
