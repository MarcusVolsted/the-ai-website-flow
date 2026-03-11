-- Run this in your Supabase SQL Editor AFTER the main migration
-- This adds file upload support with auto-cleanup after 10 days

-- 1. Add file tracking columns to existing table
ALTER TABLE intake_submissions
  ADD COLUMN IF NOT EXISTS uploaded_files JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS files_expire_at TIMESTAMPTZ;

-- 2. Create the storage bucket for intake files
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('intake-files', 'intake-files', false, 10485760)
ON CONFLICT (id) DO NOTHING;
-- 10485760 = 10MB max per file

-- 3. Allow service role uploads (our API routes use service role key)
CREATE POLICY "Service role upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'intake-files');

CREATE POLICY "Service role read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'intake-files');

CREATE POLICY "Service role delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'intake-files');

-- 4. Function to clean up expired files (run via pg_cron or manually)
CREATE OR REPLACE FUNCTION cleanup_expired_intake_files()
RETURNS void AS $$
DECLARE
  sub RECORD;
  file_obj JSONB;
  file_path TEXT;
BEGIN
  FOR sub IN
    SELECT id, uploaded_files
    FROM intake_submissions
    WHERE files_expire_at IS NOT NULL
      AND files_expire_at < now()
      AND uploaded_files IS NOT NULL
      AND jsonb_array_length(uploaded_files) > 0
  LOOP
    FOR file_obj IN SELECT * FROM jsonb_array_elements(sub.uploaded_files)
    LOOP
      file_path := file_obj->>'storage_path';
      IF file_path IS NOT NULL THEN
        DELETE FROM storage.objects
        WHERE bucket_id = 'intake-files'
          AND name = file_path;
      END IF;
    END LOOP;

    UPDATE intake_submissions
    SET uploaded_files = '[]', files_expire_at = NULL
    WHERE id = sub.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 5. Optional: Schedule auto-cleanup daily (requires pg_cron extension)
-- Uncomment the lines below if pg_cron is enabled on your Supabase plan:
-- SELECT cron.schedule('cleanup-intake-files', '0 3 * * *', 'SELECT cleanup_expired_intake_files()');
