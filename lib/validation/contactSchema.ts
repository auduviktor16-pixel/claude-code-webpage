import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(120, "That name looks too long — please shorten it."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address."),
  company: z
    .string()
    .trim()
    .max(160, "That company name looks too long — please shorten it.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Tell me a bit more — at least 20 characters.")
    .max(4000, "That message is too long — please shorten it."),
  // Honeypot: real users never see or fill this field. Any value here means
  // the submission almost certainly came from a bot.
  company_website: z.string().max(0, "Spam check failed.").optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const contactFormDefaultValues: ContactFormValues = {
  name: "",
  email: "",
  company: "",
  message: "",
  company_website: "",
};
