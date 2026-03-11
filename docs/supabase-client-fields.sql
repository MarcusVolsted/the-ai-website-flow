-- Add client management and deal tracking fields
-- Run this in your Supabase SQL Editor

-- Client type: active (monthly deal) or inactive (one-time, no ongoing deal)
ALTER TABLE intake_submissions
ADD COLUMN IF NOT EXISTS client_type TEXT DEFAULT NULL;

-- Deal tracking
ALTER TABLE intake_submissions
ADD COLUMN IF NOT EXISTS deal_type TEXT DEFAULT NULL;
-- deal_type values: 'one_time', 'monthly', 'quarterly', 'yearly'

ALTER TABLE intake_submissions
ADD COLUMN IF NOT EXISTS deal_amount NUMERIC DEFAULT NULL;

ALTER TABLE intake_submissions
ADD COLUMN IF NOT EXISTS deal_recurring BOOLEAN DEFAULT FALSE;

ALTER TABLE intake_submissions
ADD COLUMN IF NOT EXISTS deal_notes TEXT DEFAULT NULL;

-- Company location
ALTER TABLE intake_submissions
ADD COLUMN IF NOT EXISTS company_location TEXT DEFAULT NULL;

-- Update any old "approved" status to "in_progress" (new flow skips "approved")
UPDATE intake_submissions SET status = 'in_progress' WHERE status = 'approved';

-- Update any old "done" status to "delivered"
UPDATE intake_submissions SET status = 'delivered' WHERE status = 'done';
