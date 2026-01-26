import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DetectedBiomarker {
  id: string;
  lab_result_id: string;
  name: string;
  value: number | null;
  value_text: string | null;
  is_descriptive: boolean;
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

        // Map database results to our interface, handling the new columns
        const mappedData: DetectedBiomarker[] = (data || []).map((item: Record<string, unknown>) => ({
          id: item.id as string,
          lab_result_id: item.lab_result_id as string,
          name: item.name as string,
          value: item.value as number | null,
          value_text: (item.value_text as string | null) || null,
          is_descriptive: (item.is_descriptive as boolean) || false,
          unit: item.unit as string | null,
          reference_min: item.reference_min as number | null,
          reference_max: item.reference_max as number | null,
          is_normal: (item.is_normal as boolean) ?? true,
          category: item.category as string | null,
          created_at: item.created_at as string,
        }));

        setBiomarkers(mappedData);
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

// Helper function to calculate percentage for numeric biomarkers
export const calculateBiomarkerPercentage = (
  value: number | null,
  referenceMin: number | null,
  referenceMax: number | null
): number => {
  if (value === null || referenceMin === null || referenceMax === null) {
    return 50;
  }
  
  const range = referenceMax - referenceMin;
  if (range <= 0) return 50;
  
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

// Check if biomarker is descriptive (text value)
export const isDescriptiveBiomarker = (biomarker: DetectedBiomarker): boolean => {
  return biomarker.is_descriptive === true || (biomarker.value === null && biomarker.value_text !== null);
};

// Get display value for a biomarker
export const getBiomarkerDisplayValue = (biomarker: DetectedBiomarker): string => {
  if (isDescriptiveBiomarker(biomarker)) {
    return biomarker.value_text || '-';
  }
  const value = biomarker.value?.toString() || '-';
  return biomarker.unit ? `${value} ${biomarker.unit}` : value;
};
