-- Run this in your Supabase SQL Editor
-- https://ouhahcmycuneethzjtqc.supabase.co

-- 1. Drop the old table
DROP TABLE IF EXISTS intake_submissions;

-- 2. Drop the old trigger function if it exists
DROP FUNCTION IF EXISTS update_updated_at();

-- 3. Create the new table for AI conversation-based intake
CREATE TABLE intake_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Structured data (extracted by AI from conversation)
  full_name TEXT,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  business_description TEXT,
  site_type TEXT,
  page_count INTEGER,
  page_descriptions TEXT,
  primary_goal TEXT,
  features TEXT[] DEFAULT '{}',
  target_audience TEXT,
  current_website_url TEXT,
  inspiration_urls TEXT[] DEFAULT '{}',
  style_preference TEXT,
  brand_colors TEXT[] DEFAULT '{}',
  has_logo BOOLEAN DEFAULT false,
  tone_of_voice TEXT,
  tagline TEXT,
  preferred_cta TEXT,
  deadline TEXT,
  additional_notes TEXT,

  -- Raw conversation
  conversation JSONB NOT NULL DEFAULT '[]',

  -- AI-generated outputs
  project_summary TEXT,
  claude_prompt TEXT,

  -- Workflow
  status TEXT DEFAULT 'submitted',
  preview_url TEXT,
  stripe_payment_id TEXT,
  notes JSONB DEFAULT '{}'
);

-- 4. Indexes
CREATE INDEX idx_intake_email ON intake_submissions(email);
CREATE INDEX idx_intake_status ON intake_submissions(status);

-- 5. Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER intake_updated_at
  BEFORE UPDATE ON intake_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 6. RLS
ALTER TABLE intake_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access"
  ON intake_submissions
  FOR ALL
  USING (true)
  WITH CHECK (true);
