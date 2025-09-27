import { supabase } from "@/integrations/supabase/client";

export type ResultStatus = 'processing' | 'success' | 'error';

export interface Result {
    id: string;
    status: ResultStatus;
    data?: any;
    error?: string;
    created_at: string;
    updated_at: string;
}

export async function createResult(id: string) {
    console.log(`Creating result for jobId: ${id}`);
    
    const { error } = await supabase
        .from('video_generation_jobs')
        .insert({
            id,
            status: 'processing'
        });
    
    if (error) {
        console.error('Error creating result:', error);
        throw error;
    }
}

export async function getResult(id: string): Promise<Result | null> {
    console.log(`Getting result for jobId: ${id}`);
    
    const { data, error } = await supabase
        .from('video_generation_jobs')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error && error.code !== 'PGRST116') {
        console.error('Error getting result:', error);
        throw error;
    }
    
    if (!data) {
        console.log(`Result for jobId: ${id} not found`);
        return null;
    }
    
    console.log(`Getting result for jobId: ${id}, status: ${data.status}`);
    return data as Result;
}

export async function updateResult(id: string, updates: Partial<Omit<Result, 'id'>>) {
    console.log(`Updating result for jobId: ${id} with status: ${updates.status}`);
    
    const { error } = await supabase
        .from('video_generation_jobs')
        .update(updates)
        .eq('id', id);
    
    if (error) {
        console.error('Error updating result:', error);
        throw error;
    }
}