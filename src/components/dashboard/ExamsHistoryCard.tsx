import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  Calendar, 
  ChevronRight, 
  Activity, 
  Download,
  Eye,
  Loader2,
  FolderOpen
} from 'lucide-react';

interface LabResult {
  id: string;
  upload_date: string;
  file_name: string | null;
  file_url: string | null;
  biological_age: number | null;
  metabolic_risk_score: string | null;
}

interface ExamsHistoryCardProps {
  onSelectExam?: (examId: string) => void;
  currentExamId?: string;
}

const ExamsHistoryCard: React.FC<ExamsHistoryCardProps> = ({ onSelectExam, currentExamId }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [exams, setExams] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedExam, setExpandedExam] = useState<string | null>(null);

  useEffect(() => {
    fetchExams();
  }, [user]);

  const fetchExams = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('lab_results')
        .select('id, upload_date, file_name, file_url, biological_age, metabolic_risk_score')
        .eq('user_id', user.id)
        .order('upload_date', { ascending: false });

      if (error) throw error;
      setExams(data || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getRiskColor = (risk: string | null) => {
    switch (risk?.toLowerCase()) {
      case 'low':
      case 'baixo':
        return 'text-success bg-success/10';
      case 'moderate':
      case 'médio':
        return 'text-warning bg-warning/10';
      case 'high':
      case 'alto':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getRiskLabel = (risk: string | null) => {
    switch (risk?.toLowerCase()) {
      case 'low':
        return t('low');
      case 'moderate':
        return t('moderate');
      case 'high':
        return t('high');
      default:
        return risk || '-';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {t('examsHistoryDescription')}
      </p>

        {exams.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium">{t('noExamsYet')}</p>
            <p className="text-sm text-muted-foreground mt-1">{t('uploadFirstExam')}</p>
          </motion.div>
        ) : (
          <ScrollArea className="h-[280px] pr-2">
            <div className="space-y-2">
              <AnimatePresence>
                {exams.map((exam, index) => (
                  <motion.div
                    key={exam.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group relative rounded-xl border transition-all duration-200 ${
                      currentExamId === exam.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50 hover:bg-accent/50'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedExam(expandedExam === exam.id ? null : exam.id)}
                      className="w-full p-3 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {exam.file_name || `${t('exam')} ${index + 1}`}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(exam.upload_date)}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight 
                          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
                            expandedExam === exam.id ? 'rotate-90' : ''
                          }`} 
                        />
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedExam === exam.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 pt-1 border-t border-border/50 mt-1">
                            {/* Exam Summary */}
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              {exam.biological_age && (
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                                  <Activity className="w-4 h-4 text-primary" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">{t('bioAge')}</p>
                                    <p className="text-sm font-semibold">{exam.biological_age} {t('yearsOld')}</p>
                                  </div>
                                </div>
                              )}
                              {exam.metabolic_risk_score && (
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                                  <div className={`w-2 h-2 rounded-full ${getRiskColor(exam.metabolic_risk_score).replace('text-', 'bg-').replace(' bg-', ' ').split(' ')[0]}`} />
                                  <div>
                                    <p className="text-xs text-muted-foreground">{t('risk')}</p>
                                    <p className="text-sm font-semibold">{getRiskLabel(exam.metabolic_risk_score)}</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              {onSelectExam && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => onSelectExam(exam.id)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  {t('viewDetails')}
                                </Button>
                              )}
                              {exam.file_url && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDownload(exam.file_url!, exam.file_name || 'exam.pdf')}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}

        {exams.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              {t('totalExams', { count: exams.length })}
            </p>
          </div>
        )}
    </div>
  );
};

export default ExamsHistoryCard;
