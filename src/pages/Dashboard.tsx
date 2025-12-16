import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useGuest } from '@/contexts/GuestContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Tutorial from '@/components/Tutorial';
import GuestBanner from '@/components/GuestBanner';
import PremiumOverlay from '@/components/PremiumOverlay';
import PremiumBadge from '@/components/PremiumBadge';
import LabUploadCard from '@/components/dashboard/LabUploadCard';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import HealthSummaryCards from '@/components/dashboard/HealthSummaryCards';
import RiskProjectionCard from '@/components/dashboard/RiskProjectionCard';
import BiomarkerProgressCard from '@/components/dashboard/BiomarkerProgressCard';
import BiomarkerRangeCard from '@/components/dashboard/BiomarkerRangeCard';
import TrendChartCard from '@/components/dashboard/TrendChartCard';
import QuickRecommendationCard from '@/components/dashboard/QuickRecommendationCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Sparkles, RefreshCw, Share2, Activity, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateHealthReport } from '@/lib/generateHealthReport';

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

interface OnboardingData {
  age: number | null;
  completed: boolean;
  health_goals?: string[];
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { isGuest, guestOnboarding, guestLabResult } = useGuest();
  
  const [labResult, setLabResult] = useState<LabResult | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [showImprovement, setShowImprovement] = useState(false);
  const [improvementYears, setImprovementYears] = useState(0);

  const fetchData = async () => {
    try {
      if (isGuest) {
        if (guestOnboarding) {
          setOnboarding({ 
            age: guestOnboarding.age, 
            completed: guestOnboarding.completed,
            health_goals: guestOnboarding.health_goals 
          });
          if (!guestOnboarding.completed) {
            navigate('/onboarding', { replace: true });
            return;
          }
        }
        if (guestLabResult) {
          setLabResult(guestLabResult);
        }
        return;
      }

      if (!user) return;

      const { data: labData } = await supabase
        .from('lab_results')
        .select('*')
        .eq('user_id', user.id)
        .order('upload_date', { ascending: false })
        .limit(1)
        .single();

      if (labData) {
        if (labResult && labResult.biological_age && labData.biological_age) {
          const improvement = labResult.biological_age - labData.biological_age;
          if (improvement > 0) {
            setImprovementYears(improvement);
            setShowImprovement(true);
            setTimeout(() => setShowImprovement(false), 5000);
          }
        }
        setLabResult(labData);
      }

      const { data: onboardingData } = await supabase
        .from('onboarding_data')
        .select('age, completed, health_goals')
        .eq('user_id', user.id)
        .single();

      if (onboardingData) {
        setOnboarding(onboardingData);
        if (!onboardingData.completed) {
          navigate('/onboarding', { replace: true });
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    
    if (!user && !isGuest) {
      setLoading(false);
      navigate('/auth', { replace: true });
      return;
    }
    
    const tutorialSeen = localStorage.getItem('longlife-tutorial-seen');
    if (!tutorialSeen) {
      setShowTutorial(true);
    }

    fetchData();
  }, [user, authLoading, isGuest]);

  const handleTutorialComplete = () => {
    localStorage.setItem('longlife-tutorial-seen', 'true');
    setShowTutorial(false);
  };

  const handleReanalyze = async () => {
    if (!labResult?.file_url) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('noFileToReanalyze'),
      });
      return;
    }
    
    setReanalyzing(true);
    toast({
      title: t('reanalyzing'),
      description: t('pleaseWait'),
    });
    
