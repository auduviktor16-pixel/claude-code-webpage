# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server
npm run build         # production build (also type-checks and lints via Next's build step)
npm run start          # serve the production build (used by Playwright's webServer)
npm run lint            # ESLint (flat config)
npm run typecheck       # tsc --noEmit
npm test                # Vitest unit tests, single run
npm run test:watch      # Vitest watch mode
npm run test:e2e        # Playwright E2E — builds and serves a production build automatically
npm run test:e2e:ui     # Playwright UI mode
```

Run a single Vitest file: `npx vitest run __tests__/contactSchema.test.ts`
Run a single Playwright spec: `npx playwright test e2e/nav.spec.ts`
Run one Playwright project (viewport) only: `npx playwright test --project=chromium` (other projects: `mobile-320`, `mobile-375`, `tablet-768`, `desktop-1024`, `desktop-1440`, defined in `playwright.config.ts`)

## Pinned toolchain versions — do not casually bump

This project intentionally pins several dependencies below npm's `latest` tag because the newest majors are ahead of what the rest of the toolchain supports as of this writing:

- **TypeScript is pinned to `5.9.3`**, not the npm-`latest` `7.x` (a native-compiler major). `typescript-eslint` (pulled in via `eslint-config-next`) does not yet support TS 7 and `eslint .` will hard-crash with "typescript-eslint does not support TS 7.0" if it's bumped.
- **ESLint is pinned to `9.x`**, not `10.x`, for the same `eslint-config-next` peer-dependency reason.
- `eslint.config.mjs` imports `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` **directly as flat-config arrays** — do not wrap them in `FlatCompat().extends(...)`. This Next version ships flat config natively; the `FlatCompat` legacy-bridge path throws a circular-JSON error against it.

If you do bump TypeScript/ESLint, run `npm run lint` immediately — it's the fastest way to find out whether the new version broke the `eslint-config-next` chain.

## Architecture

This is a **single, static-feeling page** (`app/page.tsx`) built from independent section components (`components/sections/*`) rendered in a fixed order. There is no routing beyond the one page plus `app/api/contact/route.ts`.

### `lib/siteConfig.ts` is the single source of truth

No component hardcodes copy, nav items, service descriptions, project data, or links. Everything reads from the `siteConfig` object (typed in `lib/siteConfig.types.ts`). When adding or editing content, edit `siteConfig.ts`, not the component JSX.

`siteConfig.ts` composes itself from:
- Static copy (headings, service/process/credibility text) written inline.
- `lib/env.ts` for anything env-driven and **safe to ship to the client** (site URL, public contact email, social URLs, video src).
- `lib/video.ts`'s `resolveVideoConfig()` to compute `video.enabled` from `NEXT_PUBLIC_VIDEO_SRC` (never hand-toggled).

### The env.ts / serverEnv.ts split exists to prevent a real crash class

`lib/env.ts` holds only `NEXT_PUBLIC_*`-safe values and is imported by `siteConfig.ts`, which is imported by **client components** (`Header`, `MobileNav`, `SocialLinks`, `ContactForm`, `VideoSection`). `lib/serverEnv.ts` (guarded with `import "server-only"`) holds `RESEND_API_KEY` and is imported **only** by `lib/resend.ts` and the API route. Do not add secret env vars to `env.ts` — anything read there can end up referenced from client-bundled code.

Relatedly: **never pass a `siteConfig` field containing an icon/component value as a prop into a client component.** Icon components (`lucide-react` components, or the hand-rolled ones in `components/icons/BrandIcons.tsx`) can only cross into a client component by that component importing `siteConfig` itself (a plain module import), not by receiving it as a prop from a Server Component — React will throw "Functions cannot be passed directly to Client Components" at build time. `components/social/SocialLinks.tsx` is written this way (imports `siteConfig` directly, takes no `links` prop) specifically because of this; follow that pattern rather than prop-drilling icon data.

`lucide-react` in this project's installed version does **not** export brand/social icons (`Github`, `Linkedin`, `Twitter` don't exist) — that's why `components/icons/BrandIcons.tsx` hand-rolls LinkedIn/X/GitHub as inline SVGs. If you need another brand mark, add it there rather than assuming lucide has it.

### Graceful degradation is load-bearing, not incidental

Several features are designed to render nothing (not a placeholder) when unconfigured, and this is enforced by pure functions so it's unit-testable:
- `lib/video.ts` → `VideoSection` returns `null` unless `NEXT_PUBLIC_VIDEO_SRC` is set.
- `lib/links.ts` → `SocialLinks` and the footer render zero links when none are configured; there must never be a `href="#"` anywhere.
- The BetapayAI "Explore" CTA in `ProjectCard` only renders when `project.liveUrl` is set.
- The contact API route (`app/api/contact/route.ts`) returns a real error (not a fake success) when `RESEND_API_KEY` is unset.

When changing any of this logic, keep the resolution logic pure and in `lib/`, with the component doing only the `if (!enabled) return null` check — that's what keeps it testable in `__tests__/` without a browser.

### Scroll behavior is IntersectionObserver-based, not scroll-event polling

- `hooks/useScrollReveal.ts` (backing `components/ui/Reveal.tsx`) and `hooks/useActiveSection.ts` (nav highlighting) both use `IntersectionObserver`, never a `scroll` listener. Each hook's decision logic is factored into a plain exported function (`shouldReveal` in `lib/scrollReveal.ts`, `pickActiveSection` in `hooks/useActiveSection.ts`) so the "when should this fire" logic is unit-tested independent of the DOM.
- Sections have `scroll-margin-top` set globally (`section[id] { scroll-margin-top: 6rem }` in `app/globals.css`) to clear the fixed header on anchor navigation — if the header's height changes, this value needs to change with it.
- `prefers-reduced-motion` short-circuits reveal animations via `hooks/useMediaQuery.ts` (built on `useSyncExternalStore`, not `useEffect` + `setState`, to satisfy the `react-hooks/set-state-in-effect` lint rule and avoid a render cascade).

### Contact form validation is shared, not duplicated

`lib/validation/contactSchema.ts` (Zod) is imported by both `components/contact/ContactForm.tsx` (client-side, via `@hookform/resolvers/zod`) and `app/api/contact/route.ts` (server-side re-validation — never trust the client payload). Add new fields/rules there once; both sides pick it up automatically. The schema includes a hidden honeypot field (`company_website`) — the route treats a filled honeypot as spam and returns a fake success without sending mail.

### Testing layout

- `__tests__/` (Vitest + Testing Library) covers pure logic in `lib/`/`hooks/` and `ContactForm`'s conditional rendering states. `vitest.setup.ts` registers global `afterEach(cleanup)` — required because this project doesn't use Vitest's `globals: true`, so Testing Library's own auto-cleanup detection doesn't fire.
- `e2e/` (Playwright) covers everything DOM/browser-shaped: navigation, CTAs, the contact form via `page.route()`-mocked API responses, social-link omission, scroll visibility, reduced motion, and an axe accessibility scan (`e2e/fixtures/axe.ts`). It runs against a real production build via the `webServer` config in `playwright.config.ts`, not `next dev`.
- When writing new E2E assertions that match visible text containing an apostrophe, remember the copy uses a **typographic apostrophe** (`’`, e.g. "Let's Work Together") — a regex with a straight `'` will not match it. Use `.` in place of the apostrophe in test regexes (see existing specs for the pattern).

## Environment variables

See `.env.example` for the full list and `README.md` for the "what happens if this is unset" table — every var has documented graceful-degradation behavior, so don't assume a missing var is a bug.
