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
- `/product/:slug` — Product detail with daily ritual pricing, Subscribe & Save toggle, benefits, tabs
- `/auth` — Sign in/up via Supabase Auth
- `/collective` — Protected portal: Dashboard (AI Advisor + ritual tracking)
- `/collective/community` — The Collective (privacy-preserving color tags, discussion threads)
- `/collective/protocol` — My Protocol (manage formulas, order summary, Stripe placeholder)

## Product Catalog
1. OV Drive ($64) - Morning - Energy - Cordyceps Militaris
2. OV Adapt ($68) - Morning - Stress Resilience - KSM-66 Ashwagandha
3. OV Bright ($72) - Midday - Mood - affron Saffron Extract
4. OV Quiet Focus ($66) - Midday - Focus - Cognizin CDP-Choline
5. OV Neuro Night ($74) - Evening - Sleep/Recovery - Magnesium Glycinate
6. OV Cortex ($78) - Evening - Cognition - Bacopa Monnieri

## Completed Work
- [x] Full landing page (Hero, RitualGrid, ScienceSection, CommunitySection)
- [x] Product Detail Page with daily ritual pricing + Subscribe & Save toggle
- [x] AI Advisor chat endpoint (POST /api/advisor/chat)
- [x] Voice Agent (ElevenLabs)
- [x] Portal model: /collective routes with sidebar layout (Dashboard, Community, Protocol)
- [x] Navbar with Sign In/Join CTA and The Collective portal link
- [x] Glassmorphism product cards with $X.XX/daily ritual pricing
- [x] Subscribe & Save 20% toggle on landing page and PDP
- [x] Auth race condition fix (no loading flicker on route transitions)
- [x] Favicon set to OmniVital logo
- [x] Branded Voice Agent floating button ("OV Voice")
- [x] Responsive tablet image sizing (4:3 aspect ratio on tablet)
- [x] Rebranding from OmniaVital to OmniVital

## Remaining Work
- [ ] 3-Tier image display on Product Detail (Hero, Texture, Benefit images)
- [ ] Connect Stripe to checkout (CollectiveProtocol has placeholder)
- [ ] Full community (threaded discussions, real-time messaging)
- [ ] Ritual calendar view
- [ ] Push notifications for ritual reminders
- [ ] RAG on authoritative wellness research for advisor
- [ ] React Router v7 future flag warnings cleanup
