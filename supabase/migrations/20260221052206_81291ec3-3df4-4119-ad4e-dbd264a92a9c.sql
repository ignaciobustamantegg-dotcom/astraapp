
-- Create storage bucket for pre-generated guided reading audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('guided-readings-audio', 'guided-readings-audio', true);

-- Allow public read access (anyone can play audio)
CREATE POLICY "Public read access for guided reading audio"
ON storage.objects
FOR SELECT
USING (bucket_id = 'guided-readings-audio');

-- Allow service role to upload audio files (used by edge function)
CREATE POLICY "Service role can upload guided reading audio"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'guided-readings-audio');
