
CREATE TABLE public.daily_forecasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  forecast_date DATE NOT NULL DEFAULT CURRENT_DATE,
  emotion TEXT,
  energy TEXT,
  intention TEXT,
  guide TEXT,
  forecast_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, forecast_date)
);

ALTER TABLE public.daily_forecasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own forecasts"
ON public.daily_forecasts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own forecasts"
ON public.daily_forecasts
FOR INSERT
WITH CHECK (auth.uid() = user_id);
