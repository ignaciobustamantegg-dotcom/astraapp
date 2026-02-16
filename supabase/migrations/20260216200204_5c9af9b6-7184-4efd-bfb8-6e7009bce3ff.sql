
-- Add rating columns to audit_progress
ALTER TABLE public.audit_progress
  ADD COLUMN IF NOT EXISTS day_1_rating smallint,
  ADD COLUMN IF NOT EXISTS day_2_rating smallint,
  ADD COLUMN IF NOT EXISTS day_3_rating smallint,
  ADD COLUMN IF NOT EXISTS day_4_rating smallint,
  ADD COLUMN IF NOT EXISTS day_5_rating smallint,
  ADD COLUMN IF NOT EXISTS day_6_rating smallint,
  ADD COLUMN IF NOT EXISTS day_7_rating smallint;

-- Create journal_entries table
CREATE TABLE public.journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  day_number smallint NOT NULL CHECK (day_number BETWEEN 1 AND 7),
  content text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, day_number)
);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own journal"
  ON public.journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal"
  ON public.journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal"
  ON public.journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
