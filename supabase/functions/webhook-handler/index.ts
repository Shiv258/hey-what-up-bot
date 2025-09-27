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
      
      await supabase
        .from('video_generation_jobs')
        .update({
          status: 'error',
          error: `Webhook processing failed: ${errorMessage}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);
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