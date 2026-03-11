-- Add new intake fields (language, fonts, contact info, images)
-- Run this in your Supabase SQL Editor

ALTER TABLE intake_submissions
  ADD COLUMN IF NOT EXISTS is_new_site BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS website_language TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS font_preferences TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS contact_info_for_site TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS has_images BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS image_details TEXT DEFAULT NULL;
