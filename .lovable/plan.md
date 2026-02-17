
# OmniaVital — AI-Personalized Ritual Platform

This is an ambitious, multi-part upgrade that transforms OmniaVital from a marketing site into an AI-driven, personalized wellness platform with user accounts, a ritual dashboard, and a premium voice/chat agent.

---

## What We're Building

### 1. Premium Voice/Chat Agent Widget (Quick Win)
The current floating button is plain. We'll redesign it to feel like a luxury product:
- Replace the simple circle with an elegant multi-ring pulsing orb using the teal-to-gold gradient
- Add subtle "OV" monogram branding with a glow effect
- Use a more intentional label like "Your Ritual Advisor" on hover
- The open panel gets a premium header with gradient accent bar and refined typography
- Active/listening state shows an animated waveform visualization

### 2. Authentication System
Add sign up / sign in so users can be part of "The Collective":
- New `/auth` page with a luxury dark-themed login/signup form
- Email + password authentication (with email verification)
- The "Account" nav link and CommunitySection "Apply" button will link to auth
- After auth, users land on their personal Ritual Dashboard

### 3. Database — New Tables
Three new tables alongside the existing `products` and `email_signups`:

**`profiles`** — Extended user info, linked to auth user ID:
- `id` (matches auth user id)
- `full_name`
- `created_at`
- `ritual_summary` (text — AI-generated summary of their personalized ritual, updated by agent conversations)

**`ritual_logs`** — Daily check-in tracking:
- `id`
- `user_id`
- `product_id` (FK to products)
- `logged_at`
- `notes` (text)
- `feeling_score` (1–5)

**`user_rituals`** — The user's active ritual (which products are in their stack):
- `id`
- `user_id`
- `product_id` (FK to products)
- `added_at`

RLS policies: users can only read/write their own rows.

### 4. The Ritual Dashboard — `/dashboard`
A private, authenticated page that becomes the heart of the product:

**Left panel / Header:**
- Personalized greeting: "Good morning, [Name]. Your ritual is optimized."
- Their active ritual stack (from `user_rituals`) shown as elegant cards

**Ritual Tracker:**
- Simple daily check-in UI — for each product in their stack, mark it done with a feeling score (1–5)
- Last 7 days streak view

**Community Feed (Phase 1 — simple):**
- A curated feed section with brand-voice posts / tips (static for now, labeled "From The Collective")

**Talk to Your Advisor button:**
- Opens the voice agent widget — same ElevenLabs agent, but when the user is logged in, their `ritual_summary` is passed as context to the agent so it "knows" their ritual

### 5. Navbar Update
- "Account" link becomes context-aware: links to `/auth` when logged out, `/dashboard` when logged in
- Show user avatar/initials when logged in

### 6. CommunitySection Upgrade
- Email capture CTA gets a second CTA button: "Create Your Account" linking to `/auth`
- The vision copy gets updated: "Join The Collective — AI-optimized rituals, a community of people doing the same."

---

## Technical Architecture

```text
Pages
├── / (Index) — updated CommunitySection + premium VoiceAgent
├── /auth — login/signup
├── /dashboard — protected, authenticated ritual hub
└── /product/:slug — existing PDP (unchanged)

Auth
└── Supabase email+password auth
    └── onAuthStateChange → React context (AuthProvider)

Database
├── profiles (RLS: own row only)
├── user_rituals (RLS: own rows only)
└── ritual_logs (RLS: own rows only)

Components
├── VoiceAgent.tsx — redesigned premium widget
├── AuthProvider.tsx — React context for auth state
├── ProtectedRoute.tsx — redirects to /auth if not logged in
└── pages/Dashboard.tsx — new ritual hub page
```

---

## Implementation Steps

**Step 1 — Database migrations**
- Create `profiles`, `user_rituals`, and `ritual_logs` tables with RLS
- Add a trigger: when a new auth user signs up, auto-insert a row into `profiles`

**Step 2 — Auth system**
- `AuthProvider` context wrapping the app
- `/auth` page with toggle between Sign Up and Sign In
- Protected route wrapper component

**Step 3 — Premium VoiceAgent redesign**
- New layered orb design with gradient, pulsing rings, waveform bars
- Updated panel with gradient header bar, better typography
- When user is logged in, surface their name + ritual summary in the panel intro copy

**Step 4 — Dashboard page**
- Fetch user's ritual stack from `user_rituals` joined with `products`
- Daily check-in component saving to `ritual_logs`
- Streak display for the last 7 days
- Static "From The Collective" tips section

**Step 5 — Navbar + CommunitySection updates**
- Wire "Account" to auth state
- Update community section copy and add account CTA

---

## Scope Note
The "community where you connect with real people" piece (social feeds, user-to-user interaction) is a larger social network feature. In this phase, we'll lay the foundation (profiles, the dashboard) and add a curated brand-voice tips feed. Full social is the natural Phase 2.
