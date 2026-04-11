# OmniVital — Premium Performance Wellness

## Product Overview
OmniVital is a white-label health and wellness platform offering six precision supplement formulas organized into three daily time windows. Users build personalized "ritual stacks", track adherence, chat with an AI advisor, and connect with a privacy-first community.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Framer Motion
- **Backend**: FastAPI + MongoDB (AI advisor chat + persistence)
- **Auth/User Data**: Supabase (auth, profiles, user_rituals, ritual_logs, email_signups)
- **AI Advisor**: GPT-4.1 via Emergent Integrations (context-aware wellness chat)
- **Voice Agent**: ElevenLabs integration
- **Product Data**: Static catalog in `src/data/products.ts` (IDs match Supabase)

## Pages
- `/` — Landing page (Hero, RitualGrid, Science, Community CTA)
- `/product/:slug` — Product detail with benefits, tabs, Add to Ritual
- `/auth` — Sign in/up via Supabase Auth
- `/dashboard` — Protected ritual OS (streaks, check-ins, morning/midday/evening groups)
- `/advisor` — AI Ritual Advisor chat (GPT-4.1, context-aware)
- `/community` — The Collective (privacy-preserving color tags, discussion threads)
- `/checkout` — Subscription checkout (Stripe-ready placeholder)

## Product Catalog
1. OV Drive ($64) - Morning - Energy - Cordyceps Militaris
2. OV Adapt ($68) - Morning - Stress Resilience - KSM-66 Ashwagandha
3. OV Bright ($72) - Midday - Mood - affron® Saffron Extract
4. OV Quiet Focus ($66) - Midday - Focus - Cognizin® CDP-Choline
5. OV Neuro Night ($74) - Evening - Sleep/Recovery - Magnesium Glycinate
6. OV Cortex ($78) - Evening - Cognition - Bacopa Monnieri

## Remaining Work
- [ ] Connect Stripe to checkout
- [ ] Full community (threaded discussions, real-time messaging)
- [ ] Ritual calendar view
- [ ] Push notifications for ritual reminders
- [ ] RAG on authoritative wellness research for advisor
