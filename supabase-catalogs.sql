-- ============================================================
-- Pacific Products & Solutions — Catalogs Table Migration
-- Run this in the Supabase SQL Editor to add catalog support.
-- ============================================================

-- ── Catalogs ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.catalogs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  file_url    TEXT NOT NULL,
  file_type   TEXT NOT NULL DEFAULT 'pdf',      -- 'pdf' | 'image'
  file_size   BIGINT NOT NULL DEFAULT 0,        -- size in bytes
  thumbnail_url TEXT NOT NULL DEFAULT '',        -- preview thumbnail
  product_id  UUID REFERENCES public.products(id) ON DELETE SET NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  published   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.catalogs
  ADD COLUMN IF NOT EXISTS document_type TEXT NOT NULL DEFAULT 'Catalog',
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Other';

-- ── Updated-at trigger ───────────────────────────────────────
DROP TRIGGER IF EXISTS catalogs_updated_at ON public.catalogs;
CREATE TRIGGER catalogs_updated_at
  BEFORE UPDATE ON public.catalogs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE public.catalogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published catalogs"
  ON public.catalogs FOR SELECT USING (published = true);

CREATE POLICY "Auth users can manage catalogs"
  ON public.catalogs FOR ALL USING (auth.role() = 'authenticated');

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_catalogs_published ON public.catalogs (published);
CREATE INDEX IF NOT EXISTS idx_catalogs_product ON public.catalogs (product_id);

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
