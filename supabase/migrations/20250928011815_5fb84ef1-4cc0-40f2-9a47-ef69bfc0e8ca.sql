-- Fix search path security warning for get_next_job_id function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;