import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

export interface GenerationData {
  id: string;
  character: string;
  script: string;
  thumbnail: string;
  timeAgo: string;
  status: 'processing' | 'success' | 'error';
  createdAt: string;
  hasResults: boolean;
}

export async function getAllGenerations(): Promise<GenerationData[]> {
  const { data: jobs, error } = await supabase
    .from('video_generation_jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching generations:', error);
    return [];
  }

  return jobs.map(job => {
    const data = job.data as any;
    const metadata = data?.metadata || {};
    const results = data?.results || data;
    
    // Get thumbnail from results
    let thumbnail = 'https://placehold.co/180x320.png';
    if (results && job.status === 'success') {
      if (results.lipsync_images && results.lipsync_images.length > 0) {
        thumbnail = results.lipsync_images[0];
      } else if (results.lipsync_videos && results.lipsync_videos.length > 0) {
        // For videos, we'll use the placeholder for now
        thumbnail = 'https://placehold.co/180x320.png';
      }
    }

    return {
      id: job.id,
      character: metadata.character || 'Unknown',
      script: metadata.script || '',
      thumbnail,
      timeAgo: formatDistanceToNow(new Date(job.created_at), { addSuffix: true }),
      status: job.status as 'processing' | 'success' | 'error',
      createdAt: job.created_at,
      hasResults: Boolean(results && (results.lipsync_videos?.length || results.lipsync_images?.length))
    };
  });
}

export async function getRecentGenerations(limit: number = 6): Promise<GenerationData[]> {
  const allGenerations = await getAllGenerations();
  return allGenerations.slice(0, limit);
}