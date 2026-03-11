# Supabase Setup Guide (A-Z)

This guide walks you through setting up Supabase for the WaaS intake system — database for form submissions + storage for logo uploads.

---

## Step 1: Create a Supabase Account & Project

1. Go to **https://supabase.com** and sign up (GitHub login is fastest)
2. Click **"New Project"**
3. Fill in:
   - **Name:** `waas-intake` (or whatever you prefer)
   - **Database Password:** Generate a strong one and save it somewhere secure (you won't need it often, but keep it)
   - **Region:** Pick the one closest to your target clients (e.g., `West EU (Ireland)` for European clients, `East US (Virginia)` for US)
4. Click **"Create new project"** — takes ~2 minutes to provision

---

## Step 2: Get Your API Keys

Once the project is ready:

1. Go to **Settings** (gear icon in sidebar) > **API**
2. You'll see three values you need:

| Key | Where to find it | What it's for |
|-----|------------------|---------------|
| **Project URL** | Under "Project URL" | `NEXT_PUBLIC_SUPABASE_URL` in your .env.local |
| **anon/public key** | Under "Project API keys" > `anon` `public` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your .env.local |
| **service_role key** | Under "Project API keys" > `service_role` `secret` | `SUPABASE_SERVICE_ROLE_KEY` in your .env.local |

3. Copy all three into your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

**IMPORTANT:** The `service_role` key has full admin access. Never expose it in client-side code. It's only used in server actions.

---

## Step 3: Create the Database Table

1. Go to **SQL Editor** (in the left sidebar — looks like a terminal icon)
2. Click **"New query"**
3. Paste this SQL and click **"Run"**:

```sql
-- Create the intake submissions table
CREATE TABLE intake_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Step 1: Welcome
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,

  -- Step 2: Vibe Check
  current_website_url TEXT,
  brand_colors TEXT[] DEFAULT '{}',
  let_us_choose_colors BOOLEAN DEFAULT false,
  logo_url TEXT,
  no_logo BOOLEAN DEFAULT false,

  -- Step 3: Vision & Routing
  primary_goal TEXT NOT NULL,
  chosen_path TEXT NOT NULL CHECK (chosen_path IN ('build_preview', 'book_call')),

  -- Workflow tracking (Phase 2)
  status TEXT DEFAULT 'submitted' CHECK (status IN (
    'submitted',
    'in_review',
    'generating',
    'preview_ready',
    'offer_sent',
    'paid',
    'in_progress',
    'delivered'
  )),
  preview_url TEXT,
  offer_url TEXT,
  stripe_payment_id TEXT,
  cal_booking_id TEXT,
  notes JSONB DEFAULT '{}'
);

-- Index for quick lookups by email
CREATE INDEX idx_intake_email ON intake_submissions(email);

-- Index for filtering by status
CREATE INDEX idx_intake_status ON intake_submissions(status);

-- Auto-update the updated_at timestamp
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
```

4. You should see "Success. No rows returned" — that means it worked
5. Verify by going to **Table Editor** in the sidebar — you should see `intake_submissions` listed

---

## Step 4: Set Up Row Level Security (RLS)

RLS controls who can read/write data. Since our form submissions come from unauthenticated users but are processed by your server actions, we need a specific setup.

1. Go to **SQL Editor** > **New query**
2. Paste and run:

```sql
-- Enable RLS on the table
ALTER TABLE intake_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for form submissions via server action)
-- The server action uses the service_role key which bypasses RLS,
-- but this policy is a safety net for the anon key
CREATE POLICY "Allow anonymous inserts"
  ON intake_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only service_role can read/update/delete (your server-side code)
-- No policy needed — service_role bypasses RLS by default
```

**Why this works:** Your server actions use the `service_role` key which bypasses RLS entirely. The anon insert policy is just a fallback. Clients can never read other submissions.

---

## Step 5: Create the Logo Storage Bucket

1. Go to **Storage** in the left sidebar
2. Click **"New bucket"**
3. Fill in:
   - **Name:** `logos`
   - **Public bucket:** Toggle **ON** (logos need to be publicly readable so we can display them)
   - **File size limit:** `10MB` (matches our frontend validation)
   - **Allowed MIME types:** `image/svg+xml, image/png, image/jpeg`
4. Click **"Create bucket"**

Now set up the storage policy:

5. Click on the `logos` bucket
6. Click **"Policies"** tab
7. Click **"New policy"** > **"For full customization"**
8. Create this policy:

**Policy 1 — Public read access:**
- Name: `Public read logos`
- Allowed operation: `SELECT`
- Target roles: `anon, authenticated`
- Policy: `true`

**Policy 2 — Server upload only:**
- Name: `Server upload logos`
- Allowed operation: `INSERT`
- Target roles: `service_role`
- Policy: `true`

Or run this SQL instead (easier):

```sql
-- Public read access for logos
CREATE POLICY "Public read logos"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'logos');

-- Only server can upload logos
CREATE POLICY "Server upload logos"
  ON storage.objects
  FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'logos');
```

---

## Step 6: Verify Everything Works

### Check the table:
1. Go to **Table Editor** > `intake_submissions`
2. You should see all columns listed with correct types
3. Try inserting a test row manually (click "Insert row") with:
   - full_name: "Test User"
   - email: "test@test.com"
   - company_name: "Test Co"
   - primary_goal: "Testing the setup"
   - chosen_path: "build_preview"
4. If it saves, your table is working

### Check storage:
1. Go to **Storage** > `logos`
2. Try uploading any small image via the UI
3. Click on it — you should be able to view it via the public URL

### Check API keys:
1. Make sure all three values are in your `.env.local`
2. Restart your dev server (`npm run dev`)
3. The app should start without errors

---

## Step 7: What Happens Next (Automated by Code)

Once you paste the three env values, the app will automatically:

1. **On form submit:** Save the full submission to `intake_submissions` table
2. **On logo upload:** Upload the file to the `logos` bucket, store the public URL in the submission
3. **Status tracking:** Each submission starts as `submitted` — you can update status from the Supabase dashboard or via future admin tools

### Supabase Dashboard as Your Admin Panel (For Now)

Until we build a proper admin dashboard, you can manage everything from the Supabase dashboard:

- **View submissions:** Table Editor > `intake_submissions`
- **Update status:** Click any row, change the `status` field
- **Filter by status:** Use the filter icon to show only `submitted` or `preview_ready` entries
- **View logos:** Storage > `logos`
- **Quick stats:** SQL Editor > `SELECT status, count(*) FROM intake_submissions GROUP BY status`

---

## Quick Reference

| What | Where |
|------|-------|
| Dashboard | https://supabase.com/dashboard |
| Table Editor | Sidebar > Table Editor > intake_submissions |
| Storage | Sidebar > Storage > logos |
| SQL Editor | Sidebar > SQL Editor |
| API Docs | Sidebar > API Docs (auto-generated for your table) |
| Logs | Sidebar > Logs (see real-time API calls) |

---

## Troubleshooting

**"Permission denied" on insert:**
- Check that RLS is enabled and the anon insert policy exists
- Or verify your server action is using the `service_role` key (not the anon key)

**"Bucket not found" on logo upload:**
- Make sure the bucket is named exactly `logos` (lowercase)
- Check the storage policies allow service_role inserts

**Slow queries:**
- The indexes we created (on email and status) handle the most common lookups
- For thousands of submissions, this setup scales fine

**Need to reset:**
- SQL Editor > `TRUNCATE intake_submissions;` clears all data
- Storage > select all files > delete to clear logos
