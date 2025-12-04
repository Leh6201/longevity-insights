import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import BiologicalAgeCard from '@/components/dashboard/BiologicalAgeCard';
import RiskScoreCard from '@/components/dashboard/RiskScoreCard';
import BiomarkerChart from '@/components/dashboard/BiomarkerChart';
import RecommendationsCard from '@/components/dashboard/RecommendationsCard';
import LabUploadCard from '@/components/dashboard/LabUploadCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle } from 'lucide-react';

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
  upload_date: string;
}

interface OnboardingData {
  age: number | null;
  completed: boolean;
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [labResult, setLabResult] = useState<LabResult | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch latest lab result
      const { data: labData } = await supabase
        .from('lab_results')
        .select('*')
        .eq('user_id', user.id)
        .order('upload_date', { ascending: false })
        .limit(1)
        .single();

      if (labData) {
        setLabResult(labData);
      }

      // Fetch onboarding data
      const { data: onboardingData } = await supabase
        .from('onboarding_data')
        .select('age, completed')
        .eq('user_id', user.id)
        .single();

      if (onboardingData) {
        setOnboarding(onboardingData);
        
        // Redirect to onboarding if not completed
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
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }
    
    if (user) {
      fetchData();
    }
  }, [user, authLoading, navigate]);

  const lipidData = [
    { name: t('totalCholesterol'), value: labResult?.total_cholesterol, reference: { min: 0, max: 200 } },
    { name: t('hdl'), value: labResult?.hdl, reference: { min: 40, max: 60 } },
    { name: t('ldl'), value: labResult?.ldl, reference: { min: 0, max: 100 } },
    { name: t('triglycerides'), value: labResult?.triglycerides, reference: { min: 0, max: 150 } },
  ];

  const glucoseData = [
    { name: t('glucose'), value: labResult?.glucose, reference: { min: 70, max: 100 } },
    { name: t('hemoglobin'), value: labResult?.hemoglobin, reference: { min: 12, max: 17 } },
  ];

  const liverData = [
    { name: t('ast'), value: labResult?.ast, reference: { min: 0, max: 40 } },
    { name: t('alt'), value: labResult?.alt, reference: { min: 0, max: 40 } },
    { name: t('ggt'), value: labResult?.ggt, reference: { min: 0, max: 60 } },
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
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-3xl font-display font-bold text-foreground">{t('dashboard')}</h1>

          {/* Disclaimer */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-warning/10 border border-warning/20">
            <AlertCircle className="w-5 h-5 text-warning shrink-0" />
            <p className="text-sm text-warning">{t('disclaimer')}</p>
          </div>

          {labResult ? (
            <>
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
              <div className="grid lg:grid-cols-3 gap-6">
                <BiomarkerChart title={t('lipidProfile')} data={lipidData} />
                <BiomarkerChart title={t('glucoseMarkers')} data={glucoseData} />
                <BiomarkerChart title={t('liverFunction')} data={liverData} />
              </div>

              {/* Recommendations & Upload */}
              <div className="grid lg:grid-cols-2 gap-6">
                <RecommendationsCard recommendations={labResult.ai_recommendations || []} />
                <LabUploadCard onUploadComplete={fetchData} />
              </div>
            </>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {t('noLabResults')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t('uploadFirst')}</p>
                </CardContent>
              </Card>
              <LabUploadCard onUploadComplete={fetchData} />
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
