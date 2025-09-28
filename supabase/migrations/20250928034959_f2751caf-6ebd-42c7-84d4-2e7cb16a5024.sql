-- Remove the remaining two generations from the database
DELETE FROM video_generation_jobs WHERE id IN ('JOB0007', 'JOB0003');