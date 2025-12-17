import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Lightbulb, 
  TrendingUp, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  Heart,
  Apple,
  Footprints,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import PremiumBadge from '@/components/PremiumBadge';

interface Recommendation {
  title: string;
  meaning: string;
  impact: string;
  actions: string[];
  icon: 'heart' | 'apple' | 'footprints' | 'sparkles';
  priority: 'high' | 'medium' | 'low';
}

interface PersonalizedRecommendationsSectionProps {
  recommendations: string[];
  isPremiumUser?: boolean;
}

const iconMap = {
  heart: Heart,
  apple: Apple,
  footprints: Footprints,
  sparkles: Sparkles,
};

const priorityColors = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  low: 'bg-primary/10 text-primary border-primary/20',
};

// Parse AI recommendations into structured format
const parseRecommendations = (rawRecommendations: string[]): Recommendation[] => {
  const icons: Array<'heart' | 'apple' | 'footprints' | 'sparkles'> = ['heart', 'apple', 'footprints', 'sparkles'];
  const priorities: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
  
  return rawRecommendations.slice(0, 5).map((rec, index) => {
    // Extract key information from the recommendation
    const sentences = rec.split(/[.!?]+/).filter(s => s.trim());
    
    return {
      title: sentences[0]?.trim().slice(0, 80) || 'Recomendação',
      meaning: sentences[0]?.trim() || rec,
      impact: sentences[1]?.trim() || 'Pode contribuir para melhorar sua saúde geral e bem-estar.',
      actions: sentences.slice(2).map(s => s.trim()).filter(s => s.length > 0).slice(0, 2) || 
        ['Consulte um profissional de saúde para orientação personalizada'],
      icon: icons[index % icons.length],
      priority: index < 2 ? priorities[0] : index < 4 ? priorities[1] : priorities[2],
    };
  });
};

const PersonalizedRecommendationsSection: React.FC<PersonalizedRecommendationsSectionProps> = ({
  recommendations,
  isPremiumUser = false,
}) => {
  const navigate = useNavigate();
  const structuredRecommendations = parseRecommendations(recommendations);

  if (!isPremiumUser) {
    return (
      <Card className="overflow-hidden min-w-0">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Recomendações Personalizadas
            </CardTitle>
            <PremiumBadge />
          </div>
        </CardHeader>
        <CardContent className="relative">
          {/* Blurred Preview */}
          <div className="blur-sm pointer-events-none select-none space-y-4">
            {[1, 2, 3].map((_, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-muted/50 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
                <div className="h-3 bg-muted/70 rounded w-full" />
                <div className="h-3 bg-muted/70 rounded w-2/3" />
              </div>
            ))}
          </div>

          {/* Lock Overlay */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px] cursor-pointer"
            onClick={() => navigate('/premium')}
          >
            <div className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground text-lg">
                  Desbloqueie Análises Detalhadas
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Receba explicações completas sobre seus resultados, impactos na saúde e ações práticas personalizadas.
                </p>
              </div>
              <Button className="mt-2">
                Ver Planos Premium
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden min-w-0">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            Recomendações Personalizadas
          </CardTitle>
          <PremiumBadge />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Análise detalhada dos seus resultados com orientações práticas para sua saúde.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {structuredRecommendations.length > 0 ? (
          structuredRecommendations.map((rec, idx) => {
            const IconComponent = iconMap[rec.icon];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-xl border bg-card p-4 space-y-3"
              >
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${priorityColors[rec.priority]}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColors[rec.priority]}`}>
                        {rec.priority === 'high' ? 'Prioridade Alta' : rec.priority === 'medium' ? 'Prioridade Média' : 'Manutenção'}
                      </span>
                    </div>
                    <h4 className="font-medium text-foreground text-sm line-clamp-2">
                      {rec.title}
                    </h4>
                  </div>
                </div>

                {/* Meaning Section */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Lightbulb className="w-3.5 h-3.5" />
                    O que isso significa
                  </div>
                  <p className="text-sm text-foreground/80 pl-5">
                    {rec.meaning}
                  </p>
                </div>

                {/* Impact Section */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Impacto potencial
                  </div>
                  <p className="text-sm text-foreground/80 pl-5">
                    {rec.impact}
                  </p>
                </div>

                {/* Actions Section */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Próximos passos
                  </div>
                  <ul className="space-y-1 pl-5">
                    {rec.actions.length > 0 ? (
                      rec.actions.map((action, actionIdx) => (
                        <li key={actionIdx} className="text-sm text-foreground/80 flex items-start gap-2">
                          <ChevronRight className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-foreground/80 flex items-start gap-2">
                        <ChevronRight className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                        <span>Mantenha hábitos saudáveis e acompanhe regularmente</span>
                      </li>
                    )}
                  </ul>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              Faça upload do seu exame para receber recomendações personalizadas.
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            ⚠️ Estas recomendações são educacionais e não substituem orientação médica profissional.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedRecommendationsSection;
