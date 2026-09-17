import { z } from "zod";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty.")
    .max(2000, "That message is too long — please shorten it."),
});

export const chatRequestSchema = z.object({
  // Full conversation so far, oldest first — the Messages API is stateless.
  // Capped well above what the widget's own client-side trimming allows, as
  // a server-side backstop.
  messages: z
    .array(chatMessageSchema)
    .min(1, "At least one message is required.")
    .max(40, "Conversation is too long — please start a new chat."),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
