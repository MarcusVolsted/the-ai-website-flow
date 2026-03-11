# CLAUDE.md — The AI Website Flow (WaaS Intake System)

## Project
Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion 12.
Conversational multi-step intake wizard with chat-like UI for a WaaS (Website as a Service) agency.

## Dev Server
- Start: `npm run dev` (runs on http://localhost:3000, or next available port)
- Build: `npm run build`
- Do NOT use `node serve.mjs` — this is a Next.js project

## Architecture
- **App Router:** `src/app/` for routes, `src/components/` for UI, `src/lib/` for utilities
- **State:** React Context + useReducer in `IntakeContext.tsx` — manages step progression, form data, and chat message accumulation
- **Forms:** React Hook Form + Zod v4 validation (`@hookform/resolvers`)
- **Styling:** Tailwind v4 with `@theme` customization in `globals.css`
- **Animations:** Framer Motion — spring easing, AnimatePresence for step transitions

## Code Conventions
- All components are TypeScript (`.tsx`), all utilities are TypeScript (`.ts`)
- Use `"use client"` directive only on components that need interactivity
- Server actions in `src/lib/actions.ts` with `"use server"` directive
- Import alias: `@/*` maps to `src/*`
- Use `cn()` from `@/lib/utils` for conditional class merging (clsx + tailwind-merge)
- Framer Motion transition `type` values must use `as const` to satisfy TypeScript strict mode

## Brand Palette
- Black (base): `#171717`
- Orange (accent/primary): `#F25623`
- Dark Gray: `#4D4D4D`
- Light Gray: `#DEDEDE`
- Surface base: `#0d0d0d`, elevated: `#171717`, floating: `#1e1e1e`, border: `#2a2a2a`

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Use the brand palette above.
- **Shadows:** Never use flat `shadow-md`. Use layered, orange-tinted shadows with low opacity.
- **Typography:** Plus Jakarta Sans for headings (tight tracking `-0.03em`), Inter for body (line-height `1.7`).
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces use a 3-level system: base -> elevated -> floating.

## Hard Rules
- Only animate `transform` and `opacity`. Never `transition-all`.
- Never use default Tailwind blue/indigo as primary color.
- Every clickable element needs hover, focus-visible, and active states.
- Mobile-first responsive design.
- Validate all form data with Zod on both client and server.
