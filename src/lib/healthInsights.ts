// Health Insights Generator
// Uses onboarding data to generate personalized insights and contextual recommendations

export interface OnboardingData {
  age: number | null;
  biological_sex: string | null;
  weight: number | null;
  height: number | null;
  training_frequency: string | null;
  sleep_quality: string | null;
  alcohol_consumption: string | null;
  daily_water_intake: number | null;
  mental_health_level: number | null;
  health_goals: string[];
  current_medications: string | null;
  medical_history: string | null;
}

export interface HealthInsight {
  id: string;
  type: 'info' | 'tip' | 'warning' | 'goal';
  icon: string;
  title: string;
  description: string;
  category: 'bmi' | 'hydration' | 'lifestyle' | 'goals' | 'context';
}

// Calculate BMI and return category
export const calculateBMI = (weight: number | null, height: number | null): { value: number | null; category: string } => {
  if (!weight || !height || height === 0) return { value: null, category: 'unknown' };
  
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  let category: string;
  if (bmi < 18.5) category = 'underweight';
  else if (bmi < 25) category = 'normal';
  else if (bmi < 30) category = 'overweight';
  else category = 'obese';
  
  return { value: Math.round(bmi * 10) / 10, category };
};

// Calculate recommended water intake based on weight and activity level
export const calculateRecommendedWater = (weight: number | null, trainingFrequency: string | null): number | null => {
  if (!weight) return null;
  
  // Base recommendation: 30-35ml per kg of body weight
  let baseWater = weight * 0.033;
  
  // Adjust for activity level
  switch (trainingFrequency) {
    case '5+': baseWater *= 1.3; break;
    case '3-4': baseWater *= 1.2; break;
    case '1-2': baseWater *= 1.1; break;
    default: break;
  }
  
  return Math.round(baseWater * 10) / 10;
};

// Generate health insights based on onboarding data
export const generateHealthInsights = (data: OnboardingData, t: (key: string, params?: Record<string, unknown>) => string): HealthInsight[] => {
  const insights: HealthInsight[] = [];
  
  // BMI Insight
  const bmi = calculateBMI(data.weight, data.height);
  if (bmi.value !== null) {
    insights.push({
      id: 'bmi',
      type: bmi.category === 'normal' ? 'info' : 'tip',
      icon: bmi.category === 'normal' ? 'check-circle' : 'scale',
      title: t('bmiInsight'),
      description: t(`bmi${bmi.category.charAt(0).toUpperCase() + bmi.category.slice(1)}Desc`, { value: bmi.value }),
      category: 'bmi',
    });
  }
  
  // Hydration Insight
  const recommendedWater = calculateRecommendedWater(data.weight, data.training_frequency);
  if (recommendedWater !== null && data.daily_water_intake !== null) {
    const hydrationLevel = data.daily_water_intake / recommendedWater;
    const isWellHydrated = hydrationLevel >= 0.9;
    
    insights.push({
      id: 'hydration',
      type: isWellHydrated ? 'info' : 'tip',
      icon: isWellHydrated ? 'droplets' : 'droplet',
      title: t('hydrationInsight'),
      description: isWellHydrated 
        ? t('hydrationGoodDesc')
        : t('hydrationLowDesc', { recommended: recommendedWater }),
      category: 'hydration',
    });
  }
  
  // Sleep Quality Insight
  if (data.sleep_quality) {
    const isSleepGood = data.sleep_quality === 'good';
    insights.push({
      id: 'sleep',
      type: isSleepGood ? 'info' : 'tip',
      icon: isSleepGood ? 'moon' : 'bed',
      title: t('sleepInsight'),
      description: t(`sleep${data.sleep_quality.charAt(0).toUpperCase() + data.sleep_quality.slice(1)}Insight`),
      category: 'lifestyle',
    });
  }
  
  // Training Frequency Insight
  if (data.training_frequency) {
    const isActiveEnough = data.training_frequency === '3-4' || data.training_frequency === '5+';
    insights.push({
      id: 'activity',
      type: isActiveEnough ? 'info' : 'tip',
      icon: isActiveEnough ? 'flame' : 'footprints',
      title: t('activityInsight'),
      description: t(`activity${data.training_frequency.replace('-', 'to').replace('+', 'plus')}Desc`),
      category: 'lifestyle',
    });
  }
  
  // Alcohol Consumption Insight (only show if moderate or high)
  if (data.alcohol_consumption && (data.alcohol_consumption === 'moderate' || data.alcohol_consumption === 'high')) {
    insights.push({
      id: 'alcohol',
      type: 'warning',
      icon: 'wine',
      title: t('alcoholInsight'),
      description: t('alcoholConsiderationDesc'),
      category: 'lifestyle',
    });
  }
  
  // Mental Health Insight
  if (data.mental_health_level !== null) {
    const mentalHealthGood = data.mental_health_level >= 7;
    if (!mentalHealthGood) {
      insights.push({
        id: 'mental',
        type: 'tip',
        icon: 'brain',
        title: t('mentalHealthInsight'),
        description: t('mentalHealthSupportDesc'),
        category: 'lifestyle',
      });
    }
  }
  
  // Health Goals Insights
  if (data.health_goals && data.health_goals.length > 0) {
    const primaryGoal = data.health_goals[0];
    insights.push({
      id: 'goal-primary',
      type: 'goal',
      icon: 'target',
      title: t('primaryGoalFocus'),
      description: t(`${primaryGoal}GoalInsight`),
      category: 'goals',
    });
  }
  
  // Medical Context Insight (if medications or history exists)
  if (data.current_medications || data.medical_history) {
    insights.push({
      id: 'medical-context',
      type: 'info',
      icon: 'stethoscope',
      title: t('medicalContextNote'),
      description: t('medicalContextDesc'),
      category: 'context',
    });
  }
  
  return insights;
};

