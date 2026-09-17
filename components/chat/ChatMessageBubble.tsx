import type { ChatRole } from "@/lib/chat/types";

interface ChatMessageBubbleProps {
  role: ChatRole;
  content: string;
  isStreaming?: boolean;
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      <span className="size-1.5 animate-bounce rounded-full bg-paper-mute [animation-delay:-0.3s]" />
      <span className="size-1.5 animate-bounce rounded-full bg-paper-mute [animation-delay:-0.15s]" />
      <span className="size-1.5 animate-bounce rounded-full bg-paper-mute" />
    </span>
  );
}

export function ChatMessageBubble({ role, content, isStreaming }: ChatMessageBubbleProps) {
  const isUser = role === "user";
  const showTyping = !isUser && isStreaming && content.length === 0;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-teal text-ink"
            : "rounded-bl-sm border border-border-soft bg-surface-raised text-paper"
        }`}
      >
        {showTyping ? (
          <span className="flex items-center py-1">
            <TypingDots />
            <span className="sr-only">Klaak is typing…</span>
          </span>
        ) : (
          content
        )}
      </div>
    </div>
  );
}
