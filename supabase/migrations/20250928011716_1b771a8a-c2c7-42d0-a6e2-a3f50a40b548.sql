-- Create job counter table for sequential job IDs
CREATE TABLE public.job_counters (
    id TEXT PRIMARY KEY DEFAULT 'global',
    current_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial counter
INSERT INTO public.job_counters (id, current_count) VALUES ('global', 0);

-- Enable RLS on job_counters table
ALTER TABLE public.job_counters ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read the counter (needed for job ID generation)
CREATE POLICY "Anyone can read job counters" 
ON public.job_counters 
FOR SELECT 
USING (true);

-- Create policy to allow the system to update counters
CREATE POLICY "System can update job counters" 
ON public.job_counters 
FOR UPDATE 
USING (true);

-- Create function to get next sequential job ID
CREATE OR REPLACE FUNCTION public.get_next_job_id() 
RETURNS TEXT AS $$
DECLARE
    next_count INTEGER;
    job_id TEXT;
BEGIN
    -- Atomically increment counter and get new value
    UPDATE public.job_counters 
    SET current_count = current_count + 1,
        updated_at = now()
    WHERE id = 'global' 
    RETURNING current_count INTO next_count;
    
    -- Handle case where no row was found (shouldn't happen but safety first)
    IF next_count IS NULL THEN
        -- Insert the row if it doesn't exist and set to 1
        INSERT INTO public.job_counters (id, current_count) 
        VALUES ('global', 1) 
        ON CONFLICT (id) DO UPDATE SET current_count = current_count + 1
        RETURNING current_count INTO next_count;
    END IF;
    
    -- Format as JOB0001, JOB0002, etc. with 4-digit zero padding
    job_id := 'JOB' || LPAD(next_count::TEXT, 4, '0');
    
    RETURN job_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;