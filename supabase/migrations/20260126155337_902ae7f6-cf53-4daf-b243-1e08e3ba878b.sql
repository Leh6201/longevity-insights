-- Add column for text/descriptive values (e.g., "Yellow", "Negative", "Absent")
ALTER TABLE public.detected_biomarkers 
ADD COLUMN value_text TEXT,
ADD COLUMN is_descriptive BOOLEAN DEFAULT false;

-- Make numeric value nullable since descriptive biomarkers won't have it
ALTER TABLE public.detected_biomarkers 
ALTER COLUMN value DROP NOT NULL;

COMMENT ON COLUMN public.detected_biomarkers.value_text IS 'Text value for descriptive biomarkers (e.g., Color: Yellow)';
COMMENT ON COLUMN public.detected_biomarkers.is_descriptive IS 'True if biomarker is descriptive (text) rather than numeric';