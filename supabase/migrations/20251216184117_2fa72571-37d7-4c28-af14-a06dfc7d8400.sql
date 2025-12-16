-- Create storage bucket for lab files
INSERT INTO storage.buckets (id, name, public)
VALUES ('lab-files', 'lab-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for lab-files bucket
CREATE POLICY "Users can upload their own lab files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'lab-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own lab files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'lab-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own lab files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'lab-files' AND auth.uid()::text = (storage.foldername(name))[1]);