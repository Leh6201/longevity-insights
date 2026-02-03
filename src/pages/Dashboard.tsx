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
import LabUploadCard from '@/components/dashboard/LabUploadCard';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardBottomNav, { DashboardTab } from '@/components/dashboard/DashboardBottomNav';
import SummaryTab from '@/components/dashboard/tabs/SummaryTab';
import InsightsTab from '@/components/dashboard/tabs/InsightsTab';
import ProfileTab from '@/components/dashboard/tabs/ProfileTab';
import { Sparkles, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  health_goals?: string[] | null;
  daily_water_intake?: number | null;
  weight?: number | null;
  height?: number | null;
  mental_health_level?: number | null;
  training_frequency?: string | null;
  sleep_quality?: string | null;
  alcohol_consumption?: string | null;
  biological_sex?: string | null;
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { isGuest, guestOnboarding, guestLabResult } = useGuest();
  
  const [labResult, setLabResult] = useState<LabResult | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [showImprovement, setShowImprovement] = useState(false);
  const [improvementYears, setImprovementYears] = useState(0);
  const [activeTab, setActiveTab] = useState<DashboardTab>('summary');
  const [showReanalyzeDialog, setShowReanalyzeDialog] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean | null>(null);

  const fetchData = async () => {
    try {
      if (isGuest) {
        if (guestOnboarding) {
          setOnboarding({ 
            age: guestOnboarding.age, 
            completed: guestOnboarding.completed,
            health_goals: guestOnboarding.health_goals,
            daily_water_intake: guestOnboarding.daily_water_intake,
            weight: guestOnboarding.weight,
            height: guestOnboarding.height,
            mental_health_level: guestOnboarding.mental_health_level,
            training_frequency: guestOnboarding.training_frequency,
            sleep_quality: guestOnboarding.sleep_quality,
            alcohol_consumption: guestOnboarding.alcohol_consumption,
            biological_sex: guestOnboarding.biological_sex,
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

      // Fetch user profile name and terms acceptance
      const { data: profileData } = await supabase
        .from('profiles')
        .select('name, terms_accepted_at')
        .eq('user_id', user.id)
        .single();

      if (profileData?.name) {
        setUserName(profileData.name);
      }
      
      // Check terms acceptance status
      setHasAcceptedTerms(profileData?.terms_accepted_at !== null);

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
        .select('age, completed, health_goals, daily_water_intake, weight, height, mental_health_level, training_frequency, sleep_quality, alcohol_consumption, biological_sex')
        .eq('user_id', user.id)
        .maybeSingle();

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

  const handleReanalyzeClick = () => {
    if (!labResult || !user) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('noFileToReanalyze'),
      });
      return;
    }
    setShowReanalyzeDialog(true);
  };

  const handleReanalyzeConfirm = async () => {
    if (!labResult || !user) return;
    
    setShowReanalyzeDialog(false);
    
    setReanalyzing(true);
    toast({
      title: t('reanalyzing'),
      description: t('pleaseWait'),
    });
    
    try {
      // First, delete existing biomarkers for this lab result
      await supabase
        .from('detected_biomarkers')
        .delete()
        .eq('lab_result_id', labResult.id);

      // List files in user's folder to find the most recent one
      const { data: files, error: listError } = await supabase.storage
        .from('lab-files')
        .list(user.id, { sortBy: { column: 'created_at', order: 'desc' }, limit: 1 });

      if (listError || !files || files.length === 0) {
        throw new Error(t('noFileFound'));
      }

      // Download the file
      const filePath = `${user.id}/${files[0].name}`;
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('lab-files')
        .download(filePath);

      if (downloadError || !fileData) {
        throw new Error(t('downloadFailed'));
      }

      // Convert to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(fileData);
      const base64 = await base64Promise;

      // Call edge function to re-analyze
      const { error: analyzeError } = await supabase.functions.invoke('analyze-lab-results', {
        body: { 
          fileBase64: base64,
          fileType: fileData.type,
          userId: user.id,
          fileName: files[0].name,
          reanalyze: true,
          existingLabResultId: labResult.id,
        },
      });

      if (analyzeError) throw analyzeError;

      toast({
        title: t('analysisComplete'),
        description: t('resultsUpdated'),
      });

      // Refresh data
      await fetchData();
    } catch (error: any) {
      console.error('Reanalyze error:', error);
      toast({
        variant: "destructive",
        title: t('error'),
        description: error.message || t('failedToReanalyze'),
      });
    } finally {
      setReanalyzing(false);
    }
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // Component to show when insights are locked
  const InsightsLockedCard = () => (
    <Card className="border-border/50 bg-muted/30">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            {t('insightsLocked')}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {t('insightsLockedDescription')}
          </p>
        </div>
        <Button onClick={() => navigate('/accept-terms')}>
          {t('acceptTermsToUnlock')}
        </Button>
      </CardContent>
    </Card>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return labResult ? (
          <SummaryTab
            labResult={labResult}
            onReanalyze={handleReanalyzeClick}
            onShare={handleShare}
            reanalyzing={reanalyzing}
            onUploadComplete={fetchData}
          />
        ) : (
          <LabUploadCard onUploadComplete={fetchData} />
        );
      case 'insights':
        // Block insights if terms not accepted
        if (!hasAcceptedTerms && !isGuest) {
          return <InsightsLockedCard />;
        }
        return <InsightsTab onboardingData={onboarding} />;
      case 'profile':
        return (
          <ProfileTab 
            onboardingData={onboarding} 
            userName={userName}
            isGuest={isGuest}
          />
        );
      default:
        return null;
    }
  };

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
      
      <main className="container mx-auto px-4 pt-24 pb-24 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Dashboard Header - only show on Summary tab */}
          {activeTab === 'summary' && (
            <DashboardHeader 
              lastUpdate={labResult?.upload_date ? new Date(labResult.upload_date).toLocaleDateString() : undefined}
              isGuest={isGuest}
            />
          )}

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <DashboardBottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <GuestBanner />

      {/* Reanalyze Confirmation Dialog */}
      <AlertDialog open={showReanalyzeDialog} onOpenChange={setShowReanalyzeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmReanalyze')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('reanalyzeWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleReanalyzeConfirm}>
              {t('reanalyze')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
