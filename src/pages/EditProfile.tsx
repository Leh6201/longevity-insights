import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useGuest } from '@/contexts/GuestContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, User, Activity, Target, FileText, AlertTriangle, Check } from 'lucide-react';

const EditProfile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isGuest, guestOnboarding, setGuestOnboarding } = useGuest();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userName, setUserName] = useState('');
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
    medical_history: '',
  });

  useEffect(() => {
    if (isGuest && guestOnboarding) {
      setData({
        age: guestOnboarding.age?.toString() || '',
        biological_sex: guestOnboarding.biological_sex || '',
        weight: guestOnboarding.weight?.toString() || '',
        height: guestOnboarding.height?.toString() || '',
        training_frequency: guestOnboarding.training_frequency || '',
        sleep_quality: guestOnboarding.sleep_quality || '',
        alcohol_consumption: guestOnboarding.alcohol_consumption || '',
        daily_water_intake: guestOnboarding.daily_water_intake?.toString() || '',
        mental_health_level: guestOnboarding.mental_health_level || 5,
        health_goals: guestOnboarding.health_goals || [],
        current_medications: guestOnboarding.current_medications || '',
        medical_history: guestOnboarding.medical_history || '',
      });
    } else if (user) {
      fetchData();
    }
  }, [user, isGuest, guestOnboarding]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Fetch profile name
      const { data: profileData } = await supabase
        .from('profiles')
        .select('name')
        .eq('user_id', user.id)
        .single();

      if (profileData?.name) {
        setUserName(profileData.name);
      }

      // Fetch onboarding data
      const { data: onboardingData } = await supabase
        .from('onboarding_data')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (onboardingData) {
        setData({
          age: onboardingData.age?.toString() || '',
          biological_sex: onboardingData.biological_sex || '',
          weight: onboardingData.weight?.toString() || '',
          height: onboardingData.height?.toString() || '',
          training_frequency: onboardingData.training_frequency || '',
          sleep_quality: onboardingData.sleep_quality || '',
          alcohol_consumption: onboardingData.alcohol_consumption || '',
          daily_water_intake: onboardingData.daily_water_intake?.toString() || '',
          mental_health_level: onboardingData.mental_health_level || 5,
          health_goals: onboardingData.health_goals || [],
          current_medications: onboardingData.current_medications || '',
          medical_history: onboardingData.medical_history || '',
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateData = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleGoal = (goal: string) => {
    setData(prev => ({
      ...prev,
      health_goals: prev.health_goals.includes(goal)
        ? prev.health_goals.filter(g => g !== goal)
        : [...prev.health_goals, goal],
    }));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      if (isGuest) {
        setGuestOnboarding({
          age: parseInt(data.age) || null,
          biological_sex: data.biological_sex || null,
          weight: parseFloat(data.weight) || null,
          height: parseFloat(data.height) || null,
          training_frequency: data.training_frequency || null,
          sleep_quality: data.sleep_quality || null,
          alcohol_consumption: data.alcohol_consumption || null,
          daily_water_intake: parseFloat(data.daily_water_intake) || null,
          mental_health_level: data.mental_health_level,
          health_goals: data.health_goals,
          current_medications: data.current_medications || null,
          medical_history: data.medical_history || null,
          completed: true,
        });
        toast({ title: t('success'), description: t('profileUpdated') });
        navigate('/dashboard');
        return;
      }

      if (!user) return;

      // Save name to profile
      if (userName.trim()) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            name: userName.trim(),
            updated_at: new Date().toISOString() 
          })
          .eq('user_id', user.id);

        if (profileError) throw profileError;
      }

      // Save onboarding data
      const { error } = await supabase
        .from('onboarding_data')
        .update({
          age: parseInt(data.age) || null,
          biological_sex: data.biological_sex || null,
          weight: parseFloat(data.weight) || null,
          height: parseFloat(data.height) || null,
          training_frequency: data.training_frequency || null,
          sleep_quality: data.sleep_quality || null,
          alcohol_consumption: data.alcohol_consumption || null,
          daily_water_intake: parseFloat(data.daily_water_intake) || null,
          mental_health_level: data.mental_health_level,
          health_goals: data.health_goals,
          current_medications: data.current_medications || null,
          medical_history: data.medical_history || null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({ title: t('success'), description: t('profileUpdated') });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const SelectButton = ({ value, selected, onClick, children }: any) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
        selected
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border hover:border-primary/50 text-foreground'
      }`}
    >
      {children}
    </button>
  );

  const GoalButton = ({ goal, labelKey }: { goal: string; labelKey: string }) => (
    <button
      type="button"
      onClick={() => toggleGoal(goal)}
      className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
        data.health_goals.includes(goal)
          ? 'border-primary bg-primary/10'
          : 'border-border hover:border-primary/50'
      }`}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
        data.health_goals.includes(goal) ? 'border-primary bg-primary' : 'border-muted-foreground'
      }`}>
        {data.health_goals.includes(goal) && <Check className="w-3 h-3 text-primary-foreground" />}
      </div>
      <span className="font-medium">{t(labelKey)}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto h-full flex items-center px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="ml-4 text-lg font-semibold">{t('editHealthData')}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Basic Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {t('basicInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('name')}</Label>
                <Input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder={t('namePlaceholder')}
                />
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <p className="text-xs text-warning">{t('ageWarning')}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('age')}</Label>
                  <Input
                    type="number"
                    value={data.age}
                    onChange={(e) => updateData('age', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('biologicalSex')}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <SelectButton
                      selected={data.biological_sex === 'male'}
                      onClick={() => updateData('biological_sex', 'male')}
                    >
                      {t('male')}
                    </SelectButton>
                    <SelectButton
                      selected={data.biological_sex === 'female'}
                      onClick={() => updateData('biological_sex', 'female')}
                    >
                      {t('female')}
                    </SelectButton>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('weight')}</Label>
                  <Input
                    type="number"
                    value={data.weight}
                    onChange={(e) => updateData('weight', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('height')}</Label>
                  <Input
                    type="number"
                    value={data.height}
                    onChange={(e) => updateData('height', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lifestyle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {t('lifestyle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>{t('trainingFrequency')}</Label>
                <div className="grid grid-cols-4 gap-2">
                  {['0', '1-2', '3-4', '5+'].map((freq, idx) => (
                    <SelectButton
                      key={freq}
                      selected={data.training_frequency === freq}
                      onClick={() => updateData('training_frequency', freq)}
                    >
                      {t(`training${idx}` as any)}
                    </SelectButton>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label>{t('sleepQuality')}</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['poor', 'average', 'good'].map((quality) => (
                    <SelectButton
                      key={quality}
                      selected={data.sleep_quality === quality}
                      onClick={() => updateData('sleep_quality', quality)}
                    >
                      {t(`sleep${quality.charAt(0).toUpperCase() + quality.slice(1)}` as any)}
                    </SelectButton>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label>{t('alcoholConsumption')}</Label>
                <div className="grid grid-cols-4 gap-2">
                  {['none', 'low', 'moderate', 'high'].map((level) => (
                    <SelectButton
                      key={level}
                      selected={data.alcohol_consumption === level}
                      onClick={() => updateData('alcohol_consumption', level)}
                    >
                      {t(`alcohol${level.charAt(0).toUpperCase() + level.slice(1)}` as any)}
                    </SelectButton>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('dailyWater')}</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={data.daily_water_intake}
                    onChange={(e) => updateData('daily_water_intake', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('mentalHealth')}</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={data.mental_health_level}
                    onChange={(e) => updateData('mental_health_level', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                {t('healthGoals')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <GoalButton goal="lose_weight" labelKey="loseWeight" />
                <GoalButton goal="improve_energy" labelKey="improveEnergy" />
                <GoalButton goal="improve_sleep" labelKey="improveSleep" />
                <GoalButton goal="reduce_cholesterol" labelKey="reduceCholesterol" />
                <GoalButton goal="reduce_blood_sugar" labelKey="reduceBloodSugar" />
                <GoalButton goal="increase_longevity" labelKey="increaseLongevity" />
              </div>
            </CardContent>
          </Card>

          {/* Medical Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t('medicalHistory')}
              </CardTitle>
              <CardDescription>{t('biomarkersNotEditable')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('currentMedications')}</Label>
                <Textarea
                  value={data.current_medications}
                  onChange={(e) => updateData('current_medications', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('medicalHistoryLabel')}</Label>
                <Textarea
                  value={data.medical_history}
                  onChange={(e) => updateData('medical_history', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="w-full" size="lg" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {t('saveChanges')}
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default EditProfile;
