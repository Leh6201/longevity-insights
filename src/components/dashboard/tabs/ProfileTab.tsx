import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  User, 
  Activity, 
  Target, 
  ChevronRight,
  Settings,
  FileText,
  Scale,
  Ruler,
  Calendar,
  Droplets,
  Moon,
  Dumbbell,
  Wine,
  Brain,
  Edit3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface OnboardingData {
  age?: number | null;
  weight?: number | null;
  height?: number | null;
  daily_water_intake?: number | null;
  mental_health_level?: number | null;
  health_goals?: string[] | null;
  training_frequency?: string | null;
  sleep_quality?: string | null;
  alcohol_consumption?: string | null;
  biological_sex?: string | null;
}

interface ProfileTabProps {
  onboardingData: OnboardingData | null;
  userName?: string;
  isGuest: boolean;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ onboardingData, userName, isGuest }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getTrainingLabel = (freq: string | null | undefined) => {
    if (!freq) return '--';
    const labels: Record<string, string> = {
      '0': t('training0'),
      '1-2': t('training1'),
      '3-4': t('training2'),
      '5+': t('training3'),
    };
    return labels[freq] || freq;
  };

  const getSleepLabel = (quality: string | null | undefined) => {
    if (!quality) return '--';
    const labels: Record<string, string> = {
      'poor': t('sleepPoor'),
      'average': t('sleepAverage'),
      'good': t('sleepGood'),
    };
    return labels[quality] || quality;
  };

  const getAlcoholLabel = (level: string | null | undefined) => {
    if (!level) return '--';
    const labels: Record<string, string> = {
      'none': t('alcoholNone'),
      'low': t('alcoholLow'),
      'moderate': t('alcoholModerate'),
      'high': t('alcoholHigh'),
    };
    return labels[level] || level;
  };

  const getSexLabel = (sex: string | null | undefined) => {
    if (!sex) return '--';
    return sex === 'male' ? t('male') : t('female');
  };

  const getGoalLabel = (goal: string) => {
    const goalLabels: Record<string, string> = {
      'lose_weight': t('loseWeight'),
      'improve_energy': t('improveEnergy'),
      'improve_sleep': t('improveSleep'),
      'reduce_cholesterol': t('reduceCholesterol'),
      'reduce_blood_sugar': t('reduceBloodSugar'),
      'increase_longevity': t('increaseLongevity'),
    };
    return goalLabels[goal] || goal;
  };

  const ProfileItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number | null | undefined }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground">{value ?? '--'}</span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* User Info Card */}
      <Card className="rounded-2xl shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{userName || t('guest')}</CardTitle>
                <CardDescription>
                  {isGuest ? t('guestMode') : t('profile')}
                </CardDescription>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/edit-profile')}
              className="gap-2"
            >
              <Edit3 className="w-4 h-4" />
              {t('edit')}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Basic Info */}
      <Card className="rounded-2xl shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="w-4 h-4" />
            {t('basicInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <ProfileItem icon={Calendar} label={t('age')} value={onboardingData?.age ? `${onboardingData.age} ${t('yearsOld')}` : undefined} />
          <ProfileItem icon={User} label={t('biologicalSex')} value={getSexLabel(onboardingData?.biological_sex)} />
          <ProfileItem icon={Scale} label={t('weight')} value={onboardingData?.weight ? `${onboardingData.weight} kg` : undefined} />
          <ProfileItem icon={Ruler} label={t('height')} value={onboardingData?.height ? `${onboardingData.height} cm` : undefined} />
        </CardContent>
      </Card>

      {/* Lifestyle */}
      <Card className="rounded-2xl shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="w-4 h-4" />
            {t('lifestyle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <ProfileItem icon={Dumbbell} label={t('trainingFrequency')} value={getTrainingLabel(onboardingData?.training_frequency)} />
          <ProfileItem icon={Moon} label={t('sleepQuality')} value={getSleepLabel(onboardingData?.sleep_quality)} />
          <ProfileItem icon={Wine} label={t('alcoholConsumption')} value={getAlcoholLabel(onboardingData?.alcohol_consumption)} />
          <ProfileItem icon={Droplets} label={t('dailyWater')} value={onboardingData?.daily_water_intake ? `${onboardingData.daily_water_intake} L` : undefined} />
          <ProfileItem icon={Brain} label={t('mentalHealth')} value={onboardingData?.mental_health_level ? `${onboardingData.mental_health_level}/10` : undefined} />
        </CardContent>
      </Card>

      {/* Health Goals */}
      {onboardingData?.health_goals && onboardingData.health_goals.length > 0 && (
        <Card className="rounded-2xl shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="w-4 h-4" />
              {t('healthGoals')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {onboardingData.health_goals.map((goal) => (
                <span 
                  key={goal}
                  className="px-3 py-1.5 text-sm rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  {getGoalLabel(goal)}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="rounded-2xl shadow-card">
        <CardContent className="p-0">
          <button
            onClick={() => navigate('/edit-profile')}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">{t('editHealthData')}</p>
                <p className="text-sm text-muted-foreground">{t('updateYourInfo')}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <Separator />
          <button
            onClick={() => navigate('/settings')}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">{t('settings')}</p>
                <p className="text-sm text-muted-foreground">{t('appPreferences')}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileTab;
