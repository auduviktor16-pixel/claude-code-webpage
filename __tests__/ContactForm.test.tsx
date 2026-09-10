import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/contact/ContactForm";

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/name/i), "Jordan Smith");
  await user.type(screen.getByLabelText(/email/i), "jordan@example.com");
  await user.type(
    screen.getByLabelText(/what would you like to automate/i),
    "We need help automating our lead routing workflow end to end.",
  );
}

describe("ContactForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows required field errors when submitted empty", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: /start a conversation/i }));

    expect(await screen.findByText(/please enter your full name/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter your email address/i)).toBeInTheDocument();
    expect(screen.getByText(/tell me a bit more/i)).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("shows an email format error for a malformed address", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "Jordan Smith");
    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.type(
      screen.getByLabelText(/what would you like to automate/i),
      "We need help automating our lead routing workflow end to end.",
    );
    await user.click(screen.getByRole("button", { name: /start a conversation/i }));

    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("shows the success message after a valid submission", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    });

    const user = userEvent.setup();
    render(<ContactForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /start a conversation/i }));

    expect(
      await screen.findByText(/thanks — your message has been sent/i),
    ).toBeInTheDocument();
  });

  it("shows a server error message when submission fails", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ ok: false, error: "Something went wrong sending your message." }),
    });

    const user = userEvent.setup();
    render(<ContactForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /start a conversation/i }));

    expect(
      await screen.findByText(/something went wrong sending your message/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/thanks — your message has been sent/i),
    ).not.toBeInTheDocument();
  });

  it("does not reset the form when submission fails", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ ok: false, error: "Failed." }),
    });

    const user = userEvent.setup();
    render(<ContactForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /start a conversation/i }));

    await waitFor(() => expect(screen.getByText(/failed\./i)).toBeInTheDocument());
    expect(screen.getByLabelText(/name/i)).toHaveValue("Jordan Smith");
  });
});
