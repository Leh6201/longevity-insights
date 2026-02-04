-- Make lab-files bucket private to protect sensitive medical data
UPDATE storage.buckets 
SET public = false 
WHERE id = 'lab-files';