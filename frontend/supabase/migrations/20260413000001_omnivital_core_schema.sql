-- ============================================================
-- OMNIVITAL CORE SCHEMA — Migration 001
-- Applied to: GenJessLabs (fcepdlsszyswvfeewkap)
-- Date: 2026-04-13
--
-- Tables:
--   ov_products       — product catalog (publicly readable)
--   ov_email_signups  — waitlist email captures
--   ov_profiles       — user profiles (auto-created on signup)
--   ov_user_rituals   — user's active formula stack
--   ov_ritual_logs    — daily check-ins with feeling score
--
-- Design decisions:
--   - All tables prefixed with ov_ to avoid conflicts on this
--     shared multipurpose DB (GenJessLabs)
--   - product_id in ov_user_rituals and ov_ritual_logs is TEXT
--     (not UUID FK) because products live in the frontend static
--     catalog (src/data/products.ts). This avoids a sync step
--     while still enabling iteration at the DB level later.
--   - RLS on every table: users can only read/write their own rows
--   - profile is auto-created via trigger on auth.users INSERT
-- ============================================================

-- 1. PRODUCTS TABLE (reference catalog - publicly readable)
CREATE TABLE IF NOT EXISTS public.ov_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  schedule_slot TEXT NOT NULL DEFAULT 'morning',
  description TEXT NOT NULL DEFAULT '',
  short_description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  hero_ingredient TEXT,
  dosage_text TEXT,
  directions_text TEXT,
  benefit_bullets JSONB NOT NULL DEFAULT '[]'::jsonb,
  bio_availability_text TEXT,
  sourcing_text TEXT,
  daily_ritual_text TEXT,
  color_tag JSONB NOT NULL DEFAULT '{}'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ov_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON public.ov_products FOR SELECT
  USING (true);

-- 2. EMAIL_SIGNUPS TABLE (waitlist - insert only)
CREATE TABLE IF NOT EXISTS public.ov_email_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ov_email_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert email signup"
  ON public.ov_email_signups FOR INSERT
  WITH CHECK (true);

-- 3. PROFILES TABLE (auto-created on signup)
CREATE TABLE IF NOT EXISTS public.ov_profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  ritual_summary TEXT,
  avatar_color TEXT DEFAULT '#0D9488',
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ov_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.ov_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.ov_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.ov_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 4. USER_RITUALS TABLE (user's active formula stack)
CREATE TABLE IF NOT EXISTS public.ov_user_rituals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  schedule_slot TEXT,
  is_paused BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX ov_user_rituals_user_product_idx ON public.ov_user_rituals(user_id, product_id);

ALTER TABLE public.ov_user_rituals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rituals"
  ON public.ov_user_rituals FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rituals"
  ON public.ov_user_rituals FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rituals"
  ON public.ov_user_rituals FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rituals"
  ON public.ov_user_rituals FOR DELETE USING (auth.uid() = user_id);

-- 5. RITUAL_LOGS TABLE (daily check-ins with feeling score)
CREATE TABLE IF NOT EXISTS public.ov_ritual_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  feeling_score INTEGER NOT NULL DEFAULT 3 CHECK (feeling_score BETWEEN 1 AND 5),
  notes TEXT
);

ALTER TABLE public.ov_ritual_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own logs"
  ON public.ov_ritual_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logs"
  ON public.ov_ritual_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own logs"
  ON public.ov_ritual_logs FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.ov_handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.ov_profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ov_on_auth_user_created ON auth.users;
CREATE TRIGGER ov_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.ov_handle_new_user();

-- TRIGGER: Auto-update updated_at on profile changes
CREATE OR REPLACE FUNCTION public.ov_update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER ov_update_profiles_updated_at
  BEFORE UPDATE ON public.ov_profiles
  FOR EACH ROW EXECUTE FUNCTION public.ov_update_updated_at();
