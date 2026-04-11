# OmniVital — Premium Performance Wellness

## Product Overview
OmniVital is a white-label health and wellness platform offering six precision supplement formulas organized into three daily time windows. Users build personalized "ritual stacks", track adherence, chat with an AI advisor, and connect with a privacy-first community. The platform is designed as a "Wellness Operating System" — AI-guided, quantitatively tracked, community-enriched, built for retention and lifetime value.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Framer Motion
- **Backend**: FastAPI + MongoDB (AI advisor chat + persistence)
- **Auth/User Data**: Supabase (auth, profiles, user_rituals, ritual_logs, email_signups)
- **AI Advisor**: GPT-4.1 via Emergent Integrations (context-aware wellness chat)
- **Voice Agent**: ElevenLabs integration
- **Product Data**: Static catalog in `src/data/products.ts` (IDs match Supabase)

## Pages
- `/` — Landing page (Hero, RitualGrid, ExperienceSection, Science, Community CTA)
- `/product/:slug` — Product detail with daily ritual pricing, Subscribe & Save toggle, benefits, tabs
- `/auth` — Sign in/up via Supabase Auth
- `/collective` — Protected portal: Dashboard (AI Advisor + ritual tracking)
- `/collective/community` — The Collective (privacy-preserving color tags, discussion threads)
- `/collective/protocol` — My Protocol (manage formulas, order summary, Stripe placeholder)

## Design System
- **Corners**: Sharp 2px radius (`--radius: 0.125rem`) — clinical, premium feel
- **Glassmorphism**: `backdrop-filter: blur(12px)` + `border: 1px solid rgba(255,255,255,0.1)` on all cards
- **Colors**: Teal primary (168,76%,42%), Gold accent (42,80%,55%), near-black background (0,0%,4%)
- **Typography**: Inter font family, sharp tracking on uppercase labels
- **Voice Agent**: Yin-yang mirrored logo button (dark orb, bottom-right), panel with close button

## Product Catalog
1. OV Drive ($64) - Morning - Energy - Cordyceps Militaris
2. OV Adapt ($68) - Morning - Stress Resilience - KSM-66 Ashwagandha
3. OV Bright ($72) - Midday - Mood - affron Saffron Extract
4. OV Quiet Focus ($66) - Midday - Focus - Cognizin CDP-Choline
5. OV Neuro Night ($74) - Evening - Sleep/Recovery - Magnesium Glycinate
6. OV Cortex ($78) - Evening - Cognition - Bacopa Monnieri

## Completed Work
- [x] Full landing page (Hero, RitualGrid, ExperienceSection, ScienceSection, CommunitySection)
- [x] New atmospheric hero background (dark moody mountains, no text conflicts)
- [x] "Experience" nav item + section explaining how platform works (4 steps)
- [x] UI Sharpness pass (2px corners, glassmorphism depth on all cards)
- [x] Voice Agent: yin-yang mirrored logo button, close button on panel, no text label
- [x] Product Detail Page with daily ritual pricing + Subscribe & Save toggle
- [x] AI Advisor chat endpoint (POST /api/advisor/chat)
- [x] Voice Agent (ElevenLabs)
- [x] Portal model: /collective routes with sidebar layout (Dashboard, Community, Protocol)
- [x] Navbar with 3 nav items (Products, Experience, Science) + Sign In/Join CTA
- [x] Glassmorphism product cards with $X.XX/daily ritual pricing
- [x] Subscribe & Save 20% toggle on landing page and PDP
- [x] Auth race condition fix (no loading flicker on route transitions)
- [x] Favicon set to OmniVital logo
- [x] Responsive tablet image sizing (4:3 aspect ratio on tablet)

## Remaining Work
- [ ] Three.js fluid sphere OV Voice orb with GSAP breathing animation (Phase 3)
- [ ] Community Color-Blend logic (8 Wellness Tribes, gradient tags, routine blending)
- [ ] 3-Tier image display on Product Detail (Hero, Texture, Benefit images)
- [ ] Connect Stripe to checkout (CollectiveProtocol has placeholder)
- [ ] Full community (threaded discussions, real-time messaging)
- [ ] Apple Watch / health integration for tracking
- [ ] Ritual calendar view
- [ ] Push notifications for ritual reminders
- [ ] RAG on authoritative wellness research for advisor
- [ ] WCAG-compliant generative color system for community tags
