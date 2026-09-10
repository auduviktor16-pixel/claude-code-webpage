"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/contact/FormField";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/siteConfig";
import {
  contactFormDefaultValues,
  contactSchema,
  type ContactFormValues,
} from "@/lib/validation/contactSchema";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const hasStartedTracking = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: contactFormDefaultValues,
  });

  const handleFocusStart = () => {
    if (!hasStartedTracking.current) {
      hasStartedTracking.current = true;
      trackEvent(siteConfig.analytics.events.contactStarted, { location: "contact" });
    }
  };

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitState("submitting");
    setServerError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !data.ok) {
        setSubmitState("error");
        setServerError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      trackEvent(siteConfig.analytics.events.contactSubmitted);
      setSubmitState("success");
      reset();
    } catch {
      setSubmitState("error");
      setServerError(
        `Something went wrong sending your message. Please email ${siteConfig.email} directly.`,
      );
    }
  };

  if (submitState === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-teal/40 bg-surface p-8 text-center"
      >
        <p className="font-display text-lg text-paper">
          Thanks — your message has been sent. I&rsquo;ll get back to you
          soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onFocus={handleFocusStart}
      noValidate
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="name"
          label="Name"
          required
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <FormField
        id="company"
        label="Company / Organization"
        autoComplete="organization"
        error={errors.company?.message}
        {...register("company")}
      />

      <FormField
        id="message"
        as="textarea"
        label="What would you like to automate?"
        required
        error={errors.message?.message}
        {...register("message")}
      />

      {/* Honeypot — hidden from real users, visible to naive bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">Leave this field empty</label>
        <input
          id="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("company_website")}
        />
      </div>

      {serverError && (
        <p role="alert" className="text-sm text-coral-soft">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitState === "submitting"}
        className="inline-flex w-full items-center justify-center rounded-full bg-teal px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-teal-soft disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitState === "submitting" ? "Sending…" : "Start a Conversation"}
      </button>
    </form>
  );
}
