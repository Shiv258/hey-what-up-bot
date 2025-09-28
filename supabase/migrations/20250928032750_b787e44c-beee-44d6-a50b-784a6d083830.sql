-- Remove the 3 remaining generations from history
DELETE FROM public.video_generation_jobs 
WHERE id IN ('JOB0006', 'JOB0005', 'JOB0004');