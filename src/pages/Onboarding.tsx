import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, ChevronLeft, User, Activity, Target, FileText, Check, Loader2, ArrowLeft } from 'lucide-react';

const steps = [{
  id: 'basic',
  icon: User
}, {
  id: 'lifestyle',
  icon: Activity
}, {
  id: 'goals',
  icon: Target
}, {
  id: 'medical',
  icon: FileText
}];

const Onboarding: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    age: '',
    biological_sex: '',
    weight: '',
    height: '',
    training_frequency: '',
    sleep_quality: '',
    alcohol_consumption: '',
    daily_water_intake: '',
    mental_health_level: 5,
    health_goals: [] as string[],
    current_medications: '',
    medical_history: ''
  });

  // Auth gate: wait for auth to finish loading before deciding to redirect.
  // This prevents /onboarding -> /auth loops on production hard reloads.
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth', { replace: true });
    }
  }, [authLoading, user, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const updateData = (field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleGoal = (goal: string) => {
    setData(prev => ({
      ...prev,
      health_goals: prev.health_goals.includes(goal) ? prev.health_goals.filter(g => g !== goal) : [...prev.health_goals, goal]
    }));
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from('onboarding_data').update({
        ...data,
        age: parseInt(data.age) || null,
        weight: parseFloat(data.weight) || null,
        height: parseFloat(data.height) || null,
        daily_water_intake: parseFloat(data.daily_water_intake) || null,
        completed: true
      }).eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: t('success'),
        description: t('profileSaved')
      });

      // Use hard redirect for production compatibility
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };
  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return data.age && data.biological_sex && data.weight && data.height;
      case 1:
        return data.training_frequency && data.sleep_quality && data.alcohol_consumption;
      case 2:
        return data.health_goals.length > 0;
      default:
        return true;
    }
  };
  const SelectButton = ({
    value,
    selected,
    onClick,
    children
  }: any) => <button type="button" onClick={onClick} className={`p-2 sm:p-3 rounded-xl border-2 transition-all duration-200 text-xs sm:text-sm font-medium whitespace-nowrap flex items-center justify-center text-center w-full ${selected ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50 text-foreground'}`}>
      {children}
    </button>;
  const GoalButton = ({
    goal,
    labelKey
  }: {
    goal: string;
    labelKey: string;
  }) => <button type="button" onClick={() => toggleGoal(goal)} className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-2 sm:gap-3 h-16 sm:h-14 ${data.health_goals.includes(goal) ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
      <div className={`w-5 h-5 min-w-[20px] min-h-[20px] rounded-full border-2 flex items-center justify-center flex-shrink-0 aspect-square ${data.health_goals.includes(goal) ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
        {data.health_goals.includes(goal) && <Check className="w-3 h-3 text-primary-foreground" />}
      </div>
      <span className="flex-1 min-w-0 font-medium text-xs sm:text-sm text-left leading-snug whitespace-normal break-normal">{t(labelKey)}</span>
    </button>;
  return <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      
      {/* Back Button */}
      <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-20" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-5 h-5" />
      </Button>
      
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="w-full max-w-2xl relative z-10">
        <Card className="glass border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-display">{t('onboardingTitle')}</CardTitle>
            <CardDescription>{t(`${steps[currentStep].id}Info` as any) || t('basicInfo')}</CardDescription>
            
            {/* Progress */}
            <div className="flex justify-center gap-2 mt-6">
              {steps.map((step, idx) => {
              const Icon = step.icon;
              return <div key={step.id} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${idx === currentStep ? 'gradient-primary shadow-glow' : idx < currentStep ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                    <Icon className="w-5 h-5" />
                  </div>;
            })}
            </div>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} initial={{
              opacity: 0,
              x: 20
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: -20
            }} transition={{
              duration: 0.3
            }} className="space-y-6">
                {currentStep === 0 && <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t('age')}</Label>
                        <Input type="number" value={data.age} onChange={e => updateData('age', e.target.value)} placeholder="30" />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('biologicalSex')}</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <SelectButton selected={data.biological_sex === 'male'} onClick={() => updateData('biological_sex', 'male')} className="text-center">
                            {t('male')}
                          </SelectButton>
                          <SelectButton selected={data.biological_sex === 'female'} onClick={() => updateData('biological_sex', 'female')}>
                            {t('female')}
                          </SelectButton>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t('weight')}</Label>
                        <Input type="number" value={data.weight} onChange={e => updateData('weight', e.target.value)} placeholder="70" />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('height')}</Label>
                        <Input type="number" value={data.height} onChange={e => updateData('height', e.target.value)} placeholder="175" />
                      </div>
                    </div>
                  </>}

                {currentStep === 1 && <>
                    <div className="space-y-3">
                      <Label>{t('trainingFrequency')}</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {['0', '1-2', '3-4', '5+'].map((freq, idx) => <SelectButton key={freq} selected={data.training_frequency === freq} onClick={() => updateData('training_frequency', freq)}>
                            {t(`training${idx}` as any)}
                          </SelectButton>)}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label>{t('sleepQuality')}</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {['poor', 'average', 'good'].map(quality => <SelectButton key={quality} selected={data.sleep_quality === quality} onClick={() => updateData('sleep_quality', quality)}>
                            {t(`sleep${quality.charAt(0).toUpperCase() + quality.slice(1)}` as any)}
                          </SelectButton>)}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label>{t('alcoholConsumption')}</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {['none', 'low', 'moderate', 'high'].map(level => <SelectButton key={level} selected={data.alcohol_consumption === level} onClick={() => updateData('alcohol_consumption', level)}>
                            {t(`alcohol${level.charAt(0).toUpperCase() + level.slice(1)}` as any)}
                          </SelectButton>)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t('dailyWater')}</Label>
                        <Input type="number" step="0.1" value={data.daily_water_intake} onChange={e => updateData('daily_water_intake', e.target.value)} placeholder="2.0" />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('mentalHealth')}</Label>
                        <Input type="number" min={1} max={10} value={data.mental_health_level} onChange={e => updateData('mental_health_level', parseInt(e.target.value))} />
                      </div>
                    </div>
                  </>}

                {currentStep === 2 && <div className="space-y-3">
                    <Label>{t('selectGoals')}</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <GoalButton goal="lose_weight" labelKey="loseWeight" />
                      <GoalButton goal="improve_energy" labelKey="improveEnergy" />
                      <GoalButton goal="improve_sleep" labelKey="improveSleep" />
                      <GoalButton goal="reduce_cholesterol" labelKey="reduceCholesterol" />
                      <GoalButton goal="reduce_blood_sugar" labelKey="reduceBloodSugar" />
                      <GoalButton goal="increase_longevity" labelKey="increaseLongevity" />
                    </div>
                  </div>}

                {currentStep === 3 && <>
                    <div className="space-y-2">
                      <Label>{t('currentMedications')}</Label>
                      <Textarea value={data.current_medications} onChange={e => updateData('current_medications', e.target.value)} placeholder={t('medicationsPlaceholder')} rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('medicalHistoryLabel')}</Label>
                      <Textarea value={data.medical_history} onChange={e => updateData('medical_history', e.target.value)} placeholder={t('medicalHistoryPlaceholder')} rows={3} />
                    </div>
                  </>}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setCurrentStep(prev => prev - 1)} disabled={currentStep === 0}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                {t('back')}
              </Button>

              {currentStep < steps.length - 1 ? <Button onClick={() => setCurrentStep(prev => prev + 1)} disabled={!canProceed()}>
                  {t('next')}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button> : <Button onClick={handleComplete} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('complete')}
                </Button>}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>;
};
export default Onboarding;