    setTimeout(() => {
      setReanalyzing(false);
      toast({
        title: t('analysisComplete'),
        description: t('resultsUpdated'),
      });
    }, 3000);
  };

  const handleShare = () => {
    if (!labResult) {
      toast({
        title: t('error'),
        description: t('noLabResults'),
        variant: 'destructive',
      });
      return;
    }
    
    try {
      generateHealthReport(labResult, onboarding);
      toast({
        title: t('success'),
        description: t('reportGenerated'),
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: t('reportError'),
        variant: 'destructive',
      });
    }
  };

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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <AnimatePresence>
        {showTutorial && <Tutorial onComplete={handleTutorialComplete} />}
      </AnimatePresence>

      {/* Improvement Animation */}
      <AnimatePresence>
        {showImprovement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-center space-y-4"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                <Sparkles className="w-16 h-16 text-primary mx-auto" />
              </motion.div>
              <h2 className="text-3xl font-display font-bold text-primary">
                {t('greatJob')}
              </h2>
              <p className="text-xl">
                {t('bioAgeImproved', { years: improvementYears })}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Dashboard Header */}
          <DashboardHeader 
            lastUpdate={labResult?.upload_date ? new Date(labResult.upload_date).toLocaleDateString() : undefined}
            isGuest={isGuest}
          />

          {/* Disclaimer */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-warning/10 border border-warning/20">
            <AlertCircle className="w-5 h-5 text-warning shrink-0" />
            <p className="text-sm text-warning">{t('disclaimer')}</p>
          </div>

          {labResult ? (
            <>
              {/* Summary Cards */}
              <HealthSummaryCards
                biologicalAge={labResult.biological_age}
                riskLevel={labResult.metabolic_risk_score as 'low' | 'moderate' | 'high' | null}
                recommendationsCount={labResult.ai_recommendations?.length || 0}
              />

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
                  />
                  <RiskProjectionCard
                    title={t('cardiovascularHealth')}
                    subtitle={t('projectionNext10Years')}
                    percentage={18}
                    monthlyChange={-5}
                    icon="cardiovascular"
                    delay={0.1}
                  />
                  <RiskProjectionCard
                    title={t('inflammatoryMarkers')}
                    subtitle={t('projectionNext10Years')}
                    percentage={8}
                    monthlyChange={-2}
                    icon="inflammation"
                    delay={0.2}
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
                />

                {/* Trend Chart */}
                <TrendChartCard
                  title={`${t('trend')} ALT`}
                  change={-15}
                  data={trendData}
                  delay={0.4}
                />
              </div>

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
                  />
                  <BiomarkerProgressCard
                    name={t('totalCholesterol')}
                    percentage={calculateBiomarkerPercentage(labResult.total_cholesterol, 0, 300)}
                    isNormal={isInRange(labResult.total_cholesterol, 0, 200)}
                    delay={0.1}
                  />
                  <BiomarkerProgressCard
                    name={t('hemoglobin')}
                    percentage={calculateBiomarkerPercentage(labResult.hemoglobin, 10, 20)}
                    isNormal={isInRange(labResult.hemoglobin, 12, 17)}
                    delay={0.2}
                  />
                  <BiomarkerProgressCard
                    name="HDL"
                    percentage={calculateBiomarkerPercentage(labResult.hdl, 20, 100)}
                    isNormal={isInRange(labResult.hdl, 40, 100)}
                    delay={0.3}
                  />
                  <BiomarkerProgressCard
                    name="LDL"
                    percentage={calculateBiomarkerPercentage(labResult.ldl, 0, 200)}
                    isNormal={isInRange(labResult.ldl, 0, 100)}
                    delay={0.4}
                  />
                </CardContent>
              </Card>

              {/* Recommendations & Actions */}
              <div className="grid lg:grid-cols-2 gap-6">
                <QuickRecommendationCard 
                  recommendations={labResult.ai_recommendations || []} 
                />
                
                <div className="space-y-4">
                  <LabUploadCard onUploadComplete={fetchData} />

                  {/* Actions Card */}
                  <PremiumOverlay isPremiumUser={false}>
                    <Card className="rounded-2xl shadow-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            {t('actions')}
                          </CardTitle>
                          <PremiumBadge />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={handleReanalyze}
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
                          className="w-full" 
                          variant="outline"
                          onClick={handleShare}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          {t('shareWithDoctor')}
                        </Button>
                        {labResult.upload_date && (
                          <p className="text-xs text-muted-foreground text-center">
                            {t('lastAnalysis')}: {new Date(labResult.upload_date).toLocaleDateString()}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </PremiumOverlay>
                </div>
              </div>
            </>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              <LabUploadCard onUploadComplete={fetchData} />
              <PremiumOverlay isPremiumUser={false}>
                <Card className="rounded-2xl shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{t('advancedAnalytics')}</CardTitle>
                      <PremiumBadge />
                    </div>
                    <CardDescription>{t('premiumAnalyticsDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 flex items-center justify-center text-muted-foreground">
                      {t('unlockAdvancedFeatures')}
                    </div>
                  </CardContent>
                </Card>
              </PremiumOverlay>
            </div>
          )}
        </motion.div>
      </main>

      <GuestBanner />
    </div>
  );
};

export default Dashboard;
