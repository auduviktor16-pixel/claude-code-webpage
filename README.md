# Audu Victor — Portfolio & AI Services Site

A single-page Next.js (App Router) site for Audu Victor: AI Automation Specialist & AI Agent Builder, Co-Founder of BetapayAI, and medical doctor. Built with TypeScript, Tailwind CSS, React Hook Form + Zod, and Resend.

## Stack

- Next.js 16 (App Router, React Server Components by default)
- TypeScript, Tailwind CSS v4
- React Hook Form + Zod for the contact form
- Resend for transactional email
- Vitest + Testing Library for unit tests
- Playwright + @axe-core/playwright for E2E and accessibility tests
- Vercel Web Analytics + Speed Insights

## Development

```bash
npm install
cp .env.example .env.local   # fill in values you have; safe defaults exist for the rest
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
npm run start
```

## Tests

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm test            # Vitest unit tests (lib/ and hooks/ pure logic, ContactForm states)
npm run test:e2e    # Playwright E2E — builds and serves a production build automatically
```

The Playwright suite runs against 6 projects (`chromium`, `mobile-320`, `mobile-375`, `tablet-768`, `desktop-1024`, `desktop-1440`) covering page load, navigation, CTAs, contact form validation/success/error, social-link conditional rendering, scroll-reveal visibility, reduced-motion behavior, and automated accessibility scans.

## Environment variables

All are optional in the sense that the site builds and runs without any of them — see the "graceful degradation" notes below.

| Variable | Purpose | If unset |
|---|---|---|
| `RESEND_API_KEY` | Sends contact form emails via [Resend](https://resend.com) | The API route returns a clear error asking the visitor to email you directly; the form never fakes a success. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Recipient address, and the address shown in the footer/contact section | Defaults to `auduviktor16@gmail.com`. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, Open Graph/Twitter metadata, sitemap | Defaults to a placeholder (`https://auduvictor.com`). **Change this before launch.** |
| `NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_X_URL`, `NEXT_PUBLIC_GITHUB_URL` | Footer social links | Each link is simply not rendered when its URL is unset — no dead `#` links. |
| `NEXT_PUBLIC_BETAPAY_URL` | "Explore BetapayAI" external CTA on the Work section | The CTA is hidden entirely when unset. |
| `NEXT_PUBLIC_VIDEO_SRC` | Enables the video section | The whole section renders nothing when unset (no empty player). |

### Adding the video later

1. Drop the file into `public/video/` (e.g. `public/video/work-demo.mp4`).
2. Set `NEXT_PUBLIC_VIDEO_SRC=/video/work-demo.mp4`.
3. Optionally add a poster image at the same path with `-poster.jpg` appended (e.g. `work-demo-poster.jpg`) — this is derived automatically by `lib/video.ts`.

### Adding social links or the BetapayAI URL later

Just set the corresponding `NEXT_PUBLIC_*` env var — no component changes needed. All of it flows through `lib/siteConfig.ts`.

## Deployment (Vercel)

1. Push this repo to GitHub/GitLab/Bitbucket and import it in Vercel, or run `vercel` from this directory.
2. Set the environment variables above in the Vercel project settings (at minimum, set `NEXT_PUBLIC_SITE_URL` to your real domain and `RESEND_API_KEY` if you want the contact form to actually send email).
3. Deploy. Vercel Web Analytics and Speed Insights are already wired into `app/layout.tsx` and activate automatically once analytics is enabled for the project in the Vercel dashboard.

## Project structure

- `app/` — routes, layout, metadata, the contact API route, sitemap/robots/OG image
- `components/sections/` — one component per landing page section
- `components/{layout,ui,contact,social,work,icons}/` — shared building blocks
- `lib/` — `siteConfig.ts` (single source of truth for all copy/links), validation schema, pure helpers (`links.ts`, `video.ts`, `scrollReveal.ts`, `rateLimit.ts`), metadata builders
- `hooks/` — `useScrollReveal`, `useActiveSection` (nav highlighting), `useMediaQuery`
- `__tests__/` — Vitest unit tests
- `e2e/` — Playwright E2E tests

No personal content, links, or copy are hardcoded inside components — everything flows from `lib/siteConfig.ts`, which itself only reads from the environment variables above.
