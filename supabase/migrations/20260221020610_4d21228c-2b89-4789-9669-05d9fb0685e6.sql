
-- Add user_id to quiz_submissions
ALTER TABLE public.quiz_submissions ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX idx_quiz_submissions_user_id ON quiz_submissions(user_id);

-- Allow authenticated users to read their own submissions
CREATE POLICY "Users can read own quiz submissions"
ON public.quiz_submissions
FOR SELECT
USING (auth.uid() = user_id);

-- Allow authenticated users to update user_id on their submissions (for linking)
CREATE POLICY "Users can link own quiz submissions"
ON public.quiz_submissions
FOR UPDATE
USING (session_id IS NOT NULL)
WITH CHECK (auth.uid() = user_id);
