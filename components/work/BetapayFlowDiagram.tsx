import {
  MessageCircle,
  MessagesSquare,
  ArrowRightLeft,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const STEPS: { label: string; description: string; icon: LucideIcon }[] = [
  {
    label: "User Request",
    description: "“Send ₦5,000 to my landlord.”",
    icon: MessageCircle,
  },
  {
    label: "AI Conversation",
    description: "Assistant confirms details in plain language.",
    icon: MessagesSquare,
  },
  {
    label: "Payment Workflow",
    description: "Request is routed to the right payment rail.",
    icon: ArrowRightLeft,
  },
  {
    label: "Completion",
    description: "Payment confirmed, right inside the chat.",
    icon: CheckCircle2,
  },
];

export function BetapayFlowDiagram() {
  return (
    <div
      aria-label="Diagram: a BetapayAI conversation moves from user request, through AI conversation and a payment workflow, to completion."
      className="rounded-3xl border border-border-soft bg-surface p-6 sm:p-10"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-3">
        {STEPS.map((step, index) => (
          <div key={step.label} className="flex flex-1 items-center gap-4 sm:flex-col sm:items-stretch sm:gap-0">
            <div className="flex flex-1 flex-col rounded-2xl border border-border bg-surface-raised p-5">
              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-ink text-teal">
                <step.icon className="size-4" aria-hidden="true" />
              </span>
              <p className="mt-4 font-display text-sm text-paper">{step.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-paper-mute">
                {step.description}
              </p>
            </div>

            {index < STEPS.length - 1 && (
              <span aria-hidden="true" className="shrink-0 text-paper-mute">
                <ArrowRight className="hidden size-5 sm:block" />
                <ArrowDown className="size-5 sm:hidden" />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
