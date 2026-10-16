-- ====================================================================
-- INSTITUTION HUB: SUPABASE STORAGE BUCKETS & RLS POLICIES
-- Run this in the Supabase Dashboard SQL Editor
-- ====================================================================

-- 1. Create Public Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']),
  ('documents', 'documents', true, 20971520, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg']),
  ('assignments', 'assignments', true, 20971520, ARRAY['application/pdf', 'image/png', 'image/jpeg', 'application/zip'])
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Allow Public Read Access for all files in these buckets
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id IN ('avatars', 'documents', 'assignments'));

-- 3. Allow Authenticated & Anon Uploads
DROP POLICY IF EXISTS "Allow Upload Access" ON storage.objects;
CREATE POLICY "Allow Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id IN ('avatars', 'documents', 'assignments'));

-- 4. Allow Updates & Deletions
DROP POLICY IF EXISTS "Allow Update Access" ON storage.objects;
CREATE POLICY "Allow Update Access"
ON storage.objects FOR UPDATE
USING (bucket_id IN ('avatars', 'documents', 'assignments'));

DROP POLICY IF EXISTS "Allow Delete Access" ON storage.objects;
CREATE POLICY "Allow Delete Access"
ON storage.objects FOR DELETE
USING (bucket_id IN ('avatars', 'documents', 'assignments'));