// Generate context string for AI analysis
export const generateAIContext = (data: OnboardingData): string => {
  const context: string[] = [];
  
  // Basic info
  if (data.age) context.push(`Idade: ${data.age} anos`);
  if (data.biological_sex) context.push(`Sexo biológico: ${data.biological_sex === 'male' ? 'masculino' : 'feminino'}`);
  
  // BMI
  const bmi = calculateBMI(data.weight, data.height);
  if (bmi.value) {
    context.push(`IMC: ${bmi.value} (${bmi.category})`);
    if (data.weight) context.push(`Peso: ${data.weight}kg`);
    if (data.height) context.push(`Altura: ${data.height}cm`);
  }
  
  // Lifestyle
  if (data.training_frequency) {
    const trainingLabels: Record<string, string> = {
      '0': 'sedentário',
      '1-2': '1-2 vezes por semana',
      '3-4': '3-4 vezes por semana',
      '5+': '5+ vezes por semana (muito ativo)',
    };
    context.push(`Atividade física: ${trainingLabels[data.training_frequency] || data.training_frequency}`);
  }
  
  if (data.sleep_quality) {
    const sleepLabels: Record<string, string> = {
      'poor': 'ruim',
      'average': 'média',
      'good': 'boa',
    };
    context.push(`Qualidade do sono: ${sleepLabels[data.sleep_quality] || data.sleep_quality}`);
  }
  
  if (data.alcohol_consumption) {
    const alcoholLabels: Record<string, string> = {
      'none': 'não consome',
      'low': 'baixo',
      'moderate': 'moderado',
      'high': 'alto',
    };
    context.push(`Consumo de álcool: ${alcoholLabels[data.alcohol_consumption] || data.alcohol_consumption}`);
  }
  
  if (data.daily_water_intake) {
    context.push(`Consumo de água: ${data.daily_water_intake}L por dia`);
  }
  
  if (data.mental_health_level !== null) {
    context.push(`Nível de saúde mental auto-reportado: ${data.mental_health_level}/10`);
  }
  
  // Health goals
  if (data.health_goals && data.health_goals.length > 0) {
    const goalLabels: Record<string, string> = {
      'lose_weight': 'perder peso',
      'improve_energy': 'melhorar energia',
      'improve_sleep': 'melhorar sono',
      'reduce_cholesterol': 'reduzir colesterol',
      'reduce_blood_sugar': 'reduzir açúcar no sangue',
      'increase_longevity': 'aumentar longevidade',
    };
    const goals = data.health_goals.map(g => goalLabels[g] || g).join(', ');
    context.push(`Objetivos de saúde: ${goals}`);
  }
  
  // Medical context
  if (data.current_medications) {
    context.push(`Medicamentos atuais: ${data.current_medications}`);
  }
  
  if (data.medical_history) {
    context.push(`Histórico médico: ${data.medical_history}`);
  }
  
  return context.join('\n');
};
