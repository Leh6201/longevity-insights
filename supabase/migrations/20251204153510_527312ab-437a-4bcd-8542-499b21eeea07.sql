-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  language TEXT DEFAULT 'en',
  theme TEXT DEFAULT 'dark',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create onboarding data table
CREATE TABLE public.onboarding_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  age INTEGER,
  biological_sex TEXT,
  weight DECIMAL,
  height DECIMAL,
  training_frequency TEXT,
  sleep_quality TEXT,
  alcohol_consumption TEXT,
  daily_water_intake DECIMAL,
  mental_health_level INTEGER,
  health_goals TEXT[],
  current_medications TEXT,
  medical_history TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create lab results table
CREATE TABLE public.lab_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url TEXT,
  file_name TEXT,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  total_cholesterol DECIMAL,
  hdl DECIMAL,
  ldl DECIMAL,
  triglycerides DECIMAL,
  glucose DECIMAL,
  hemoglobin DECIMAL,
  creatinine DECIMAL,
  ast DECIMAL,
  alt DECIMAL,
  ggt DECIMAL,
  vitamin_d DECIMAL,
  tsh DECIMAL,
  crp DECIMAL,
  biological_age INTEGER,
  metabolic_risk_score TEXT,
  inflammation_score TEXT,
  ai_recommendations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for onboarding_data
CREATE POLICY "Users can view own onboarding" ON public.onboarding_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own onboarding" ON public.onboarding_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own onboarding" ON public.onboarding_data FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for lab_results
CREATE POLICY "Users can view own lab results" ON public.lab_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lab results" ON public.lab_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lab results" ON public.lab_results FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own lab results" ON public.lab_results FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'name', NEW.email);
  
  INSERT INTO public.onboarding_data (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for lab files
INSERT INTO storage.buckets (id, name, public) VALUES ('lab-files', 'lab-files', false);

-- Storage policies
CREATE POLICY "Users can upload own lab files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'lab-files' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view own lab files" ON storage.objects FOR SELECT USING (bucket_id = 'lab-files' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own lab files" ON storage.objects FOR DELETE USING (bucket_id = 'lab-files' AND auth.uid()::text = (storage.foldername(name))[1]);