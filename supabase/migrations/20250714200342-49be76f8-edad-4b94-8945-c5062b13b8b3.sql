-- Add RLS policies for loan_documents to allow users to manage their documents

-- Allow users to insert documents for their own loan applications
CREATE POLICY "Users can insert documents for their loans"
ON loan_documents
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM loan_applications 
    WHERE loan_applications.id = loan_documents.loan_id 
    AND loan_applications.user_id = auth.uid()
  )
);

-- Allow users to update documents for their own loan applications
CREATE POLICY "Users can update documents for their loans"
ON loan_documents
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM loan_applications 
    WHERE loan_applications.id = loan_documents.loan_id 
    AND loan_applications.user_id = auth.uid()
  )
);

-- Allow admins to update any documents
CREATE POLICY "Admins can update all documents"
ON loan_documents
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to insert documents for any loan
CREATE POLICY "Admins can insert documents for all loans"
ON loan_documents
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));