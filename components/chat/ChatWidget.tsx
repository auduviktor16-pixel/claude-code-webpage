"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { ChatMessageBubble } from "@/components/chat/ChatMessageBubble";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/siteConfig";
import type { ChatRole } from "@/lib/chat/types";

interface DisplayMessage {
  id: string;
  role: ChatRole;
  content: string;
  isGreeting?: boolean;
}

const GREETING: DisplayMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "Hi! I'm Klaak, Audu's AI assistant. Ask me about his work, services, background, or how to get in touch.",
  isGreeting: true,
};

// Keeps the client-sent history bounded and always starting on a user turn
// (the Messages API rejects an assistant-first array), well under the
// server's own hard cap in lib/validation/chatSchema.ts.
const MAX_HISTORY_MESSAGES = 20;

// A proactive nudge near the FAB, not the chat itself opening — appears once
// per visit after a delay, and auto-hides if ignored.
const TEASER_SHOW_DELAY_MS = 6000;
const TEASER_AUTO_HIDE_MS = 30000;

function trimHistory(messages: DisplayMessage[]): DisplayMessage[] {
  const real = messages.filter((m) => !m.isGreeting);
  if (real.length <= MAX_HISTORY_MESSAGES) return real;
  const excess = real.length - MAX_HISTORY_MESSAGES;
  // Drop from the front in pairs so the trimmed history still starts on a
  // user turn.
  const dropCount = excess % 2 === 0 ? excess : excess + 1;
  return real.slice(dropCount);
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasTrackedOpen = useRef(false);
  const teaserDismissedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const headingId = useId();

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    if (isOpen || teaserDismissedRef.current) return;
    const timer = setTimeout(() => {
      if (!teaserDismissedRef.current) setShowTeaser(true);
    }, TEASER_SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!showTeaser) return;
    const timer = setTimeout(() => setShowTeaser(false), TEASER_AUTO_HIDE_MS);
    return () => clearTimeout(timer);
  }, [showTeaser]);

  const trackOpenOnce = () => {
    if (!hasTrackedOpen.current) {
      hasTrackedOpen.current = true;
      trackEvent(siteConfig.analytics.events.chatOpened);
    }
  };

  const dismissTeaser = () => {
    teaserDismissedRef.current = true;
    setShowTeaser(false);
  };

  const openFromTeaser = () => {
    dismissTeaser();
    trackOpenOnce();
    setIsOpen(true);
  };

  const handleToggle = () => {
    setIsOpen((open) => {
      const next = !open;
      if (next) {
        dismissTeaser();
        trackOpenOnce();
      }
      return next;
    });
  };

  const sendMessage = async (rawContent: string) => {
    const content = rawContent.trim();
    if (!content || isStreaming) return;

    setError(null);
    trackEvent(siteConfig.analytics.events.chatMessageSent);

    const userMessage: DisplayMessage = { id: crypto.randomUUID(), role: "user", content };
    const assistantId = crypto.randomUUID();
    const historyForRequest = trimHistory([...messages, userMessage]);

    setMessages((prev) => [...prev, userMessage, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyForRequest.map(({ role, content: c }) => ({ role, content: c })),
        }),
      });

      if (!response.body) {
        throw new Error("Something went wrong. Please try again.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: accumulated } : m)),
        );
      }

      if (!response.ok) {
        throw new Error(accumulated || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void sendMessage(input);
  };

  return (
    <>
      {showTeaser && !isOpen && (
        <div className="fixed bottom-24 right-5 z-[60] flex max-w-[min(260px,calc(100vw-2.5rem))] animate-fade-up items-start gap-1 rounded-2xl rounded-br-sm border border-border bg-surface-raised p-3 shadow-lg shadow-black/30 sm:bottom-28 sm:right-6">
          <button type="button" onClick={openFromTeaser} className="flex-1 text-left">
            <span className="text-sm font-medium text-paper">Klaak</span>
            <p className="mt-0.5 text-sm text-paper-dim">
              Hi! Got a question about Audu&rsquo;s work? Ask away.
            </p>
          </button>
          <button
            type="button"
            onClick={dismissTeaser}
            aria-label="Dismiss"
            className="shrink-0 rounded-full p-1 text-paper-mute transition-colors hover:bg-surface hover:text-paper"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls="chat-panel"
        aria-label={isOpen ? "Close chat with Klaak, Audu's AI assistant" : "Chat with Klaak, Audu's AI assistant"}
        className={`fixed bottom-5 right-5 z-[60] size-14 items-center justify-center rounded-full bg-teal text-ink shadow-lg shadow-black/30 transition-transform duration-200 hover:bg-teal-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal active:scale-95 sm:bottom-6 sm:right-6 sm:inline-flex ${
          isOpen ? "hidden" : "inline-flex"
        }`}
      >
        {isOpen ? (
          <X className="size-6" aria-hidden="true" />
        ) : (
          <MessageCircle className="size-6" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div
          id="chat-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
          className="fixed inset-0 z-50 flex flex-col bg-ink sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[600px] sm:max-h-[calc(100dvh-7rem)] sm:w-[380px] sm:rounded-2xl sm:border sm:border-border sm:bg-surface sm:shadow-2xl sm:shadow-black/40"
        >
          <div className="flex items-center justify-between border-b border-border-soft px-5 py-4 sm:rounded-t-2xl">
            <div>
              <h2 id={headingId} className="font-display text-base font-medium text-paper">
                Klaak
              </h2>
              <p className="text-xs text-paper-mute">Audu&rsquo;s AI assistant &middot; ask about services, background, or getting started</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="Close chat"
              className="inline-flex size-8 items-center justify-center rounded-full text-paper-dim transition-colors hover:bg-surface-raised hover:text-paper sm:hidden"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <ChatMessageBubble
                key={message.id}
                role={message.role}
                content={message.content}
                isStreaming={isStreaming}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <p role="alert" className="px-4 pb-2 text-xs text-coral-soft">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="border-t border-border-soft p-3 sm:rounded-b-2xl">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                disabled={isStreaming}
                autoComplete="off"
                aria-label="Message"
                className="min-w-0 flex-1 rounded-full border border-border bg-ink-soft px-4 py-2.5 text-base text-paper placeholder:text-paper-mute focus:border-teal focus:outline-none disabled:opacity-60 sm:text-sm"
              />
              <button
                type="submit"
                disabled={isStreaming || !input.trim()}
                aria-label="Send message"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-teal text-ink transition-colors hover:bg-teal-soft disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="size-4" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-paper-mute">
              AI-generated answers may be inaccurate. For anything important, use the contact form.
            </p>
          </form>
        </div>
      )}
    </>
  );
}
