import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGuest } from '@/contexts/GuestContext';
import { supabase } from '@/integrations/supabase/client';

export interface RequiredBiomarker {
  key: string;
  label: string;
  description: string; // user-friendly tooltip
  aliases: string[]; // all name variants the AI might produce
  present: boolean;
}

const REQUIRED_BIOMARKERS: Omit<RequiredBiomarker, 'present'>[] = [
  {
    key: 'glucose',
    label: 'Glicose em Jejum',
    description:
      'Mede o nível de açúcar no sangue em jejum. Ajuda a detectar pré-diabetes e diabetes.',
    aliases: ['glicose', 'glucose', 'glicose em jejum', 'glucose fasting', 'fasting glucose'],
  },
  {
    key: 'ldl',
    label: 'Colesterol LDL',
    description:
      'Conhecido como "colesterol ruim". Níveis altos aumentam o risco de doenças cardiovasculares.',
    aliases: ['ldl', 'colesterol ldl', 'ldl colesterol', 'ldl-c', 'ldl cholesterol'],
  },
  {
    key: 'hdl',
    label: 'Colesterol HDL',
    description:
      'Conhecido como "colesterol bom". Protege o coração removendo o excesso de colesterol do sangue.',
    aliases: ['hdl', 'colesterol hdl', 'hdl colesterol', 'hdl-c', 'hdl cholesterol'],
  },
  {
    key: 'triglycerides',
    label: 'Triglicerídeos',
    description:
      'Tipo de gordura no sangue. Níveis elevados estão associados a risco cardíaco e síndrome metabólica.',
    aliases: ['triglicerídeos', 'triglicerideos', 'triglycerides', 'triglicérides', 'triglicerideo'],
  },
];

const normalise = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const matchesBiomarker = (name: string, aliases: string[]): boolean => {
  const n = normalise(name);
  return aliases.some((alias) => n.includes(normalise(alias)));
};

export interface UseRequiredBiomarkersReturn {
  requiredBiomarkers: RequiredBiomarker[];
  allPresent: boolean;
  presentCount: number;
  loading: boolean;
}

export const useRequiredBiomarkers = (): UseRequiredBiomarkersReturn => {
  const { user } = useAuth();
  const { isGuest, guestLabResult } = useGuest();
  const [foundKeys, setFoundKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBiomarkers = async () => {
      setLoading(true);

      if (isGuest) {
        // For guest, check the single guest lab result biomarkers
        if (guestLabResult) {
          const { data } = await supabase
            .from('detected_biomarkers')
            .select('name')
            .eq('lab_result_id', guestLabResult.id);

          const names = (data || []).map((r) => r.name as string);
          const found = new Set<string>();
          for (const bm of REQUIRED_BIOMARKERS) {
            if (names.some((n) => matchesBiomarker(n, bm.aliases))) found.add(bm.key);
          }
          setFoundKeys(found);
        } else {
          setFoundKeys(new Set());
        }
        setLoading(false);
        return;
      }

      if (!user) {
        setFoundKeys(new Set());
        setLoading(false);
        return;
      }

      try {
        // Fetch all biomarker names across ALL user lab results
        const { data: labResults } = await supabase
          .from('lab_results')
          .select('id')
          .eq('user_id', user.id);

        if (!labResults || labResults.length === 0) {
          setFoundKeys(new Set());
          setLoading(false);
          return;
        }

        const labIds = labResults.map((r) => r.id);

        const { data: biomarkerRows } = await supabase
          .from('detected_biomarkers')
          .select('name')
          .in('lab_result_id', labIds);

        const names = (biomarkerRows || []).map((r) => r.name as string);

        const found = new Set<string>();
        for (const bm of REQUIRED_BIOMARKERS) {
          if (names.some((n) => matchesBiomarker(n, bm.aliases))) found.add(bm.key);
        }

        setFoundKeys(found);
      } catch (err) {
        console.error('[useRequiredBiomarkers] Error:', err);
        setFoundKeys(new Set());
      } finally {
        setLoading(false);
      }
    };

    fetchBiomarkers();
  }, [user, isGuest, guestLabResult]);

  const requiredBiomarkers: RequiredBiomarker[] = REQUIRED_BIOMARKERS.map((bm) => ({
    ...bm,
    present: foundKeys.has(bm.key),
  }));

  const presentCount = requiredBiomarkers.filter((b) => b.present).length;
  const allPresent = presentCount === REQUIRED_BIOMARKERS.length;

  return { requiredBiomarkers, allPresent, presentCount, loading };
};
