import Anthropic from "@anthropic-ai/sdk";
import { chatRequestSchema } from "@/lib/validation/chatSchema";
import { CHAT_SYSTEM_PROMPT } from "@/lib/chat/systemPrompt";
import { checkRateLimit } from "@/lib/rateLimit";
import { serverEnv } from "@/lib/serverEnv";
import { env } from "@/lib/env";

const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 1024;
// Higher and separately-keyed than the contact form's default (5/60s) — a
// real back-and-forth conversation naturally sends many more requests than
// a one-shot form submission, and the two features shouldn't throttle each
// other just for sharing an IP.
const CHAT_RATE_LIMIT_WINDOW_MS = 60_000;
const CHAT_RATE_LIMIT_MAX_REQUESTS = 20;
const FALLBACK_MESSAGE = `Something went wrong on my end. Please try again, or reach out directly at ${env.contactEmail}.`;

function textResponse(message: string, status: number) {
  return new Response(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(`chat:${ip}`, CHAT_RATE_LIMIT_WINDOW_MS, CHAT_RATE_LIMIT_MAX_REQUESTS)) {
    return textResponse("You're sending messages a little too fast. Please wait a moment and try again.", 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return textResponse("Invalid request.", 400);
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return textResponse("Please check your message and try again.", 400);
  }

  const { messages } = parsed.data;
  if (messages[0]?.role !== "user") {
    return textResponse("Invalid conversation history.", 400);
  }

  if (!serverEnv.anthropicApiKey) {
    console.error("Chat message received but ANTHROPIC_API_KEY is not configured — see .env.example.");
    return textResponse(
      `The chat assistant isn't configured right now. Please use the contact form or email ${env.contactEmail} directly.`,
      503,
    );
  }

  const client = new Anthropic({ apiKey: serverEnv.anthropicApiKey });

  const anthropicStream = client.messages.stream({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: [
      {
        type: "text",
        text: CHAT_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: messages.map(({ role, content }) => ({ role, content })),
  });

  const encoder = new TextEncoder();
  let sentAnyText = false;

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of anthropicStream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            sentAnyText = true;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (error) {
        console.error("Chat stream error:", error);
        if (!sentAnyText) {
          controller.enqueue(encoder.encode(FALLBACK_MESSAGE));
        }
      } finally {
        controller.close();
      }
    },
    cancel() {
      anthropicStream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
