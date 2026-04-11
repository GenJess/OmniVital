# OmniVital — Premium Performance Wellness

> *Your Ritual, Precision Built.*

OmniVital is a next-generation health and wellness platform that goes beyond selling supplements. We build **end-to-end wellness relationships** — from helping users find the right products, to tracking adherence with an AI-powered ritual advisor, to connecting them with a privacy-first community of like-minded individuals.

No more guru-optimized first conversions that leave customers on their own. OmniVital helps them at every step.

---

## Vision

The wellness supplement industry is broken in a familiar way: brands optimize for the first purchase, then disappear. The customer is left with a bottle and no guidance on timing, stacking, or long-term optimization.

**OmniVital inverts this model.**

We believe the product is just the entry point. The real value is in:

1. **The Ritual** — A structured, time-of-day protocol that turns supplementation from a random habit into an intentional practice
2. **The Advisor** — An AI expert that knows your stack, your goals, and the latest research — always available, never selling
3. **The Collective** — A privacy-preserving community where people connect through shared wellness goals, not personal data

---

## Product Line

Six precision formulas organized into three daily windows:

### Morning
| Product | Price | Hero Ingredient | Focus |
|---------|-------|-----------------|-------|
| **OV Drive** | $64/mo | Cordyceps Militaris | Caffeine-free energy, mitochondrial ATP support |
| **OV Adapt** | $68/mo | KSM-66 Ashwagandha | HPA-axis regulation, stress resilience |

### Midday
| Product | Price | Hero Ingredient | Focus |
|---------|-------|-----------------|-------|
| **OV Bright** | $72/mo | affron® Saffron Extract | Serotonergic mood support, emotional balance |
| **OV Quiet Focus** | $66/mo | Cognizin® CDP-Choline | Acetylcholine + NGF, calm concentration |

### Evening
| Product | Price | Hero Ingredient | Focus |
|---------|-------|-----------------|-------|
| **OV Neuro Night** | $74/mo | Magnesium Glycinate | Sleep architecture, glymphatic recovery |
| **OV Cortex** | $78/mo | Bacopa Monnieri (BaCognize®) | Working memory, executive function |

All products feature clinically studied, patented ingredients at research-validated dosages. Third-party tested, GMP-certified, non-GMO, vegan.

---

## Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript + Vite | SPA with hot reload |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first design system |
| **Animations** | Framer Motion | Premium micro-interactions |
| **Auth & User Data** | Supabase | Authentication, user rituals, ritual logs, email signups |
| **Product Catalog** | Static TypeScript module | Instant load, no API dependency for catalog |
| **AI Advisor** | FastAPI + OpenAI (GPT-4.1) | Context-aware wellness chat |
| **Chat Persistence** | MongoDB | Multi-session conversation history |
| **Voice Agent** | ElevenLabs | Voice-based ritual advisor (floating orb) |

### Why This Architecture?

**Static product catalog** (`src/data/products.ts`): Products change infrequently. Serving them from a static module means zero API calls for the catalog, instant page loads, and no dependency on database availability for the storefront. Product IDs match Supabase exactly, so user-specific data (rituals, logs) still uses the database seamlessly.

**Supabase for user data**: Row-level security policies ensure users can only access their own rituals and logs. Auto-profile creation on signup via database triggers. Email signups for waitlist are insert-only (no read access via anon key).

**FastAPI + MongoDB for AI advisor**: The advisor needs conversation persistence and LLM integration. MongoDB stores chat history by session ID. The system prompt is deeply tailored to OmniVital's product line and ritual philosophy.

**Separation of concerns**: The frontend talks to Supabase directly for auth and user data. It talks to the FastAPI backend only for AI advisor functionality. This keeps the architecture clean and each service focused.

---

## Pages & Features

### `/` — Landing Page
- **Hero**: Full-screen with product imagery, "Your Ritual, Precision Built" headline
- **Ritual Grid**: All 6 products grouped by morning/midday/evening with product cards
- **Science Section**: Research credibility and methodology
- **Community CTA**: Email signup + link to The Collective
- **Voice Agent**: Floating ElevenLabs orb (bottom right)

### `/product/:slug` — Product Detail Pages
- Product image with color-themed gradient overlay
- Category + schedule slot badges
- Hero ingredient callout
- Full description + 4 benefit bullets
- "Add to Ritual" CTA (writes to Supabase `user_rituals`)
- Bio-Availability / Sourcing / Daily Ritual tabs
- Directions panel
- Trust badges (Clinically Dosed, 3rd-Party Tested, Clean Sourced)

### `/auth` — Authentication
- Supabase Auth (email/password)
- Sign in / Sign up toggle
- OmniVital branded experience
- Redirects to dashboard on success

### `/dashboard` — Ritual Dashboard (Protected)
- Greeting with user's name + ritual completion stats
- 7-day streak tracker with visual bar chart
- Ritual stack grouped by morning/midday/evening
- Daily check-in with 1-5 feeling score
- Add/remove/pause products in ritual
- Collective tips (protocol advice, science insights)
- Community chat preview
- AI advisor CTA

