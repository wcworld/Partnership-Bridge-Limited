import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { S3Client, PutObjectCommand, GetObjectCommand } from "https://esm.sh/@aws-sdk/client-s3@3";

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
    const { data: loan, error: loanError } = await userSupabase
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

    // Get R2 credentials and configuration
    const accessKeyId = Deno.env.get('CLOUDFLARE_R2_ACCESS_KEY_ID');
    const secretAccessKey = Deno.env.get('CLOUDFLARE_R2_SECRET_ACCESS_KEY');
    const bucketName = Deno.env.get('CLOUDFLARE_R2_BUCKET_NAME') || 'loan-documents';
    const accountId = Deno.env.get('CLOUDFLARE_ACCOUNT_ID');

    console.log('R2 Configuration Check:', {
      hasAccessKey: !!accessKeyId,
      hasSecretKey: !!secretAccessKey,
      bucketName,
      hasAccountId: !!accountId
    });

    // Upload file to Cloudflare R2
    const fileName = `documents/${loanId}/${documentType}-${Date.now()}-${file.name}`;
    console.log(`Uploading document: ${fileName}`);

    if (accessKeyId && secretAccessKey && accountId) {
      try {
        // Configure S3Client for Cloudflare R2
        const s3Client = new S3Client({
          region: 'auto',
          endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        });

        // Convert file to buffer
        const fileBuffer = new Uint8Array(await file.arrayBuffer());

        // Upload to R2
        const uploadCommand = new PutObjectCommand({
          Bucket: bucketName,
          Key: fileName,
          Body: fileBuffer,
          ContentType: file.type,
          CacheControl: 'max-age=3600',
        });

        await s3Client.send(uploadCommand);
        console.log('File uploaded successfully to Cloudflare R2:', fileName);

        // Update document record in database
        const { error: updateError } = await userSupabase
          .from('loan_documents')
          .update({
            status: 'processing',
            uploaded_at: new Date().toISOString(),
            file_path: fileName
          })
          .eq('loan_id', loanId)
          .eq('document_type', documentType);

        if (updateError) {
          console.error('Database update failed:', updateError);
          return new Response(JSON.stringify({ error: 'Database update failed', details: updateError }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Document uploaded successfully to Cloudflare R2',
          storage: 'Cloudflare R2',
          filePath: fileName,
          bucket: bucketName
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (r2Error) {
        console.error('R2 upload error:', r2Error);
        // Fallback to Supabase storage
        console.log('Falling back to Supabase storage...');
      }
    }

    // Fallback: Upload to Supabase storage if R2 fails or not configured
    console.log('Using Supabase storage as fallback');
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload failed:', uploadError);
      return new Response(JSON.stringify({ error: 'File upload failed', details: uploadError }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('File uploaded successfully to Supabase storage:', uploadData);

    // Update document record in database
    const { error: updateError } = await userSupabase
      .from('loan_documents')
      .update({
        status: 'processing',
        uploaded_at: new Date().toISOString(),
        file_path: fileName
      })
      .eq('loan_id', loanId)
      .eq('document_type', documentType);

    if (updateError) {
      console.error('Database update failed:', updateError);
      return new Response(JSON.stringify({ error: 'Database update failed', details: updateError }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Document uploaded successfully to Supabase Storage (R2 fallback)',
      storage: 'Supabase Storage',
      filePath: fileName
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