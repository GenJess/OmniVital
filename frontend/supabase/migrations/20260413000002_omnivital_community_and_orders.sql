-- ============================================================
-- OMNIVITAL COMMUNITY & ORDERS — Migration 002
-- Applied to: GenJessLabs (fcepdlsszyswvfeewkap)
-- Date: 2026-04-13
--
-- Tables:
--   ov_community_threads  — discussion threads
--   ov_community_replies  — replies to threads (with realtime)
--   ov_community_likes    — likes on threads/replies (deduped)
--   ov_orders             — user subscription records
--
-- Design decisions:
--   - Threads expose author_id but use color_tag (not name/email)
--     as the public identity — privacy-first design
--   - reply_count and like_count are denormalized counters maintained
--     by DB triggers for cheap reads without joins
--   - REPLICA IDENTITY FULL on community tables enables Supabase
--     Realtime row-level change broadcasts for live chat
--   - ov_orders tracks the subscription intent + product list;
--     Stripe integration is additive (stripe_subscription_id column)
-- ============================================================

-- 6. COMMUNITY_THREADS
CREATE TABLE IF NOT EXISTS public.ov_community_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  color_tag TEXT NOT NULL DEFAULT 'Teal Focus',
  color_hex TEXT NOT NULL DEFAULT '#0D9488',
  product_tags TEXT[] NOT NULL DEFAULT '{}',
  reply_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  pinned BOOLEAN NOT NULL DEFAULT false,
  is_team_post BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ov_community_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Threads readable by authenticated users"
  ON public.ov_community_threads FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create threads"
  ON public.ov_community_threads FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own threads"
  ON public.ov_community_threads FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own threads"
  ON public.ov_community_threads FOR DELETE USING (auth.uid() = author_id);

-- 7. COMMUNITY_REPLIES
CREATE TABLE IF NOT EXISTS public.ov_community_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES public.ov_community_threads(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ov_community_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Replies readable by authenticated users"
  ON public.ov_community_replies FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create replies"
  ON public.ov_community_replies FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their replies"
  ON public.ov_community_replies FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their replies"
  ON public.ov_community_replies FOR DELETE USING (auth.uid() = author_id);

-- 8. COMMUNITY_LIKES
CREATE TABLE IF NOT EXISTS public.ov_community_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thread_id UUID REFERENCES public.ov_community_threads(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.ov_community_replies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, thread_id),
  UNIQUE(user_id, reply_id)
);

ALTER TABLE public.ov_community_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes readable by authenticated users"
  ON public.ov_community_likes FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert their own likes"
  ON public.ov_community_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON public.ov_community_likes FOR DELETE USING (auth.uid() = user_id);

-- 9. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.ov_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  billing_interval TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_interval IN ('monthly', 'quarterly')),
  product_ids TEXT[] NOT NULL DEFAULT '{}',
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  stripe_subscription_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ov_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
  ON public.ov_orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
  ON public.ov_orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
  ON public.ov_orders FOR UPDATE USING (auth.uid() = user_id);

-- updated_at triggers
CREATE TRIGGER ov_update_orders_updated_at
  BEFORE UPDATE ON public.ov_orders
  FOR EACH ROW EXECUTE FUNCTION public.ov_update_updated_at();

CREATE TRIGGER ov_update_threads_updated_at
  BEFORE UPDATE ON public.ov_community_threads
  FOR EACH ROW EXECUTE FUNCTION public.ov_update_updated_at();

-- Auto-increment reply_count on threads
CREATE OR REPLACE FUNCTION public.ov_increment_reply_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.ov_community_threads SET reply_count = reply_count + 1 WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER ov_on_reply_created
  AFTER INSERT ON public.ov_community_replies
  FOR EACH ROW EXECUTE FUNCTION public.ov_increment_reply_count();

CREATE OR REPLACE FUNCTION public.ov_decrement_reply_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.ov_community_threads SET reply_count = GREATEST(reply_count - 1, 0) WHERE id = OLD.thread_id;
  RETURN OLD;
END;
$$;

CREATE TRIGGER ov_on_reply_deleted
  AFTER DELETE ON public.ov_community_replies
  FOR EACH ROW EXECUTE FUNCTION public.ov_decrement_reply_count();

-- Auto-increment/decrement like_count on threads
CREATE OR REPLACE FUNCTION public.ov_update_like_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.thread_id IS NOT NULL THEN
    UPDATE public.ov_community_threads SET like_count = like_count + 1 WHERE id = NEW.thread_id;
  ELSIF TG_OP = 'DELETE' AND OLD.thread_id IS NOT NULL THEN
    UPDATE public.ov_community_threads SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.thread_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER ov_on_like_insert
  AFTER INSERT ON public.ov_community_likes
  FOR EACH ROW EXECUTE FUNCTION public.ov_update_like_count();

CREATE TRIGGER ov_on_like_delete
  AFTER DELETE ON public.ov_community_likes
  FOR EACH ROW EXECUTE FUNCTION public.ov_update_like_count();

-- Enable Realtime on community tables
ALTER TABLE public.ov_community_threads REPLICA IDENTITY FULL;
ALTER TABLE public.ov_community_replies REPLICA IDENTITY FULL;
ALTER TABLE public.ov_community_likes REPLICA IDENTITY FULL;
