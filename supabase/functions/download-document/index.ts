import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { S3Client, GetObjectCommand } from "https://esm.sh/@aws-sdk/client-s3@3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create client with user token for RLS
    const userSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const { data: { user }, error: authError } = await userSupabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid user' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const documentId = url.searchParams.get('documentId');
    const loanId = url.searchParams.get('loanId');
    const documentType = url.searchParams.get('documentType');

    if (!documentId && (!loanId || !documentType)) {
      return new Response(JSON.stringify({ error: 'Missing document identifier' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get document from database
    let documentQuery = userSupabase.from('loan_documents').select('*');
    
    if (documentId) {
      documentQuery = documentQuery.eq('id', documentId);
    } else {
      documentQuery = documentQuery.eq('loan_id', loanId).eq('document_type', documentType);
    }

    const { data: document, error: docError } = await documentQuery.single();

    if (docError || !document) {
      return new Response(JSON.stringify({ error: 'Document not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify user owns the loan
    const { data: loan, error: loanError } = await userSupabase
      .from('loan_applications')
      .select('user_id')
      .eq('id', document.loan_id)
      .single();

    if (loanError || !loan || loan.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Access denied' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get R2 credentials
    const accessKeyId = Deno.env.get('CLOUDFLARE_R2_ACCESS_KEY_ID');
    const secretAccessKey = Deno.env.get('CLOUDFLARE_R2_SECRET_ACCESS_KEY');
    const bucketName = Deno.env.get('CLOUDFLARE_R2_BUCKET_NAME') || 'loan-documents';
    const accountId = Deno.env.get('CLOUDFLARE_ACCOUNT_ID');

    // Try to download from Cloudflare R2 first
    if (accessKeyId && secretAccessKey && accountId) {
      try {
        const s3Client = new S3Client({
          region: 'auto',
          endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        });

        const command = new GetObjectCommand({
          Bucket: bucketName,
          Key: document.file_path,
        });

        const response = await s3Client.send(command);
        
        if (response.Body) {
          const bytes = await response.Body.transformToByteArray();
          
          return new Response(bytes, {
            headers: {
              ...corsHeaders,
              'Content-Type': response.ContentType || 'application/octet-stream',
              'Content-Disposition': `attachment; filename="${document.document_name}"`,
              'Content-Length': bytes.length.toString(),
            },
          });
        }
      } catch (r2Error) {
        console.error('R2 download error:', r2Error);
        console.log('Falling back to Supabase storage...');
      }
    }

    // Fallback to Supabase storage
    const { data, error } = await supabase.storage
      .from('documents')
      .download(document.file_path);

    if (error) {
      return new Response(JSON.stringify({ error: 'Download failed', details: error }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const bytes = new Uint8Array(await data.arrayBuffer());
    
    return new Response(bytes, {
      headers: {
        ...corsHeaders,
        'Content-Type': data.type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${document.document_name}"`,
        'Content-Length': bytes.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error in download-document function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});