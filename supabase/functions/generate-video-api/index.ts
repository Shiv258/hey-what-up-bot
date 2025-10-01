// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

declare const Deno: any;

const serve = Deno.serve || function(handler: any) { return handler; };

serve(async (req: any) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { script, character, influencer_name, content_id, callback_project_id } = await req.json();

    // Validate required fields
    if (!script) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: script' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Use character or influencer_name (both accepted)
    const characterName = character || influencer_name || 'Influencer_1';

    console.log('Received video generation request:', { 
      character: characterName, 
      content_id,
      callback_project_id 
    });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate sequential job ID
    const { data: jobIdData, error: jobIdError } = await supabase.rpc('get_next_job_id');
    
    if (jobIdError) {
      console.error('Error generating job ID:', jobIdError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate job ID' }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const jobId = jobIdData as string;
    console.log(`Generated job ID: ${jobId}`);

    // Create job record
    const { error: createError } = await supabase
      .from('video_generation_jobs')
      .insert({
        id: jobId,
        status: 'processing'
      });
    
    if (createError) {
      console.error('Error creating job:', createError);
      return new Response(
        JSON.stringify({ error: 'Failed to create job' }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Update job with metadata
    const metadata = {
      character: characterName,
      script,
      content_id: content_id || null,
      callback_project_id: callback_project_id || null
    };

    const { error: updateError } = await supabase
      .from('video_generation_jobs')
      .update({
        data: metadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);

    if (updateError) {
      console.error('Error updating job metadata:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update job metadata' }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Trigger n8n webhook for video generation
    const webhookUrl = 'https://ravan-production.up.railway.app/webhook/ravan-main';
    const webhookPayload = {
      jobId,
      character: characterName,
      script,
      inputImageUrl: null,
      webhookUrl: `https://ojffuyzursflvqojuuql.supabase.co/functions/v1/webhook-handler?jobId=${jobId}`
    };

    console.log('Triggering n8n webhook:', webhookPayload);

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload)
    });

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.error('n8n webhook error:', errorText);
      
      // Update job status to error
      await supabase
        .from('video_generation_jobs')
        .update({
          status: 'error',
          error: `Failed to trigger video generation: ${errorText}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      return new Response(
        JSON.stringify({ error: 'Failed to trigger video generation' }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Successfully triggered video generation for job ${jobId}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        job_id: jobId,
        message: 'Video generation started',
        webhook_url: `https://ojffuyzursflvqojuuql.supabase.co/functions/v1/get-job-status?jobId=${jobId}`
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in generate-video-api function:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
