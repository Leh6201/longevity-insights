-- Add missing UPDATE policy for detected_biomarkers table
-- This allows users to update biomarkers only if they own the parent lab result

CREATE POLICY "Users can update biomarkers from their lab results"
ON public.detected_biomarkers
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.lab_results
    WHERE lab_results.id = detected_biomarkers.lab_result_id
    AND lab_results.user_id = auth.uid()
  )
);