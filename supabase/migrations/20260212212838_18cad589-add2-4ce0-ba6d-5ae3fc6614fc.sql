
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create audit_progress table
CREATE TABLE public.audit_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  current_day INTEGER NOT NULL DEFAULT 1 CHECK (current_day >= 1 AND current_day <= 7),
  day_1_started_at TIMESTAMP WITH TIME ZONE,
  day_1_completed_at TIMESTAMP WITH TIME ZONE,
  day_2_started_at TIMESTAMP WITH TIME ZONE,
  day_2_completed_at TIMESTAMP WITH TIME ZONE,
  day_3_started_at TIMESTAMP WITH TIME ZONE,
  day_3_completed_at TIMESTAMP WITH TIME ZONE,
  day_4_started_at TIMESTAMP WITH TIME ZONE,
  day_4_completed_at TIMESTAMP WITH TIME ZONE,
  day_5_started_at TIMESTAMP WITH TIME ZONE,
  day_5_completed_at TIMESTAMP WITH TIME ZONE,
  day_6_started_at TIMESTAMP WITH TIME ZONE,
  day_6_completed_at TIMESTAMP WITH TIME ZONE,
  day_7_started_at TIMESTAMP WITH TIME ZONE,
  day_7_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" ON public.audit_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.audit_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.audit_progress FOR UPDATE USING (auth.uid() = user_id);

-- Auto-create profile and audit_progress on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  
  INSERT INTO public.audit_progress (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_audit_progress_updated_at BEFORE UPDATE ON public.audit_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
