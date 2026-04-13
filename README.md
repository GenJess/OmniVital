# OmniVital — Premium Performance Wellness

> *Your Ritual, Precision Built.*

OmniVital is a next-generation health and wellness platform that goes beyond selling supplements. We build **end-to-end wellness relationships** — from helping users find the right products, to tracking adherence with an AI-powered ritual advisor, to connecting them with a privacy-first community of like-minded individuals.

---

## Vision

The wellness supplement industry is broken in a familiar way: brands optimize for the first purchase, then disappear. The customer is left with a bottle and no guidance on timing, stacking, or long-term optimization.

**OmniVital inverts this model.**

1. **The Ritual** — A structured, time-of-day protocol that turns supplementation into an intentional practice
2. **The Advisor** — An AI expert that knows your stack, your goals, and the latest research — always available
3. **The Collective** — A privacy-preserving community where people connect through shared wellness goals

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
| **Auth & User Data** | Supabase (GenJessLabs) | Auth, rituals, logs, community, orders |
| **Product Catalog** | Static TypeScript module | Instant load, no API dependency |
| **AI Advisor** | FastAPI + OpenAI (GPT-4.1) | Context-aware wellness chat |
| **Chat Persistence** | MongoDB | Multi-session conversation history |
| **Voice Agent** | ElevenLabs | Voice-based ritual advisor (floating orb) |

---

## Database Schema

**Supabase project**: GenJessLabs (`fcepdlsszyswvfeewkap`)  
**Shared DB**: All OmniVital tables are prefixed `ov_` to coexist with other projects.

### Design Decisions

1. **`ov_` prefix on all tables** — GenJessLabs is a multipurpose/testing DB. Prefixing avoids name conflicts with other projects on the same instance.

2. **`product_id` is TEXT (not UUID FK)** — Products live in the static frontend catalog (`src/data/products.ts`). Using a text ID avoids maintaining a DB sync step for product data while the catalog is small and changes infrequently. When we need reporting or admin, we can add a proper FK later.

3. **Denormalized counters on threads** — `reply_count` and `like_count` on `ov_community_threads` are maintained by DB triggers (`ov_on_reply_created`, `ov_on_like_insert`). This avoids expensive COUNT queries in the community feed.

4. **REPLICA IDENTITY FULL on community tables** — Enables Supabase Realtime to broadcast row-level changes (new replies appear in real-time without polling).

5. **RLS on all tables** — Users can only read/write their own rows. Community content (threads, replies) is readable by any authenticated user, but writable only by the author.

6. **Profile auto-creation trigger** — `ov_handle_new_user()` fires on `auth.users` INSERT to create a profile row automatically, so the app never has to check if a profile exists.

### Tables

#### `ov_profiles`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | References `auth.users(id)` |
| `full_name` | TEXT | User's display name |
| `ritual_summary` | TEXT | AI-generated ritual description (shown in voice advisor) |
| `avatar_color` | TEXT | Hex color for community badge (defaults to `#0D9488`) |
| `onboarding_completed` | BOOLEAN | Tracks onboarding flow |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | Auto-updated by trigger |

#### `ov_user_rituals`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `user_id` | UUID | References `auth.users(id)` |
| `product_id` | TEXT | Product ID from static catalog |
| `schedule_slot` | TEXT | `morning` / `midday` / `evening` |
| `is_paused` | BOOLEAN | Paused rituals excluded from check-ins |
| `display_order` | INTEGER | Within-slot ordering |
| `added_at` | TIMESTAMPTZ | When the user added this formula |

Unique constraint: `(user_id, product_id)` — one entry per user per product.

#### `ov_ritual_logs`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `user_id` | UUID | |
| `product_id` | TEXT | |
| `feeling_score` | INTEGER | 1–5 scale, checked daily |
| `notes` | TEXT | Optional text note |
| `logged_at` | TIMESTAMPTZ | Defaults to now() |

