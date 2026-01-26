import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DetectedBiomarker {
  id: string;
  lab_result_id: string;
  name: string;
  value: number;
  unit: string | null;
  reference_min: number | null;
  reference_max: number | null;
  is_normal: boolean;
  category: string | null;
  created_at: string;
}

export const useDynamicBiomarkers = (labResultId: string | null) => {
  const [biomarkers, setBiomarkers] = useState<DetectedBiomarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBiomarkers = async () => {
      if (!labResultId) {
        setBiomarkers([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('detected_biomarkers')
          .select('*')
          .eq('lab_result_id', labResultId)
          .order('category', { ascending: true })
          .order('name', { ascending: true });

        if (fetchError) {
          throw fetchError;
        }

        setBiomarkers(data || []);
      } catch (err) {
        console.error('Error fetching biomarkers:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch biomarkers');
        setBiomarkers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBiomarkers();
  }, [labResultId]);

  return { biomarkers, loading, error };
};

// Helper function to calculate percentage for display
export const calculateBiomarkerPercentage = (
  value: number,
  referenceMin: number | null,
  referenceMax: number | null
): number => {
  if (referenceMin === null || referenceMax === null) {
    // If no reference range, return 50% as neutral
    return 50;
  }
  
  const range = referenceMax - referenceMin;
  if (range <= 0) return 50;
  
  // Calculate how far the value is within the reference range
  // 100% = at min (good), 0% = at max (concerning for most markers)
  const percentage = Math.min(100, Math.max(0, ((referenceMax - value) / range) * 100));
  return Math.round(percentage);
};

// Group biomarkers by category
export const groupBiomarkersByCategory = (biomarkers: DetectedBiomarker[]): Record<string, DetectedBiomarker[]> => {
  return biomarkers.reduce((acc, biomarker) => {
    const category = biomarker.category || 'geral';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(biomarker);
    return acc;
  }, {} as Record<string, DetectedBiomarker[]>);
};

// Get category display name in Portuguese
export const getCategoryDisplayName = (category: string): string => {
  const categoryNames: Record<string, string> = {
    sangue: 'Exame de Sangue',
    urina: 'Exame de Urina',
    fezes: 'Exame de Fezes',
    hormonio: 'Hormônios',
    vitamina: 'Vitaminas',
    mineral: 'Minerais',
    enzima: 'Enzimas',
    lipidio: 'Lipídios',
    geral: 'Outros',
  };
  return categoryNames[category.toLowerCase()] || category;
};
