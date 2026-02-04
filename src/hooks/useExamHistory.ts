import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGuest } from '@/contexts/GuestContext';
import { supabase } from '@/integrations/supabase/client';

interface ExamHistoryData {
  id: string;
  upload_date: string;
  biological_age: number | null;
}

interface UseExamHistoryReturn {
  examCount: number;
  exams: ExamHistoryData[];
  loading: boolean;
  canShowTrend: boolean; // 3+ exams
  canShowComparison: boolean; // 2+ exams
  canShowBiologicalAge: boolean; // 5+ exams
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
        const { data, error } = await supabase
          .from('lab_results')
          .select('id, upload_date, biological_age')
          .eq('user_id', user.id)
          .order('upload_date', { ascending: true });

        if (error) throw error;
        setExams(data || []);
      } catch (error) {
        console.error('Error fetching exam history:', error);
        setExams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExamHistory();
  }, [user, isGuest, guestLabResult]);

  const examCount = exams.length;

  return {
    examCount,
    exams,
    loading,
    canShowTrend: examCount >= 3,
    canShowComparison: examCount >= 2,
    canShowBiologicalAge: examCount >= 5,
  };
};
