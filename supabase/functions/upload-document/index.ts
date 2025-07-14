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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid user' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const loanId = formData.get('loanId') as string;
    const documentType = formData.get('documentType') as string;

    if (!file || !loanId || !documentType) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify user owns the loan
    const { data: loan, error: loanError } = await supabase
      .from('loan_applications')
      .select('id')
      .eq('id', loanId)
      .eq('user_id', user.id)
      .single();

    if (loanError || !loan) {
      return new Response(JSON.stringify({ error: 'Loan not found or access denied' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Upload to Cloudflare R2
    const r2AccessKeyId = Deno.env.get('CLOUDFLARE_R2_ACCESS_KEY_ID');
    const r2SecretAccessKey = Deno.env.get('CLOUDFLARE_R2_SECRET_ACCESS_KEY');
    const r2BucketName = 'loan-documents'; // You'll need to create this bucket
    const r2AccountId = '1c5a671881a5edea6afc744019708638';

    if (!r2AccessKeyId || !r2SecretAccessKey) {
      return new Response(JSON.stringify({ error: 'R2 credentials not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const fileName = `${user.id}/${loanId}/${documentType}-${Date.now()}-${file.name}`;
    const fileBuffer = await file.arrayBuffer();

    // Create signed request for R2
    const r2Endpoint = `https://${r2AccountId}.r2.cloudflarestorage.com`;
    const uploadUrl = `${r2Endpoint}/${r2BucketName}/${fileName}`;

    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `AWS4-HMAC-SHA256 Credential=${r2AccessKeyId}`, // Simplified - in production use proper AWS signature
        'Content-Type': file.type,
        'Content-Length': fileBuffer.byteLength.toString(),
      },
      body: fileBuffer,
    });

    if (!uploadResponse.ok) {
      console.error('R2 upload failed:', await uploadResponse.text());
      return new Response(JSON.stringify({ error: 'File upload failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update document record in database
    const { error: updateError } = await supabase
      .from('loan_documents')
      .update({
        file_path: `${r2Endpoint}/${r2BucketName}/${fileName}`,
        status: 'uploaded',
        uploaded_at: new Date().toISOString(),
      })
      .eq('loan_id', loanId)
      .eq('document_type', documentType);

    if (updateError) {
      console.error('Database update failed:', updateError);
      return new Response(JSON.stringify({ error: 'Database update failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      fileUrl: `${r2Endpoint}/${r2BucketName}/${fileName}` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in upload-document function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});