import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGuest } from '@/contexts/GuestContext';
import { supabase } from '@/integrations/supabase/client';

interface ExamHistoryData {
  id: string;
  upload_date: string;
  biological_age: number | null;
  file_name: string | null;
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
          .select('id, upload_date, biological_age, file_name')
          .eq('user_id', user.id)
          .order('upload_date', { ascending: true });

        if (error) throw error;
        
        // Deduplicate by file_name to count unique uploads
        // If same file was uploaded multiple times, count as 1 unique exam
        const uniqueFileNames = new Set<string>();
        const uniqueExams: ExamHistoryData[] = [];
        
        // Process in chronological order (oldest first), keep the most recent version of each unique file
        const examsByFile = new Map<string, ExamHistoryData>();
        
        for (const exam of data || []) {
          const key = exam.file_name || exam.id; // Use file_name as key, fallback to id for null file_names
          examsByFile.set(key, exam); // Later entries (newer) overwrite older ones
        }
        
        // Convert back to array sorted by upload_date
        const deduplicatedExams = Array.from(examsByFile.values()).sort(
          (a, b) => new Date(a.upload_date).getTime() - new Date(b.upload_date).getTime()
        );
        
        console.log('[useExamHistory] Total records:', data?.length || 0);
        console.log('[useExamHistory] Unique exams (by file_name):', deduplicatedExams.length);
        
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
