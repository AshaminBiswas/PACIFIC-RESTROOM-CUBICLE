-- ============================================================
-- Pacific Products & Solutions — Supabase Schema
-- ============================================================

-- ── 1. Products ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  subtitle      TEXT NOT NULL DEFAULT '',
  description   TEXT NOT NULL DEFAULT '',
  category      TEXT NOT NULL DEFAULT '',
  image_url     TEXT NOT NULL DEFAULT '',
  features      JSONB NOT NULL DEFAULT '[]',
  specifications JSONB NOT NULL DEFAULT '[]',
  applications  JSONB NOT NULL DEFAULT '[]',
  is_featured   BOOLEAN NOT NULL DEFAULT false,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  published     BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 2. Blogs ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blogs (
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
CREATE TABLE IF NOT EXISTS solutions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  subtitle    TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  icon_name   TEXT NOT NULL DEFAULT 'Building2',
  image_url   TEXT NOT NULL DEFAULT '',
  features    JSONB NOT NULL DEFAULT '[]',
  clients     JSONB NOT NULL DEFAULT '[]',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  published   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 4. Gallery Images ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_images (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT '',
  image_url   TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  published   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 5. Updated-at trigger ────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER blogs_updated_at
  BEFORE UPDATE ON blogs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER solutions_updated_at
  BEFORE UPDATE ON solutions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 6. Row Level Security ────────────────────────────────────
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public can view published products" ON products FOR SELECT USING (published = true);
CREATE POLICY "Public can view published blogs" ON blogs FOR SELECT USING (published = true);
CREATE POLICY "Public can view published solutions" ON solutions FOR SELECT USING (published = true);
CREATE POLICY "Public can view published gallery images" ON gallery_images FOR SELECT USING (published = true);

-- Authenticated full access
CREATE POLICY "Auth users can manage products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can manage blogs" ON blogs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can manage solutions" ON solutions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can manage gallery images" ON gallery_images FOR ALL USING (auth.role() = 'authenticated');

-- ── 7. Storage Bucket ────────────────────────────────────────
-- Note: Buckets often need to be created via the dashboard or a separate script in some CLI versions,
-- but we include the SQL here for completeness.
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read for uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Auth users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');
CREATE POLICY "Auth users can delete uploads" ON storage.objects FOR DELETE USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');

-- ── 8. Indexes ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
CREATE INDEX IF NOT EXISTS idx_products_published ON products (published);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs (slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs (published);
CREATE INDEX IF NOT EXISTS idx_solutions_slug ON solutions (slug);
CREATE INDEX IF NOT EXISTS idx_solutions_published ON solutions (published);
CREATE INDEX IF NOT EXISTS idx_gallery_published ON gallery_images (published);
