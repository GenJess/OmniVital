# OmniVital — Premium Performance Wellness

## Product Overview
OmniVital is a white-label health and wellness platform offering six precision supplement formulas organized into three daily time windows (morning, midday, evening). Users build personalized "ritual stacks" and track adherence through an AI-guided dashboard.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Framer Motion
- **Backend**: FastAPI (minimal - health checks)
- **Database**: Supabase (external) - auth, profiles, user_rituals, ritual_logs, products
- **Voice Agent**: ElevenLabs integration
- **Product Data**: Static catalog in `src/data/products.ts` (IDs match Supabase)

## Product Catalog (6 Products)
1. **OV Drive** ($64/mo) - Morning - Energy - Cordyceps Militaris
2. **OV Adapt** ($68/mo) - Morning - Stress Resilience - KSM-66 Ashwagandha
3. **OV Bright** ($72/mo) - Midday - Mood - affron® Saffron Extract
4. **OV Quiet Focus** ($66/mo) - Midday - Focus - Cognizin® CDP-Choline
5. **OV Neuro Night** ($74/mo) - Evening - Sleep/Recovery - Magnesium Glycinate
6. **OV Cortex** ($78/mo) - Evening - Cognition - Bacopa Monnieri

## Key Pages
- `/` — Landing page (Hero, RitualGrid, Science, Community)
- `/product/:slug` — Product detail with benefits, tabs, Add to Ritual
- `/auth` — Sign in/up via Supabase Auth
- `/dashboard` — Protected ritual management, streak tracking, check-ins

## Remaining Phases
- Phase 2: Dashboard → Ritual OS upgrade
- Phase 3: Ritual Calendar + adherence tracking
- Phase 4: Privacy-preserving color-tag community matching
- Phase 5: Subscription-ready checkout scaffolding
- Phase 6: Launch hardening + QA
