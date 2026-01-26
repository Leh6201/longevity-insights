-- Add AI-generated interpretation columns to detected_biomarkers
ALTER TABLE public.detected_biomarkers 
ADD COLUMN IF NOT EXISTS display_value text,
ADD COLUMN IF NOT EXISTS explanation text;

-- Add comment for documentation
COMMENT ON COLUMN public.detected_biomarkers.display_value IS 'AI-generated concise result for UI display (e.g., Negativo, Amarelo)';
COMMENT ON COLUMN public.detected_biomarkers.explanation IS 'AI-generated user-friendly explanation in Portuguese for tooltip';