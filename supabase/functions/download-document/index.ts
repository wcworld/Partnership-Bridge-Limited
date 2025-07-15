import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    // Parse URL to get document identifiers
    const url = new URL(req.url);
    const documentId = url.searchParams.get('documentId');
    const loanId = url.searchParams.get('loanId');
    const documentType = url.searchParams.get('documentType');

    if (!documentId && (!loanId || !documentType)) {
      return new Response(JSON.stringify({ error: 'Document ID or (Loan ID and Document Type) required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get document metadata from database
    let query = userSupabase
      .from('loan_documents')
      .select('id, file_path, document_name, loan_id');

    if (documentId) {
      query = query.eq('id', documentId);
    } else {
      query = query.eq('loan_id', loanId).eq('document_type', documentType);
    }

    const { data: docData, error: docError } = await query.maybeSingle();

    if (docError) {
      console.error('Database error:', docError);
      return new Response(JSON.stringify({ error: 'Database error', details: docError }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!docData) {
      return new Response(JSON.stringify({ error: 'Document not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify user has access to this document by checking loan ownership
    const { data: loan, error: loanError } = await userSupabase
      .from('loan_applications')
      .select('id')
      .eq('id', docData.loan_id)
      .eq('user_id', user.id)
      .single();

    if (loanError || !loan) {
      return new Response(JSON.stringify({ error: 'Access denied' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!docData.file_path) {
      return new Response(JSON.stringify({ error: 'Document file not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Downloading document from Supabase storage: ${docData.file_path}`);

    // Download from Supabase storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(docData.file_path);

    if (downloadError) {
      console.error('Supabase storage download error:', downloadError);
      return new Response(JSON.stringify({ error: 'Download failed', details: downloadError }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('File downloaded successfully from Supabase storage');

    // Return the file as a downloadable response
    return new Response(fileData, {
      headers: {
        ...corsHeaders,
        'Content-Type': fileData.type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${docData.document_name || 'document'}"`,
        'Content-Length': fileData.size.toString(),
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