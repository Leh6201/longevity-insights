import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { RefreshCw, Share2, Activity, Loader2, FolderOpen } from 'lucide-react';

import HealthSummaryCards from '@/components/dashboard/HealthSummaryCards';
import RiskProjectionCard from '@/components/dashboard/RiskProjectionCard';
import BiomarkerProgressCard from '@/components/dashboard/BiomarkerProgressCard';
import BiomarkerRangeCard from '@/components/dashboard/BiomarkerRangeCard';
import TrendChartCard from '@/components/dashboard/TrendChartCard';
import ExamsHistoryCard from '@/components/dashboard/ExamsHistoryCard';
import LabUploadCard from '@/components/dashboard/LabUploadCard';

interface LabResult {
  id: string;
  biological_age: number | null;
  metabolic_risk_score: string | null;
  inflammation_score: string | null;
  ai_recommendations: string[] | null;
  total_cholesterol: number | null;
  hdl: number | null;
  ldl: number | null;
  triglycerides: number | null;
  glucose: number | null;
  hemoglobin: number | null;
  ast: number | null;
  alt: number | null;
  ggt: number | null;
  creatinine: number | null;
  vitamin_d: number | null;
  tsh: number | null;
  crp: number | null;
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

  // Calculate biomarker percentages for display
  const calculateBiomarkerPercentage = (value: number | null, min: number, max: number) => {
    if (value === null) return 0;
    const percentage = Math.min(100, Math.max(0, ((max - value) / (max - min)) * 100));
    return Math.round(percentage);
  };

  const isInRange = (value: number | null, min: number, max: number) => {
    if (value === null) return false;
    return value >= min && value <= max;
  };

  // Mock trend data for charts
  const trendData = [65, 72, 68, 80, 75, 82, 70, 78, 68];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Summary Cards */}
      <HealthSummaryCards
        biologicalAge={labResult.biological_age}
        riskLevel={labResult.metabolic_risk_score as 'low' | 'moderate' | 'high' | null}
        recommendationsCount={labResult.ai_recommendations?.length || 0}
      />

      {/* Biomarker Progress Bars */}
      <Card className="rounded-2xl shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t('biomarkers')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <BiomarkerProgressCard
            name={t('glucose')}
            percentage={calculateBiomarkerPercentage(labResult.glucose, 70, 126)}
            isNormal={isInRange(labResult.glucose, 70, 100)}
            delay={0}
            infoText={t('glucoseInfo')}
          />
          <BiomarkerProgressCard
            name={t('totalCholesterol')}
            percentage={calculateBiomarkerPercentage(labResult.total_cholesterol, 0, 300)}
            isNormal={isInRange(labResult.total_cholesterol, 0, 200)}
            delay={0.1}
            infoText={t('cholesterolInfo')}
          />
          <BiomarkerProgressCard
            name={t('hemoglobin')}
            percentage={calculateBiomarkerPercentage(labResult.hemoglobin, 10, 20)}
            isNormal={isInRange(labResult.hemoglobin, 12, 17)}
            delay={0.2}
            infoText={t('hemoglobinInfo')}
          />
          <BiomarkerProgressCard
            name="HDL"
            percentage={calculateBiomarkerPercentage(labResult.hdl, 20, 100)}
            isNormal={isInRange(labResult.hdl, 40, 100)}
            delay={0.3}
            infoText={t('hdlInfo')}
          />
          <BiomarkerProgressCard
            name="LDL"
            percentage={calculateBiomarkerPercentage(labResult.ldl, 0, 200)}
            isNormal={isInRange(labResult.ldl, 0, 100)}
            delay={0.4}
            infoText={t('ldlInfo')}
          />
        </CardContent>
      </Card>

      {/* Risk Projections */}
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
          />
          <RiskProjectionCard
            title={t('cardiovascularHealth')}
            subtitle={t('projectionNext10Years')}
            percentage={18}
            monthlyChange={-5}
            icon="cardiovascular"
            delay={0.1}
            infoText={t('cardiovascularInfo')}
          />
          <RiskProjectionCard
            title={t('inflammatoryMarkers')}
            subtitle={t('projectionNext10Years')}
            percentage={8}
            monthlyChange={-2}
            icon="inflammation"
            delay={0.2}
            infoText={t('inflammatoryInfo')}
          />
        </div>
      </div>

      {/* Two Column Layout for Desktop */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Biomarker Range Card */}
        <BiomarkerRangeCard
          name={t('fastingGlucose')}
          value={labResult.glucose}
          unit="mg/dL"
          min={70}
          max={126}
          optimalMin={70}
          optimalMax={100}
          delay={0.3}
          infoText={t('fastingGlucoseInfo')}
        />

        {/* Trend Chart */}
        <TrendChartCard
          title={`${t('trend')} ALT`}
          change={-15}
          data={trendData}
          delay={0.4}
          infoText={t('altTrendInfo')}
        />
      </div>

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
  );
};

export default SummaryTab;