Used for: streak calculation, calendar heatmap, advisor context, avg score display.

#### `ov_community_threads`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `author_id` | UUID | References `auth.users(id)` |
| `title` | TEXT | Thread headline |
| `body` | TEXT | Full post body |
| `color_tag` | TEXT | e.g. "Teal Focus" — public identity, not name |
| `color_hex` | TEXT | Hex color of the tag |
| `product_tags` | TEXT[] | Optional product mentions |
| `reply_count` | INTEGER | Denormalized, maintained by trigger |
| `like_count` | INTEGER | Denormalized, maintained by trigger |
| `pinned` | BOOLEAN | Admin-pinned posts |
| `is_team_post` | BOOLEAN | OmniVital team posts |

#### `ov_community_replies`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `thread_id` | UUID | FK → `ov_community_threads` |
| `author_id` | UUID | |
| `body` | TEXT | |
| `like_count` | INTEGER | |
| `created_at` | TIMESTAMPTZ | |

Realtime enabled — new replies broadcast instantly to all viewers of a thread.

#### `ov_community_likes`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `user_id` | UUID | |
| `thread_id` | UUID (nullable) | Like on a thread |
| `reply_id` | UUID (nullable) | Like on a reply |

Unique constraints prevent duplicate likes per user per thread/reply.

#### `ov_orders`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `user_id` | UUID | |
| `status` | TEXT | `active` / `paused` / `cancelled` |
| `billing_interval` | TEXT | `monthly` / `quarterly` |
| `product_ids` | TEXT[] | Snapshot of subscribed products |
| `subtotal` | NUMERIC | Before discount |
| `discount_pct` | NUMERIC | 0 or 20 |
| `total` | NUMERIC | Final charged amount |
| `stripe_subscription_id` | TEXT | Populated when Stripe connected |
| `notes` | TEXT | |

#### `ov_email_signups`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `email` | TEXT UNIQUE | |
| `created_at` | TIMESTAMPTZ | |

Insert-only (no RLS read policy for anon).

#### `ov_products`
Reference catalog in Supabase. Currently unused by the frontend (static catalog is source of truth) but available for admin tooling and future server-side personalization.

---

## Migration Files

```
frontend/supabase/migrations/
├── 20260215203300_*.sql          # Legacy: products, email_signups (not applied to GenJessLabs)
├── 20260217205140_*.sql          # Legacy: profiles, rituals, logs triggers (not applied)
├── 20260413000001_omnivital_core_schema.sql       # Applied ✓ GenJessLabs
└── 20260413000002_omnivital_community_and_orders.sql  # Applied ✓ GenJessLabs
```

---

## Routes & Pages

### Public Routes
| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Hero, product grid, science section, email signup |
| `/product/:slug` | ProductDetail | Full product page with "Add to Ritual" |
| `/auth` | Auth | Sign in / sign up |

### Protected Routes (Requires Auth)
| Route | Page | Description |
|-------|------|-------------|
| `/collective` | CollectiveDashboard | Ritual tracker, streak, calendar, AI advisor chat |
| `/collective/protocol` | CollectiveProtocol | Build/manage formula stack, subscribe |
| `/collective/community` | CollectiveCommunity | Live community threads, replies, likes |

---

## Signed-In Experience

### Dashboard (`/collective`)
- **Greeting** with first name, time-of-day awareness
- **Stats**: streak, today's completion %, active formula count
- **7-day streak bar** — visual blocks for each day
- **Today tab**: Ritual stack grouped by morning/midday/evening with check-in (1–5 score)
- **History tab**: Monthly calendar heatmap showing check-in history, color-coded by feeling score
- **AI Advisor chat**: Real-time chat powered by backend (GPT-4.1), personalized with:
  - Active formula stack
  - Today's avg feeling score
  - Current streak days
  - User's name
