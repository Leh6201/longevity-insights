import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGuest } from '@/contexts/GuestContext';
import { supabase } from '@/integrations/supabase/client';

interface ExamHistoryData {
  id: string;
  upload_date: string;
  biological_age: number | null;
  file_name: string | null;
  metabolic_risk_score?: string | null;
  inflammation_score?: string | null;
  ai_recommendations?: string[] | null;
}

interface UseExamHistoryReturn {
  examCount: number;
  uniqueExamCount: number; // Count of distinct uploads (by file_name)
  exams: ExamHistoryData[];
  loading: boolean;
  canShowAdvancedAnalysis: boolean; // 5+ exams for biological age and trends
}

export const useExamHistory = (): UseExamHistoryReturn => {
  const { user } = useAuth();
  const { isGuest, guestLabResult } = useGuest();
  const [exams, setExams] = useState<ExamHistoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExamHistory = async () => {
      if (isGuest) {
        // Guest users have at most 1 exam
        if (guestLabResult) {
          setExams([{
            id: guestLabResult.id,
            upload_date: guestLabResult.upload_date,
            biological_age: guestLabResult.biological_age,
            file_name: null, // Guest lab results don't track file_name
          }]);
        } else {
          setExams([]);
        }
        setLoading(false);
        return;
      }

      if (!user) {
        setExams([]);
        setLoading(false);
        return;
      }

      try {
        console.log('[useExamHistory] Fetching exams for user:', user.id);
        
        const { data, error } = await supabase
          .from('lab_results')
            .select('id, upload_date, biological_age, file_name, metabolic_risk_score, inflammation_score, ai_recommendations')
          .eq('user_id', user.id)
          .order('upload_date', { ascending: true });

        if (error) throw error;
        
        // Treat "exam" as a real, user-uploaded lab exam that produced meaningful analysis.
        // This avoids counting technical/failed uploads (e.g., non-lab images) toward the 5-exam unlock.
        const isMeaningfulExam = (exam: ExamHistoryData) => {
          const hasBioAge = exam.biological_age !== null && exam.biological_age !== undefined;
          const hasRisk = exam.metabolic_risk_score !== null && exam.metabolic_risk_score !== undefined;
          const hasInflammation = exam.inflammation_score !== null && exam.inflammation_score !== undefined;
          const hasRecs = (exam.ai_recommendations?.length || 0) > 0;
          return hasBioAge || hasRisk || hasInflammation || hasRecs;
        };

        // Deduplicate by file_name (unique upload). For each upload, keep the most recent
        // meaningful analysis if available; otherwise keep the most recent record.
        const grouped = new Map<
          string,
          {
            latest: ExamHistoryData;
            latestMeaningful?: ExamHistoryData;
            anyMeaningful: boolean;
          }
        >();

        for (const exam of (data || []) as ExamHistoryData[]) {
          const key = exam.file_name || exam.id; // file_name = upload identity; fallback to id
          const meaningful = isMeaningfulExam(exam);
          const existing = grouped.get(key);

          if (!existing) {
            grouped.set(key, {
              latest: exam,
              latestMeaningful: meaningful ? exam : undefined,
              anyMeaningful: meaningful,
            });
            continue;
          }

          // Data is ordered oldest -> newest, so overwrite latest every time.
          existing.latest = exam;
          if (meaningful) {
            existing.latestMeaningful = exam;
            existing.anyMeaningful = true;
          }
          grouped.set(key, existing);
        }

        const deduplicatedExams = Array.from(grouped.values())
          .filter((g) => g.anyMeaningful)
          .map((g) => g.latestMeaningful ?? g.latest)
          .sort((a, b) => new Date(a.upload_date).getTime() - new Date(b.upload_date).getTime());
        
        console.log('[useExamHistory] Total records:', data?.length || 0);
        console.log('[useExamHistory] Unique meaningful exams (by file_name):', deduplicatedExams.length);
        
        setExams(deduplicatedExams);
      } catch (error) {
        console.error('Error fetching exam history:', error);
        setExams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExamHistory();
  }, [user, isGuest, guestLabResult]);

  // examCount is now based on unique uploads only
  const uniqueExamCount = exams.length;

  return {
    examCount: uniqueExamCount, // For backward compatibility
    uniqueExamCount,
    exams,
    loading,
    canShowAdvancedAnalysis: uniqueExamCount >= 5, // Based on unique exams only
  };
};
