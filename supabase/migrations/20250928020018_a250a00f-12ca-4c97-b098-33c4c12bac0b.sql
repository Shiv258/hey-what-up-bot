-- Remove specific generations as requested
DELETE FROM public.video_generation_jobs 
WHERE id IN ('JOB0002', 'JOB0001', '1759016214557');