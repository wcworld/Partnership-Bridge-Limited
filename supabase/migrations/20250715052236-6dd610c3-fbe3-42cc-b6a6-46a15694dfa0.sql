-- Make documents bucket public so files can be accessed via public URLs
UPDATE storage.buckets 
SET public = true 
WHERE id = 'documents';

-- Update storage policies to allow public access for reading
DROP POLICY IF EXISTS "Users can view their documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all documents" ON storage.objects;

-- Create new policies for public access to documents bucket
CREATE POLICY "Public access to documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');