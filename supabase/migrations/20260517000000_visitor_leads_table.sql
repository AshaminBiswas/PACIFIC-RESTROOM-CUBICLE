-- ============================================================
-- Visitor Leads — Table, RLS Policies & Indexes
-- Run this in the Supabase SQL Editor to fix delete functionality
-- ============================================================

-- ── Create the table (if it doesn't exist) ──────────────────
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

-- ── Enable Row Level Security ───────────────────────────────
ALTER TABLE public.visitor_leads ENABLE ROW LEVEL SECURITY;

-- ── Drop existing policies (safe if they don't exist) ───────
DROP POLICY IF EXISTS "Allow public insert visitor leads" ON public.visitor_leads;
DROP POLICY IF EXISTS "Auth users can read visitor leads" ON public.visitor_leads;
DROP POLICY IF EXISTS "Auth users can delete visitor leads" ON public.visitor_leads;
DROP POLICY IF EXISTS "Auth users can manage visitor leads" ON public.visitor_leads;

-- ── Public INSERT policy (cookie consent inserts from anon) ─
CREATE POLICY "Allow public insert visitor leads"
  ON public.visitor_leads
  FOR INSERT
  WITH CHECK (true);

-- ── Authenticated full access (Admin: read, update, delete) ─
CREATE POLICY "Auth users can manage visitor leads"
  ON public.visitor_leads
  FOR ALL
  USING (auth.role() = 'authenticated');

-- ── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_visitor_leads_created
  ON public.visitor_leads (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_visitor_leads_consent
  ON public.visitor_leads (consent_given);

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
