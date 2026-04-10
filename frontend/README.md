# OmniaVital

**AI-Powered Personalized Wellness Platform — Strategy & Product Case Study**

---

## Overview

OmniaVital reinvents the commoditized health-and-wellness e-commerce category by transforming one-off supplement sales into a high-retention, subscription-first ecosystem. Built as a complete end-to-end business — consumer experience, AI infrastructure, and revenue optimization — it uses **voice-first AI**, **quantitative ritual tracking**, and **privacy-preserving community mechanics** to deliver measurable outcomes and lifelong engagement.

The result: a low-retention dropshipping model becomes a sticky, high-LTV wellness companion.

> **Live preview:** [omnivital.lovable.app](https://omnivital.lovable.app) *(if published)*

---

## The Problem

Traditional wellness brands sell near-identical products (protein, lion's mane, L-theanine, etc.) under different branding and rely on community forums or generic "guru" content. Post-purchase, value collapses:

| Failure Mode | Impact |
|---|---|
| No personalized guidance after purchase | Users churn to the next brand |
| Generic community boards (noisy, low-signal) | No meaningful peer connection |
| No objective progress tracking | "Did this even work?" uncertainty |
| Only discount spam for re-engagement | Erodes perceived brand value |
| Single expert can't scale 1:1 support | Knowledge bottleneck → retention collapse |

**Core insight:** Retention suffers because there is no mechanism to *prove or improve* real-world results, and the 1:1 expert cannot scale.

---

## The Strategic Solution

Instead of pushing single products, OmniaVital centers the experience on **personalized rituals and routines** powered by a voice-based AI confidant ("OV").

### 1. Onboarding & Discovery (Voice-First)
Users speak naturally with their tailored AI consultant. OV surfaces pain points, goals, and constraints, then recommends an optimized routine with cross-sell opportunities. The same agent intelligently guides users through checkout — surfacing subscription plans, multi-month commitments, and bulk discounts — optimizing revenue without friction.

### 2. Post-Purchase Experience (The Ritual Dashboard)
All purchased items instantly populate a personal dashboard as a *living routine*. Users track intake via daily check-ins with feeling scores (1–5), view 7-day streak data, and receive quantitative progress visibility — moving beyond subjective "how I feel" feedback to data-driven optimization.

### 3. Always-On Expert Guidance (Personalized AI)
The AI evolves into a hyper-personalized "expert of experts." Using the user's exact routine, purchase history, goals, and story, it synthesizes knowledge from researchers, clinicians, and protocol designers into advice that is dynamically tailored. Voice realism (ElevenLabs WebRTC) creates an intimate, human consultant experience.

### 4. Community Layer (Privacy-First Matching)
A smart community board surfaces peers on similar optimization paths via color-gradient tags. Each supplement maps to a color; a user's unique mix generates an overall hue. Closer color matches indicate highly aligned routines — without ever exposing exact stacks. Meaningful, low-friction peer connections with full privacy.

---

## What's Built (Current State)

This is a working, end-to-end implementation — not a mockup. Every layer described below is functional in the current codebase.

### Consumer-Facing Pages

| Route | Purpose | Auth Required |
|---|---|---|
| `/` | Landing page — hero, product grid, science pillars, community email capture | No |
| `/product/:slug` | Product detail page — tabbed info (bioavailability, sourcing, daily ritual), trust badges, local product photography | No |
| `/auth` | Sign up / sign in with email verification, luxury dark-themed UI | No |
| `/dashboard` | Ritual hub — personalized greeting, ritual stack, daily check-ins, 7-day streak, community chat (preview), advisor CTA | Yes |

### AI Voice Agent — "Ritual Advisor"

A floating **premium orb widget** (bottom-right) powered by [ElevenLabs Conversational AI](https://elevenlabs.io/docs/agents-platform/overview) via WebRTC:

- **Custom SVG monogram** (OV + microphone mark) — not a stock icon
- **Multi-state UI:** idle (breathing glow), connecting, active (animated waveform bars), speaking (expanded pulse rings)
- **3-layer orb depth:** outer rim highlight, main gradient body, inner specular shine — designed to feel like a physical glass object
- **Context-aware:** when the user is logged in, the panel surfaces their name and AI-generated `ritual_summary` so the agent "knows" their ritual
- **Agent ID:** `agent_5501kgzectw4ep69wjamch6xr2k7` (public, no server-side token required)
- **Client tool support:** configured for `navigate_to_product` actions triggered by the agent during conversation

### Authentication System

- Email + password auth with **email verification required** (not auto-confirmed)
- `AuthProvider` React context wrapping the app — exposes `session`, `user`, `profile`, `loading`, `signOut`, `refreshProfile`
- `RequireAuth` route guard — redirects unauthenticated users to `/auth`
- On signup, a database trigger auto-creates a `profiles` row with the user's `full_name`
- Navbar is auth-aware: shows avatar + name + "OVO·G" gold badge when signed in, "Join The Collective" CTA when signed out

### Ritual Dashboard

The authenticated hub — designed as the *heart* of the product:

- **Personalized greeting** — time-of-day aware ("Good morning, Marcus.") with ritual summary subtitle
- **7-day streak tracker** — visual bar chart showing daily logging consistency
- **Ritual stack management** — add/remove products from the user's active stack, with real-time database sync
- **Daily check-in** — for each product in the stack, log a feeling score (1–5) with immediate UI feedback
- **"From The Collective" tips** — curated brand-voice protocol tips (static, labeled by source)
- **Community chat board (preview)** — mock messages with OVO·G member badges, team-highlighted responses, and a "coming soon" overlay for live functionality
- **Advisor CTA** — directs users to the floating voice agent for personalized guidance

### Design System

| Token | Value | Usage |
|---|---|---|
| `--primary` | `168 76% 42%` (Performance Teal) | CTAs, active states, agent orb |
| `--accent` | `42 80% 55%` (Warm Gold) | OVO·G badges, highlights, gradient endpoints |
| `--background` | `0 0% 4%` (Near-black) | Page backgrounds |
| `--card` | `0 0% 7%` | Card surfaces |
| `--border` | `0 0% 14%` | Subtle separation |

**Custom utilities:** `.glass` (frosted dark panels), `.glass-light` (subtle overlay), `.text-gradient` (teal→gold gradient text), `.shimmer` (animated highlight), `.glow-primary` / `.glow-accent`

**Typography:** Inter (300–900 weights), with aggressive letter-spacing on uppercase labels (`0.15em–0.5em`) for a luxury editorial feel.

---

## Technical Architecture

```
├── Pages
│   ├── /             Index — HeroSection, RitualGrid, ScienceSection, CommunitySection
│   ├── /auth         Auth — sign in / sign up with email verification
│   ├── /dashboard    Dashboard — protected, authenticated ritual hub
│   └── /product/:slug  ProductDetail — database-driven PDP
│
├── Auth
│   └── AuthProvider (React Context)
│       ├── onAuthStateChange listener
│       ├── Profile fetching on session change
│       └── RequireAuth route guard
│
├── Database (Lovable Cloud)
│   ├── products        — 3 ritual products (publicly readable)
│   ├── email_signups   — email capture (insert-only, no read)
│   ├── profiles        — user info + AI ritual_summary (RLS: own row only)
│   ├── user_rituals    — active product stack (RLS: own rows, insert/select/delete)
│   └── ritual_logs     — daily check-ins with feeling scores (RLS: own rows)
│
├── AI / Voice
│   └── ElevenLabs Conversational AI (WebRTC, public agent)
│       ├── useConversation hook
│       ├── Client tool: navigate_to_product
│       └── Context injection: user name + ritual_summary
│
└── Design System
    ├── index.css — HSL tokens, glass utilities, gradient text
    ├── tailwind.config.ts — semantic color mapping, custom animations
    └── Framer Motion — scroll-reveal, orb animations, waveforms
```

### Stack

| Layer | Technology |
|---|---|
| Framework | React 18, TypeScript, Vite |
| Styling | Tailwind CSS 3.4, shadcn/ui, Framer Motion |
| Backend | Lovable Cloud (PostgreSQL, Auth, Edge Functions, RLS) |
| Voice AI | ElevenLabs Conversational AI (`@elevenlabs/react`) via WebRTC |
| State | React Context (auth), TanStack React Query (data), local state (UI) |
| Routing | React Router v6 with auth-aware guards |
| Icons | Lucide React |

### Database Schema

**`products`** — Publicly readable product catalog
- `id`, `name`, `slug`, `tagline`, `category`, `description`, `price`
- `image_url`, `bio_availability_text`, `sourcing_text`, `daily_ritual_text`
- RLS: `SELECT` open to all; no public INSERT/UPDATE/DELETE

**`profiles`** — Extended user info (auto-created on signup via trigger)
- `id` (matches auth user), `full_name`, `ritual_summary`, `created_at`, `updated_at`
- RLS: users can only SELECT, INSERT, UPDATE their own row

**`user_rituals`** — Active ritual stack
- `id`, `user_id`, `product_id` (FK → products), `added_at`
- RLS: users can SELECT, INSERT, DELETE their own rows

**`ritual_logs`** — Daily check-in tracking
- `id`, `user_id`, `product_id` (FK → products), `logged_at`, `feeling_score` (1–5), `notes`
- RLS: users can SELECT, INSERT, UPDATE their own rows

**`email_signups`** — Pre-auth email capture
- `id`, `email`, `created_at`
- RLS: INSERT only (no read access)

### Security Model

- **Row-Level Security (RLS)** on every table — users can only access their own data
- **Email verification required** — no auto-confirm on signup
- **No anonymous signups** — all users must create accounts with email + password
- **Auth state managed server-side** via Supabase session tokens
- **Database trigger** (`handle_new_user`) creates profile rows securely with `SECURITY DEFINER`

---

## Strategic Differentiation

| Dimension | Traditional Wellness Brand | OmniaVital |
|---|---|---|
| Post-purchase experience | Discount emails | AI advisor + ritual dashboard |
| Personalization | "Take 2 capsules daily" | Voice AI adapts to your goals, history, and stack |
| Progress visibility | None | Daily check-ins, feeling scores, 7-day streaks |
| Community | Generic forums | Privacy-first color-gradient matching (roadmap) |
| Expert guidance | One guru → doesn't scale | AI synthesizes all expert knowledge, scales to every user |
| Retention mechanism | Hope + discount codes | Habit loops (streak tracking) + measurable outcomes |
| Revenue optimization | Cart abandonment emails | AI agent naturally surfaces upsells during conversation |

---

## Business Model & Incentive Alignment

- **Core revenue:** subscriptions, cross-sells, long-term "Unity" commitments
- **AI agent is optimized** (ethically) to drive re-subscription, increased spend, and community participation — yet every action demonstrably advances the user's own goals
- **Win-win architecture:** higher lifetime value for the business *and* sustained progress for the customer
- **The ritual dashboard creates habit loops** — daily check-ins + streak visibility → intrinsic motivation → reduced churn

---

## Roadmap (Phase 2+)

| Feature | Description | Strategic Value |
|---|---|---|
| **Live community chat** | Real-time messaging between OVO·G members | Network effects, social retention |
| **Color-gradient matching** | Privacy-preserving peer discovery based on supplement stack similarity | Meaningful connections without data exposure |
| **Health integrations** | Apple Watch / Google Fit sync for biometric tracking | Objective progress measurement |
| **RAG-powered advisor** | Agent grounded in user's purchase history, logs, and clinical data | Hyper-personalized guidance at scale |
| **Subscription management** | In-app subscription controls with AI-recommended cadence | Revenue optimization |
| **Agent-driven checkout** | Voice agent guides users through purchase decisions | Frictionless conversion |

---

## Development

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm i
npm run dev
```

## Deployment

Open [Lovable](https://lovable.dev) and click **Share → Publish**.

---

## ElevenLabs Agent Configuration

### Agent ID
```
agent_5501kgzectw4ep69wjamch6xr2k7
```

### Client Tool — `navigate_to_product`

```json
{
  "type": "client",
  "name": "navigate_to_product",
  "description": "Navigate the user to a specific product page when they express interest in a ritual product",
  "expects_response": false,
  "response_timeout_secs": 1,
  "parameters": [
    {
      "name": "product_slug",
      "type": "string",
      "description": "The product slug to navigate to (morning-routine, focus-window, evening-recovery)"
    }
  ]
}
```

### React Integration

```tsx
const conversation = useConversation({
  clientTools: {
    navigate_to_product: (params: { product_slug: string }) => {
      window.location.href = `/product/${params.product_slug}`;
      return "Navigated to product";
    },
  },
});
```

---

*OmniaVital is not another supplement store — it is the operating system for personal wellness optimization: AI-guided, quantitatively tracked, community-enriched, and built for retention and lifetime value from day one.*
