import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { RefreshCw, Share2, Activity, Loader2, FolderOpen } from 'lucide-react';

import BiologicalAgeCard from '@/components/dashboard/BiologicalAgeCard';
import BioAgeChecklist from '@/components/dashboard/BioAgeChecklist';
import BioAgeUnlockCelebration from '@/components/dashboard/BioAgeUnlockCelebration';
import TrendChartCard from '@/components/dashboard/TrendChartCard';
import ExamsHistoryCard from '@/components/dashboard/ExamsHistoryCard';
import LabUploadCard from '@/components/dashboard/LabUploadCard';
import DynamicBiomarkersList from '@/components/dashboard/DynamicBiomarkersList';
import { useDynamicBiomarkers } from '@/hooks/useDynamicBiomarkers';
import { useExamHistory } from '@/hooks/useExamHistory';
import { useBioAgeUnlock } from '@/hooks/useBioAgeUnlock';
import { useRequiredBiomarkers } from '@/hooks/useRequiredBiomarkers';
import { translateBiomarkerName } from '@/lib/biomarkerLocalization';
import { calculateMetabolicAge } from '@/lib/metabolicAge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface LabResult {
  id: string;
  biological_age: number | null;
  metabolic_risk_score: string | null;
  inflammation_score: string | null;
  ai_recommendations: string[] | null;
  upload_date: string;
  file_url?: string;
}

interface SummaryTabProps {
  labResult: LabResult;
  onReanalyze: () => void;
  onShare: () => void;
  reanalyzing: boolean;
  onUploadComplete: () => void;
}

const SummaryTab: React.FC<SummaryTabProps> = ({ 
  labResult, 
  onReanalyze, 
  onShare, 
  reanalyzing,
  onUploadComplete
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { biomarkers, loading: biomarkersLoading } = useDynamicBiomarkers(labResult?.id || null);
  const { exams } = useExamHistory();
  const { requiredBiomarkers, allPresent, presentCount } = useRequiredBiomarkers();

  // Fetch chronological age from onboarding data
  const [chronologicalAge, setChronologicalAge] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (!user) return;
    supabase
      .from('onboarding_data')
      .select('age')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.age) setChronologicalAge(data.age);
      });
  }, [user]);

  // Biological Age unlocks only when all 4 required biomarkers are present
  const isLocked = !allPresent;

  // Helper to find numeric value from detected biomarkers by alias
  const findBiomarkerValue = (aliases: string[]): number | null => {
    const normalise = (s: string) =>
      s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    for (const bm of biomarkers) {
      const n = normalise(bm.name);
      if (aliases.some((a) => n.includes(normalise(a))) && bm.value != null) {
        return bm.value;
      }
    }
    return null;
  };

  // Calculate biological age on-the-fly from detected biomarkers
  const calculatedBiologicalAge = React.useMemo(() => {
    if (!allPresent || !chronologicalAge) return null;

    const glucose = findBiomarkerValue(['glicose', 'glucose']);
    const hdl = findBiomarkerValue(['hdl']);
    const ldl = findBiomarkerValue(['ldl']);
    const triglycerides = findBiomarkerValue(['triglicerídeos', 'triglicerideos', 'triglycerides', 'triglicerides']);

    console.log('[BioAge] Detected biomarker values:', { glucose, hdl, ldl, triglycerides });
    console.log('[BioAge] Chronological age:', chronologicalAge);

    if (glucose == null || hdl == null || ldl == null || triglycerides == null) {
      console.warn('[BioAge] Missing numeric value for one or more biomarkers');
      return null;
    }

    const result = calculateMetabolicAge({ chronologicalAge, glucose, hdl, ldl, triglycerides });
    console.log('[BioAge] Calculation result:', result);

    if (!result || !Number.isFinite(result.biologicalAge)) {
      console.warn('[BioAge] Calculation returned invalid result');
      return null;
    }

    return result.biologicalAge;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPresent, chronologicalAge, biomarkers]);

  const totalExams = exams.length;
  const { showCelebration, markAsSeen } = useBioAgeUnlock(totalExams, !isLocked);

  // Mock trend data for charts
  const trendData = [65, 72, 68, 80, 75, 82, 70, 78, 68];

  const glucoseBiomarker = biomarkers.find(b => 
    b.name.toLowerCase().includes('glicose') || 
    b.name.toLowerCase().includes('glucose')
  );

  return (
    <>
      {showCelebration && (
        <BioAgeUnlockCelebration
          biologicalAge={calculatedBiologicalAge}
          onComplete={markAsSeen}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Missing required biomarkers: show checklist */}
        {isLocked && (
          <BioAgeChecklist
            biomarkers={requiredBiomarkers}
            presentCount={presentCount}
          />
        )}

        {/* All required biomarkers present: show Biological Age and charts */}
        {!isLocked && calculatedBiologicalAge !== null && (
          <>
            <BiologicalAgeCard
              biologicalAge={calculatedBiologicalAge}
              actualAge={chronologicalAge}
            />

            {glucoseBiomarker && (
              <TrendChartCard
                title={translateBiomarkerName(glucoseBiomarker.name)}
                change={-15}
                data={trendData}
                delay={0.1}
                infoText={t('altTrendInfo')}
                examCount={totalExams}
                displayMode="full"
              />
            )}
          </>
        )}

        {/* Biomarkers list — always visible */}
        <DynamicBiomarkersList
          biomarkers={biomarkers}
          loading={biomarkersLoading}
        />

        {/* Upload Exam Card */}
        <LabUploadCard onUploadComplete={onUploadComplete} />

        {/* Actions */}
        <Card className="rounded-2xl shadow-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5" />
              {t('actions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline"
                onClick={onReanalyze}
                disabled={reanalyzing}
              >
                {reanalyzing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {t('reanalyze')}
              </Button>
              <Button 
                variant="outline"
                onClick={onShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                {t('shareWithDoctor')}
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    {t('examsHistory')}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <FolderOpen className="w-5 h-5" />
                      {t('examsHistory')}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ExamsHistoryCard currentExamId={labResult?.id} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            {labResult.upload_date && (
              <p className="text-xs text-muted-foreground mt-3">
                {t('lastAnalysis')}: {new Date(labResult.upload_date).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default SummaryTab;
