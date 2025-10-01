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
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return new Response(
        JSON.stringify({ message: 'Error: jobId query parameter is required.' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`Processing webhook for jobId: ${jobId}`);

    const resultData = await req.json();
    
    const { error } = await supabase
      .from('video_generation_jobs')
      .update({
        status: 'success',
        data: resultData,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);

    if (error) {
      console.error('Database error updating job:', error);
      return new Response(
        JSON.stringify({ message: 'Error updating job in database.', error: error.message }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Successfully updated result for job ${jobId}`);

    // Check if this job needs a callback to another project or external SaaS
    const { data: jobData, error: fetchError } = await supabase
      .from('video_generation_jobs')
      .select('data')
      .eq('id', jobId)
      .single();

    // Handle callback_project_id (old integration)
    if (!fetchError && jobData?.data?.callback_project_id) {
      console.log(`Job ${jobId} has callback_project_id, sending callback...`);
      
      try {
        const callbackUrl = `https://${jobData.data.callback_project_id}.supabase.co/functions/v1/video-generation-callback`;
        const callbackPayload = {
          content_id: jobData.data.content_id,
          status: 'success',
          video_url: resultData.videoUrl || resultData.video_url || null,
          job_id: jobId,
          result_data: resultData
        };

        console.log('Sending callback to:', callbackUrl, callbackPayload);

        const callbackResponse = await fetch(callbackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(callbackPayload)
        });

        if (!callbackResponse.ok) {
          console.error('Callback failed:', await callbackResponse.text());
        } else {
          console.log('Callback sent successfully');
        }
      } catch (callbackError) {
        console.error('Error sending callback:', callbackError);
      }
    }

    // Handle content_id from metadata (new URL parameter integration)
    if (!fetchError && jobData?.data?.metadata?.content_id) {
      console.log(`Job ${jobId} has content_id in metadata, sending callback to external SaaS...`);
      
      try {
        const callbackUrl = 'https://vkfmtrovrxgalhekzfsu.supabase.co/functions/v1/video-generation-callback';
        const callbackPayload = {
          content_id: jobData.data.metadata.content_id,
          job_id: jobData.data.metadata.external_job_id || jobId,
          status: 'success',
          video_url: resultData.videoUrl || resultData.video_url || null
        };

        console.log('Sending callback to external SaaS:', callbackUrl, callbackPayload);

        const callbackResponse = await fetch(callbackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(callbackPayload)
        });

        if (!callbackResponse.ok) {
          console.error('External callback failed:', await callbackResponse.text());
        } else {
          console.log('External callback sent successfully');
        }
      } catch (callbackError) {
        console.error('Error sending external callback:', callbackError);
      }
    }

    return new Response(
      JSON.stringify({ message: `Successfully updated result for job ${jobId}` }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in webhook-handler function:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');
    
    if (jobId) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      // Update local job status to error
      await supabase
        .from('video_generation_jobs')
        .update({
          status: 'error',
          error: `Webhook processing failed: ${errorMessage}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      // Check if we need to send failure callback to external SaaS
      const { data: jobData } = await supabase
        .from('video_generation_jobs')
        .select('data')
        .eq('id', jobId)
        .single();

      if (jobData?.data?.metadata?.content_id) {
        try {
          await fetch('https://vkfmtrovrxgalhekzfsu.supabase.co/functions/v1/video-generation-callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content_id: jobData.data.metadata.content_id,
              job_id: jobData.data.metadata.external_job_id || jobId,
              status: 'failed'
            })
          });
        } catch (callbackError) {
          console.error('Failed to send error callback:', callbackError);
        }
      }
    }

    return new Response(
      JSON.stringify({ message: 'Error processing webhook data.', error: errorMessage }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});