- **Voice Agent** (floating orb): ElevenLabs voice advisor, injected with user's ritual context via dynamic variables

### Protocol (`/collective/protocol`)
- Browse all 6 formulas by time slot
- Add/remove/pause formulas in your stack (persisted to `ov_user_rituals`)
- Subscribe & Save toggle (20% off quarterly)
- Live order summary with running total
- **Subscribe Now**: Creates or updates an `ov_orders` record (Stripe integration additive)
- Shows active subscription status if already subscribed

### Community (`/collective/community`)
- **Live threads** fetched from `ov_community_threads` (Supabase)
- **Realtime replies** — new replies broadcast instantly via Supabase Realtime
- **Post a thread**: color tag picker, title, body — writes to `ov_community_threads`
- **Thread detail**: slide-in panel with all replies, reply input, like button
- **Likes**: optimistic UI, deduplicated in DB
- **Privacy**: identity shown as color badge only (not name/email)
- User's badge color derived from `ov_profiles.avatar_color`

---

## AI Personalization

### Text Chat (Backend)
The `/api/advisor/chat` endpoint receives a `ritual_context` string built from:
- Active formula names + schedule slots + prices
- Today's avg feeling score
- Current streak days
- User's full name

This is appended to the system prompt so GPT-4.1 responds as a personalized advisor.

### Voice Agent (ElevenLabs)
`VoiceAgent.tsx` fetches the user's ritual context on mount, then passes it to ElevenLabs as `dynamicVariables`:
```ts
dynamicVariables: {
  user_name: profile.full_name.split(" ")[0],
  ritual_context: "Active formulas: OV Drive, OV Adapt...",
  streak_days: "7",
}
```
These variables are injected into the ElevenLabs agent's system prompt at session start.

---

## Environment Variables

### Frontend (`frontend/.env`)
```bash
VITE_SUPABASE_URL=https://fcepdlsszyswvfeewkap.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_APP_ENV=development
```

### Backend (`backend/.env`)
```bash
MONGO_URL=mongodb://...
DB_NAME=omnivital
EMERGENT_LLM_KEY=...
CORS_ORIGINS=http://localhost:5173,https://your-domain.com
```

---

## Local Development

```bash
# Frontend
cd frontend
npm install
npm run dev          # http://localhost:5173

# Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```

---

## Roadmap

### Next
- [ ] **Stripe integration** — Connect Subscribe Now to Stripe Checkout
- [ ] **Community moderation** — Admin can pin/delete threads
- [ ] **Profile onboarding** — Set name, goals, color tag during first login
- [ ] **Ritual reminders** — Push/email notifications at scheduled times

### Later
- [ ] Admin dashboard (product management, user analytics)
- [ ] Ritual AI summary (auto-update `ritual_summary` based on logs + check-ins)
- [ ] Mobile app (React Native)
- [ ] Community DMs
- [ ] Research docs RAG for advisor

---

## Key Files

```
frontend/
├── src/
│   ├── pages/collective/
│   │   ├── CollectiveDashboard.tsx    # Main dashboard + AI chat + calendar
│   │   ├── CollectiveProtocol.tsx     # Formula builder + subscription
│   │   └── CollectiveCommunity.tsx    # Live community threads
│   ├── components/
│   │   ├── RitualCalendar.tsx         # Monthly calendar heatmap
│   │   ├── VoiceAgent.tsx             # ElevenLabs floating orb + context
│   │   └── ...
│   ├── contexts/AuthContext.tsx        # Supabase auth + profile
│   ├── integrations/supabase/
│   │   ├── client.ts                  # Supabase client
│   │   └── types.ts                   # TypeScript types (all ov_ tables)
│   └── data/products.ts               # Static product catalog (source of truth)
├── supabase/migrations/               # SQL migration files
└── .env                               # Supabase credentials (not committed)

backend/
├── server.py                          # FastAPI + GPT-4.1 advisor
└── requirements.txt
```
