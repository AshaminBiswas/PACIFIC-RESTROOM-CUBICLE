-- ============================================================
-- Pacific Products & Solutions — Supabase Schema
-- Run this in the Supabase SQL Editor to create all tables,
-- storage buckets, and RLS policies.
-- ============================================================

-- ── 1. Products ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  subtitle      TEXT NOT NULL DEFAULT '',
  description   TEXT NOT NULL DEFAULT '',
  bottom_description TEXT NOT NULL DEFAULT '',
  category      TEXT NOT NULL DEFAULT '',
  image_url     TEXT NOT NULL DEFAULT '',
  additional_images JSONB NOT NULL DEFAULT '[]',
  features      JSONB NOT NULL DEFAULT '[]',
  specifications JSONB NOT NULL DEFAULT '[]',
  applications  JSONB NOT NULL DEFAULT '[]',
  colors        JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_featured   BOOLEAN NOT NULL DEFAULT false,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  published     BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS colors JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS bottom_description TEXT NOT NULL DEFAULT '';

-- ── 2. Blogs ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blogs (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  excerpt         TEXT NOT NULL DEFAULT '',
  content         TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT NOT NULL DEFAULT '',
  author          TEXT NOT NULL DEFAULT 'Admin',
  category        TEXT NOT NULL DEFAULT '',
  tags            JSONB NOT NULL DEFAULT '[]',
  published       BOOLEAN NOT NULL DEFAULT false,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 3. Solutions ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.solutions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  subtitle    TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  bottom_description TEXT NOT NULL DEFAULT '',
  icon_name   TEXT NOT NULL DEFAULT 'Building2',
  image_url   TEXT NOT NULL DEFAULT '',
  additional_images JSONB NOT NULL DEFAULT '[]',
  features    JSONB NOT NULL DEFAULT '[]',
  clients     JSONB NOT NULL DEFAULT '[]',
  colors      JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  published   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 4. Gallery Images ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT '',
  location_slug TEXT,
  placement   TEXT NOT NULL DEFAULT 'general' CHECK (placement IN ('general', 'hero', 'gallery')),
  image_url   TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  published   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_images
  ADD COLUMN IF NOT EXISTS location_slug TEXT;

ALTER TABLE public.gallery_images
  ADD COLUMN IF NOT EXISTS placement TEXT NOT NULL DEFAULT 'general';

-- ── 5. Hero Images ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.hero_images (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url         TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 6. Core Services ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.core_services (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url   TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 7. Page Banners ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.page_banners (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug   TEXT NOT NULL,
  image_url   TEXT NOT NULL DEFAULT '',
  title       TEXT NOT NULL DEFAULT '',
  subtitle    TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 8. Contact Queries ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_queries (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL,
  company     TEXT,
  requirement TEXT,
  message     TEXT,
  status      TEXT DEFAULT 'new',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 9. Feedback ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.feedback (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  company     TEXT,
  stars       INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 10. Visitor Leads ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.visitor_leads (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address        TEXT,
  country           TEXT,
  city              TEXT,
  region            TEXT,
  email             TEXT,
  age               INTEGER,
  device_type       TEXT,
  browser           TEXT,
  os                TEXT,
  screen_resolution TEXT,
  referrer          TEXT,
  consent_given     BOOLEAN NOT NULL DEFAULT false
);

-- ── 11. Updated-at trigger ────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON public.products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS blogs_updated_at ON public.blogs;
CREATE TRIGGER blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS solutions_updated_at ON public.solutions;
CREATE TRIGGER solutions_updated_at
  BEFORE UPDATE ON public.solutions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ── 10. Row Level Security ────────────────────────────────────
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_leads ENABLE ROW LEVEL SECURITY;

-- ─ Public read policies (for published or public content)
CREATE POLICY "Public can view published products" ON public.products FOR SELECT USING (published = true);
CREATE POLICY "Public can view published blogs" ON public.blogs FOR SELECT USING (published = true);
CREATE POLICY "Public can view published solutions" ON public.solutions FOR SELECT USING (published = true);
CREATE POLICY "Public can view published gallery images" ON public.gallery_images FOR SELECT USING (published = true);
CREATE POLICY "Public can view hero images" ON public.hero_images FOR SELECT USING (true);
CREATE POLICY "Public can view core services" ON public.core_services FOR SELECT USING (true);
CREATE POLICY "Public can view page banners" ON public.page_banners FOR SELECT USING (true);

-- ─ Public Insert policies (for visitors submitting forms)
CREATE POLICY "Allow public insert" ON public.contact_queries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public feedback insert" ON public.feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view approved feedback" ON public.feedback FOR SELECT USING (true);
CREATE POLICY "Allow public insert visitor leads" ON public.visitor_leads FOR INSERT WITH CHECK (true);

-- ─ Authenticated full access policies (Admin Panel)
CREATE POLICY "Auth users can manage products" ON public.products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can manage blogs" ON public.blogs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can manage solutions" ON public.solutions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can manage gallery images" ON public.gallery_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can manage hero images" ON public.hero_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can manage core services" ON public.core_services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can manage page banners" ON public.page_banners FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can manage contact queries" ON public.contact_queries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can manage feedback" ON public.feedback FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can manage visitor leads" ON public.visitor_leads FOR ALL USING (auth.role() = 'authenticated');

-- ── 11. Storage Bucket ────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read for uploads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'uploads');

CREATE POLICY "Auth users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Auth users can delete uploads"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Auth users can update uploads"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');

-- ── 12. Indexes ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products (slug);
CREATE INDEX IF NOT EXISTS idx_products_published ON public.products (published);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs (slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON public.blogs (published);
CREATE INDEX IF NOT EXISTS idx_solutions_slug ON public.solutions (slug);
CREATE INDEX IF NOT EXISTS idx_solutions_published ON public.solutions (published);
CREATE INDEX IF NOT EXISTS idx_gallery_published ON public.gallery_images (published);
CREATE INDEX IF NOT EXISTS idx_gallery_location_slug ON public.gallery_images (location_slug);
CREATE INDEX IF NOT EXISTS idx_gallery_location_placement ON public.gallery_images (location_slug, placement, published, sort_order);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON public.feedback (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_leads_created ON public.visitor_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_leads_consent ON public.visitor_leads (consent_given);

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