### `/advisor` — AI Ritual Advisor (Protected)
- Full-screen chat interface with OV advisor
- Context-aware: knows the user's current ritual stack
- Suggested questions for new users
- Chat history persistence across sessions
- Clear history option
- Powered by GPT-4.1 via Emergent Integrations

### `/community` — The Collective
- "Your People. Your Privacy." hero
- Privacy-preserving color-tag system (6 wellness colors)
- "How The Collective Works" explainer
- Sample discussion threads with color badges
- Join CTA for unauthenticated users
- Coming-soon notice for full community features

### `/checkout` — Subscription Checkout (Protected)
- Cart populated from user's active ritual stack
- Monthly/quarterly billing toggle (10% quarterly discount)
- Order summary with subtotal, discount, shipping (free)
- "Subscribe Now" button (Stripe-ready placeholder)
- Trust badges (SSL, cancel anytime, free shipping)

---

## Database Schema (Supabase)

### `products`
Full catalog with `schedule_slot`, `hero_ingredient`, `benefit_bullets` (JSONB), `color_tag` (JSONB), `display_order`, `active` flag. RLS: public read for all.

### `profiles`
Linked to `auth.users` via FK. Auto-created on signup via trigger. Stores `full_name` and `ritual_summary`.

### `user_rituals`
Links users to products with `schedule_slot`, `is_paused`, `display_order`. Unique constraint on `(user_id, product_id)`. RLS: users manage their own only.

### `ritual_logs`
Daily check-ins with `feeling_score` (1-5) and optional `notes`. Indexed on `user_id` and `logged_at`. RLS: users manage their own only.

### `email_signups`
Waitlist/newsletter signups. Insert-only RLS (no read for anon).

---

## AI Advisor System

The OV Advisor is powered by OpenAI GPT-4.1 through Emergent Integrations. Key design decisions:

- **System prompt**: 2000+ word prompt covering the full product line, dosing protocols, stacking strategies, timing guidelines, and behavioral guardrails
- **Context injection**: User's active ritual stack is injected per-message so the advisor can reference specific products
- **Conversation memory**: Last 10 messages are replayed as context for continuity
- **Guardrails**: No medical claims, no pressure to buy, always recommend consulting healthcare professionals
- **Personality**: Calm, evidence-based, premium tone — mirrors the OmniVital brand

---

## Design System

### Color Palette
- **Background**: Near-black (`hsl(210, 20%, 6%)`)
- **Card**: Elevated dark (`hsl(210, 18%, 9%)`)
- **Primary**: OmniVital Teal (`hsl(168, 76%, 42%)`)
- **Accent**: Gold (`hsl(42, 80%, 55%)`)
- **Product Colors**: Each product has a unique `color_tag` (teal, amber, pink, indigo, violet, red)

### Typography
- Tracking: Heavy letter-spacing on labels (0.2em–0.5em)
- Weights: Bold headings, light body text
- Size hierarchy: XS labels → SM body → LG section headers → 5XL hero

### Components
- Glass cards with subtle borders
- Color-coded product badges
- Animated product cards with hover effects
- Teal/gold gradient CTAs
- OVO·G membership badges

---

## Stripe Integration (Ready to Connect)

The checkout page is fully scaffolded and ready for Stripe:

1. **Cart state**: Populated from `user_rituals` table
2. **Billing intervals**: Monthly and quarterly (with 10% discount)
3. **Order summary**: Calculated dynamically
4. **Subscribe button**: Calls `handleCheckout()` — connect Stripe Checkout here
5. **Product pages**: "Add to Ritual" → adds to DB → shows in checkout

### To connect Stripe:
1. Create Stripe products matching the 6 OmniVital products
2. Create monthly and quarterly price objects for each
3. Install `@stripe/stripe-js` and configure with your publishable key
4. Replace `handleCheckout()` with Stripe Checkout session creation
5. Add webhook handler for subscription lifecycle events

---

## Environment Variables

### Frontend (`frontend/.env`)
```
REACT_APP_BACKEND_URL=<backend URL>
VITE_SUPABASE_URL=<supabase project URL>
VITE_SUPABASE_ANON_KEY=<supabase anon key>
```

### Backend (`backend/.env`)
```
MONGO_URL=<mongodb connection string>
DB_NAME=omnivital
CORS_ORIGINS=*
EMERGENT_LLM_KEY=<emergent universal key>
```

---

## Running Locally

```bash
# Frontend
cd frontend
yarn install
yarn dev

# Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

---

## What's Left

- [ ] **Stripe integration**: Connect products to Stripe prices, implement checkout flow
- [ ] **Full community**: Threaded discussions, real-time messaging, color-matched groups
- [ ] **Ritual calendar**: Visual calendar view of adherence history
- [ ] **Push notifications**: Ritual reminders at scheduled times
- [ ] **RAG on research**: Upload authoritative wellness research for advisor context
- [ ] **Admin panel**: Product management, community moderation, analytics

---

*Built with intention. Engineered for performance. Designed for the humans who use it.*
