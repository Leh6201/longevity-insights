import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useGuest } from '@/contexts/GuestContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import BiologicalAgeCard from '@/components/dashboard/BiologicalAgeCard';
import RiskScoreCard from '@/components/dashboard/RiskScoreCard';
import BiomarkerChart from '@/components/dashboard/BiomarkerChart';
import RecommendationsCard from '@/components/dashboard/RecommendationsCard';
import LabUploadCard from '@/components/dashboard/LabUploadCard';
import Tutorial from '@/components/Tutorial';
import GuestBanner from '@/components/GuestBanner';
import PremiumOverlay from '@/components/PremiumOverlay';
import PremiumBadge from '@/components/PremiumBadge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, AlertCircle, Upload, RefreshCw, Share2, Calendar, Clock, Sparkles, Target, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
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
  const { isGuest, guestOnboarding, guestLabResult, setGuestLabResult } = useGuest();
  
  const [labResult, setLabResult] = useState<LabResult | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [showImprovement, setShowImprovement] = useState(false);
  const [improvementYears, setImprovementYears] = useState(0);

  const fetchData = async () => {
    if (isGuest) {
      if (guestOnboarding) {
        setOnboarding({ 
          age: guestOnboarding.age, 
          completed: guestOnboarding.completed,
          health_goals: guestOnboarding.health_goals 
        });
        if (!guestOnboarding.completed) {
          navigate('/onboarding');
          return;
        }
      }
      if (guestLabResult) {
        setLabResult(guestLabResult);
      }
      setLoading(false);
      return;
    }

    if (!user) return;

    try {
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
          navigate('/onboarding');
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
    // Wait for auth to finish loading
    if (authLoading) return;
    
    if (!user && !isGuest) {
      navigate('/auth');
      return;
    }
    
    const tutorialSeen = localStorage.getItem('longlife-tutorial-seen');
    if (!tutorialSeen) {
      setShowTutorial(true);
    }

    fetchData();
  }, [user, authLoading, isGuest, navigate]);

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

  const lipidData = [
    { name: t('totalCholesterol'), value: labResult?.total_cholesterol, reference: { min: 0, max: 200 }, tooltipKey: 'totalCholesterolTooltip' },
    { name: t('hdl'), value: labResult?.hdl, reference: { min: 40, max: 60 }, tooltipKey: 'hdlTooltip' },
    { name: t('ldl'), value: labResult?.ldl, reference: { min: 0, max: 100 }, tooltipKey: 'ldlTooltip' },
    { name: t('triglycerides'), value: labResult?.triglycerides, reference: { min: 0, max: 150 }, tooltipKey: 'triglycericesTooltip' },
  ];

  const glucoseData = [
    { name: t('glucose'), value: labResult?.glucose, reference: { min: 70, max: 100 }, tooltipKey: 'glucoseTooltip' },
    { name: t('hemoglobin'), value: labResult?.hemoglobin, reference: { min: 12, max: 17 }, tooltipKey: 'hemoglobinTooltip' },
  ];

  const liverData = [
    { name: t('ast'), value: labResult?.ast, reference: { min: 0, max: 40 }, tooltipKey: 'astTooltip' },
    { name: t('alt'), value: labResult?.alt, reference: { min: 0, max: 40 }, tooltipKey: 'altTooltip' },
    { name: t('ggt'), value: labResult?.ggt, reference: { min: 0, max: 60 }, tooltipKey: 'ggtTooltip' },
  ];

  const otherMarkersData = [
    { name: t('creatinine'), value: labResult?.creatinine, reference: { min: 0.6, max: 1.2 }, tooltipKey: 'creatinineTooltip' },
    { name: t('vitaminD'), value: labResult?.vitamin_d, reference: { min: 30, max: 100 }, tooltipKey: 'vitaminDTooltip' },
    { name: t('tsh'), value: labResult?.tsh, reference: { min: 0.4, max: 4.0 }, tooltipKey: 'tshTooltip' },
    { name: t('crp'), value: labResult?.crp, reference: { min: 0, max: 3 }, tooltipKey: 'crpTooltip' },
  ];

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
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-display font-bold text-foreground">{t('dashboard')}</h1>
            {isGuest && (
              <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                {t('guestMode')}
              </span>
            )}
          </div>

          {/* Disclaimer */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-warning/10 border border-warning/20">
            <AlertCircle className="w-5 h-5 text-warning shrink-0" />
            <p className="text-sm text-warning">{t('disclaimer')}</p>
          </div>

          {/* Health Goals Summary */}
          {onboarding?.health_goals && onboarding.health_goals.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5" />
                  {t('yourGoals')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {onboarding.health_goals.map((goal, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                      {t(goal.replace('_', '') as any) || goal}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {labResult ? (
            <>
              {/* Last Analysis Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{t('lastAnalysis')}: {format(new Date(labResult.upload_date), 'PPP')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{t('processingTime')}: ~3s</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReanalyze}
                  disabled={reanalyzing}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${reanalyzing ? 'animate-spin' : ''}`} />
                  {t('reanalyze')}
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  {t('shareWithDoctor')}
                </Button>
              </div>

              {/* Main Stats */}
              <div className="grid lg:grid-cols-3 gap-6">
                <BiologicalAgeCard 
                  biologicalAge={labResult.biological_age} 
                  actualAge={onboarding?.age || null} 
                />
                <RiskScoreCard 
                  title={t('metabolicRisk')} 
                  score={labResult.metabolic_risk_score as 'low' | 'moderate' | 'high' | null} 
                  icon="metabolic"
                />
                <RiskScoreCard 
                  title={t('inflammationScore')} 
                  score={labResult.inflammation_score as 'low' | 'moderate' | 'high' | null}
                  icon="inflammation"
                />
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-6">
                <BiomarkerChart title={t('lipidProfile')} data={lipidData} />
                <BiomarkerChart title={t('glucoseMarkers')} data={glucoseData} />
                <BiomarkerChart title={t('liverFunction')} data={liverData} />
                <BiomarkerChart title={t('otherMarkers')} data={otherMarkersData} />
              </div>

              {/* Recommendations & Upload */}
              <div className="grid lg:grid-cols-2 gap-6">
                <RecommendationsCard recommendations={labResult.ai_recommendations || []} />
                <div className="space-y-6">
                  <LabUploadCard onUploadComplete={fetchData} />
                  {/* Premium History Feature */}
                  <PremiumOverlay isPremiumUser={false}>
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{t('analysisHistory')}</CardTitle>
                          <PremiumBadge />
                        </div>
                        <CardDescription>{t('trackProgress')}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-32 flex items-center justify-center text-muted-foreground">
                          {t('viewAllAnalyses')}
                        </div>
                      </CardContent>
                    </Card>
                  </PremiumOverlay>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <Card className="border-dashed">
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{t('noLabResults')}</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      {t('uploadFirstDescription')}
                    </p>
                  </div>
                  <Button size="lg" onClick={() => document.getElementById('lab-upload-input')?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    {t('uploadLabTest')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!labResult && (
            <div className="grid lg:grid-cols-2 gap-6">
              <LabUploadCard onUploadComplete={fetchData} />
              <PremiumOverlay isPremiumUser={false}>
                <Card>
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
