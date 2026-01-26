-- Create a flexible table to store dynamically detected biomarkers
CREATE TABLE public.detected_biomarkers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lab_result_id UUID NOT NULL REFERENCES public.lab_results(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT,
  reference_min NUMERIC,
  reference_max NUMERIC,
  is_normal BOOLEAN DEFAULT true,
  category TEXT, -- e.g., 'blood', 'urine', 'hormone', 'vitamin', etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.detected_biomarkers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies that reference the parent lab_results table
CREATE POLICY "Users can view biomarkers from their lab results"
ON public.detected_biomarkers
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.lab_results
    WHERE lab_results.id = detected_biomarkers.lab_result_id
    AND lab_results.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert biomarkers for their lab results"
ON public.detected_biomarkers
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.lab_results
    WHERE lab_results.id = detected_biomarkers.lab_result_id
    AND lab_results.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete biomarkers from their lab results"
ON public.detected_biomarkers
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.lab_results
    WHERE lab_results.id = detected_biomarkers.lab_result_id
    AND lab_results.user_id = auth.uid()
  )
);

-- Create index for efficient lookups
CREATE INDEX idx_detected_biomarkers_lab_result_id ON public.detected_biomarkers(lab_result_id);