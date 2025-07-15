-- Add identification document type to existing loans
INSERT INTO public.loan_documents (loan_id, document_type, document_name, status)
SELECT DISTINCT 
  id,
  'identification',
  'Valid Form of Identification (Passport or National ID)',
  'missing'
FROM public.loan_applications
WHERE NOT EXISTS (
  SELECT 1 FROM public.loan_documents 
  WHERE loan_id = loan_applications.id 
  AND document_type = 'identification'
);