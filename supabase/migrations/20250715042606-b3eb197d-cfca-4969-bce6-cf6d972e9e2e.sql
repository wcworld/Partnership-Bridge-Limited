-- Update existing loan documents to match new requirements
-- First, let's see what we have and update accordingly

-- Add new document types for existing loans
INSERT INTO loan_documents (loan_id, document_name, document_type, status)
SELECT DISTINCT 
    ld.loan_id,
    'Company Registration/Incorporation Documents',
    'company_registration',
    'missing'
FROM loan_documents ld
WHERE NOT EXISTS (
    SELECT 1 FROM loan_documents ld2 
    WHERE ld2.loan_id = ld.loan_id 
    AND ld2.document_type = 'company_registration'
);

INSERT INTO loan_documents (loan_id, document_name, document_type, status)
SELECT DISTINCT 
    ld.loan_id,
    'Proof of Business Address',
    'business_address',
    'missing'
FROM loan_documents ld
WHERE NOT EXISTS (
    SELECT 1 FROM loan_documents ld2 
    WHERE ld2.loan_id = ld.loan_id 
    AND ld2.document_type = 'business_address'
);

INSERT INTO loan_documents (loan_id, document_name, document_type, status)
SELECT DISTINCT 
    ld.loan_id,
    'Detailed Business Services and Business Plan',
    'business_plan',
    'missing'
FROM loan_documents ld
WHERE NOT EXISTS (
    SELECT 1 FROM loan_documents ld2 
    WHERE ld2.loan_id = ld.loan_id 
    AND ld2.document_type = 'business_plan'
);

INSERT INTO loan_documents (loan_id, document_name, document_type, status)
SELECT DISTINCT 
    ld.loan_id,
    'Detailed Use of Funds Breakdown',
    'use_of_funds',
    'missing'
FROM loan_documents ld
WHERE NOT EXISTS (
    SELECT 1 FROM loan_documents ld2 
    WHERE ld2.loan_id = ld.loan_id 
    AND ld2.document_type = 'use_of_funds'
);

INSERT INTO loan_documents (loan_id, document_name, document_type, status)
SELECT DISTINCT 
    ld.loan_id,
    '3-Year Financial Projections',
    'financial_projections',
    'missing'
FROM loan_documents ld
WHERE NOT EXISTS (
    SELECT 1 FROM loan_documents ld2 
    WHERE ld2.loan_id = ld.loan_id 
    AND ld2.document_type = 'financial_projections'
);

INSERT INTO loan_documents (loan_id, document_name, document_type, status)
SELECT DISTINCT 
    ld.loan_id,
    'Relevant Business Licenses or Permits',
    'business_licenses',
    'missing'
FROM loan_documents ld
WHERE NOT EXISTS (
    SELECT 1 FROM loan_documents ld2 
    WHERE ld2.loan_id = ld.loan_id 
    AND ld2.document_type = 'business_licenses'
);

-- Remove old document types that are no longer needed
DELETE FROM loan_documents 
WHERE document_type IN ('bank_statement', 'tax_return', 'pay_stub', 'financial_statement');