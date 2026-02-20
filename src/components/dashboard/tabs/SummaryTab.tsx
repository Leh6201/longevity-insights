import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { RefreshCw, Share2, Activity, Loader2, FolderOpen } from 'lucide-react';

import HealthSummaryCards from '@/components/dashboard/HealthSummaryCards';
import RiskProjectionCard from '@/components/dashboard/RiskProjectionCard';
 import AdvancedAnalysisEducationalCard from '@/components/dashboard/AdvancedAnalysisEducationalCard';
import BioAgeUnlockCelebration from '@/components/dashboard/BioAgeUnlockCelebration';

import TrendChartCard from '@/components/dashboard/TrendChartCard';
import ExamsHistoryCard from '@/components/dashboard/ExamsHistoryCard';
import LabUploadCard from '@/components/dashboard/LabUploadCard';
import DynamicBiomarkersList from '@/components/dashboard/DynamicBiomarkersList';
import { useDynamicBiomarkers } from '@/hooks/useDynamicBiomarkers';
import { useExamHistory } from '@/hooks/useExamHistory';
import { useBioAgeUnlock } from '@/hooks/useBioAgeUnlock';
import { translateBiomarkerName } from '@/lib/biomarkerLocalization';

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
  
  // Fetch dynamic biomarkers for this lab result
  const { biomarkers, loading: biomarkersLoading } = useDynamicBiomarkers(labResult?.id || null);
  
  // Fetch exam history for advanced analysis display rules
  const { examCount, canShowAdvancedAnalysis, exams } = useExamHistory();

  // If the most recent lab result doesn't have biological_age yet, fall back to the
  // latest available biological_age from the user's exam history (unique uploads).
  const effectiveBiologicalAge = React.useMemo(() => {
    if (labResult?.biological_age !== null && labResult?.biological_age !== undefined) {
      return labResult.biological_age;
    }
    const lastWithBioAge = [...(exams || [])]
      .reverse()
      .find((e) => e.biological_age !== null && e.biological_age !== undefined);
    return lastWithBioAge?.biological_age ?? null;
  }, [labResult?.biological_age, exams]);

  // Bio age unlock celebration
  const { showCelebration, markAsSeen } = useBioAgeUnlock(examCount, canShowAdvancedAnalysis);

  // Mock trend data for charts
  const trendData = [65, 72, 68, 80, 75, 82, 70, 78, 68];

  // Get first detected glucose value for the trend chart (if exists)
  const glucoseBiomarker = biomarkers.find(b => 
    b.name.toLowerCase().includes('glicose') || 
    b.name.toLowerCase().includes('glucose')
  );

  return (
    <>
      {/* Bio Age Unlock Celebration */}
      {showCelebration && (
        <BioAgeUnlockCelebration
          biologicalAge={labResult.biological_age}
          onComplete={markAsSeen}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
      {/* Summary Cards */}
       <HealthSummaryCards
        biologicalAge={effectiveBiologicalAge}
        riskLevel={labResult.metabolic_risk_score as 'low' | 'moderate' | 'high' | null}
        recommendationsCount={labResult.ai_recommendations?.length || 0}
        canShowBiologicalAge={canShowAdvancedAnalysis}
        examCount={examCount}
      />

      {/* Advanced Analysis Notice - Show only when < 5 exams */}
      {!canShowAdvancedAnalysis && examCount > 0 && (
         <AdvancedAnalysisEducationalCard examCount={examCount} />
      )}

      {/* Dynamic Biomarkers List - Generated from uploaded exam */}
      <DynamicBiomarkersList 
        biomarkers={biomarkers} 
        loading={biomarkersLoading} 
      />

      {/* Risk Projections - always visible, locked when < 5 exams */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">{t('healthProjections')}</h2>
        <div className="grid gap-3">
          <RiskProjectionCard
            title={t('metabolicRisk')}
            subtitle={t('projectionNext10Years')}
            percentage={12}
            monthlyChange={-3}
            icon="metabolic"
            delay={0}
            infoText={t('metabolicRiskInfo')}
            locked={!canShowAdvancedAnalysis}
          />
          <RiskProjectionCard
            title={t('cardiovascularHealth')}
            subtitle={t('projectionNext10Years')}
            percentage={18}
            monthlyChange={-5}
            icon="cardiovascular"
            delay={0.1}
            infoText={t('cardiovascularInfo')}
            locked={!canShowAdvancedAnalysis}
          />
          <RiskProjectionCard
            title={t('inflammatoryMarkers')}
            subtitle={t('projectionNext10Years')}
            percentage={8}
            monthlyChange={-2}
            icon="inflammation"
            delay={0.2}
            infoText={t('inflammatoryInfo')}
            locked={!canShowAdvancedAnalysis}
          />
        </div>
      </div>

      {/* Trend Chart - always visible; locked (<3 entries) or full (3+) */}
      {glucoseBiomarker && (
        <TrendChartCard
          title={translateBiomarkerName(glucoseBiomarker.name)}
          change={-15}
          data={trendData}
          delay={0.3}
          infoText={t('altTrendInfo')}
          examCount={examCount}
          displayMode={canShowAdvancedAnalysis ? 'full' : 'none'}
        />
      )}

      {/* Show locked trend chart placeholder even without glucose data when locked */}
      {!glucoseBiomarker && (
        <TrendChartCard
          title="Glicose"
          change={0}
          data={trendData}
          delay={0.3}
          examCount={examCount}
          displayMode="none"
        />
      )}

      {/* Upload Exam Card - Primary Action */}
      <LabUploadCard onUploadComplete={onUploadComplete} />

      {/* Actions Section - Secondary/Management Actions */}
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
