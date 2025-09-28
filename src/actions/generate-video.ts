import { z } from "zod";
import { CharacterSchema } from "@/ai/schemas/character";
import { createResult } from "@/lib/supabase-store";
import { supabase } from "@/integrations/supabase/client";

// This defines the expected input from the form.
const inputSchema = z.object({
  character: CharacterSchema.nullable(),
  script: z.string(),
  inputImageUrl: z.string().nullable(),
});

export type GenerateVideoInput = z.infer<typeof inputSchema>;
export type GenerateVideoOutput = {
    error?: string;
    jobId?: string;
}

/**
 * Triggers the n8n webhook with character and script data,
 * then returns the job ID for polling.
 */
export async function generateVideo(input: GenerateVideoInput): Promise<GenerateVideoOutput> {
  const validatedInput = inputSchema.safeParse(input);
  if (!validatedInput.success) {
    return { error: `Invalid input: ${validatedInput.error.message}` };
  }

  // 1. Generate a sequential job ID using the database function.
  const { data: jobIdResult, error: jobIdError } = await supabase.rpc('get_next_job_id');
  
  if (jobIdError || !jobIdResult) {
    console.error('Error generating job ID:', jobIdError);
    return { error: 'Failed to generate job ID' };
  }
  
  const jobId = jobIdResult;

  try {
    // 2. Create a "processing" record in our store.
    await createResult(jobId);

    const webhookUrl = "https://n8n.srv905291.hstgr.cloud/webhook/e88fd9ee-b07d-4ee7-8621-90ce2253a7b4";
    const params = new URLSearchParams();
    
    // 3. Pass the jobId to the webhook so it can send it back later - updated to use Supabase webhook
    params.append("jobId", jobId);
    params.append("webhookUrl", "https://ojffuyzursflvqojuuql.supabase.co/functions/v1/webhook-handler");

    // If an image is uploaded, we fall back to 'Kaira' to ensure the URL is not too long.
    // Otherwise, we use the selected character.
    if (validatedInput.data.inputImageUrl) {
        params.append("character", "Kaira");
        params.append("imageUrl", validatedInput.data.inputImageUrl);
    } else if (validatedInput.data.character) {
      params.append("character", validatedInput.data.character);
    }

    if (validatedInput.data.script) {
      params.append("script", validatedInput.data.script);
    }
    
    const finalUrl = `${webhookUrl}?${params.toString()}`;
    
    // 4. Trigger the webhook but DO NOT wait for the response (fire-and-forget).
    fetch(finalUrl, {
      method: 'GET',
    }).catch(e => {
        // Log the error on the client if the trigger fails, but don't block the user.
        console.error(`Failed to trigger webhook for job ${jobId}:`, e);
    });

    return { jobId };

  } catch (error) {
    console.error("Error in generateVideo action:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    return { error: message };
  }
}
