-- Create documents storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false);

-- Create storage policies for documents
CREATE POLICY "Users can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] IN (
    SELECT loan_id::text 
    FROM loan_applications 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'documents' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can upload documents for their loans" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] IN (
    SELECT loan_id::text 
    FROM loan_applications 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can upload documents for all loans" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'documents' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update documents for their loans" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] IN (
    SELECT loan_id::text 
    FROM loan_applications 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can update all documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'documents' AND has_role(auth.uid(), 'admin'::app_role));