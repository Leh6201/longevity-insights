import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Sparkles, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DetectedBiomarker } from '@/hooks/useDynamicBiomarkers';
import { normalizeBiomarkerNameCase } from '@/lib/biomarkerLocalization';

interface SmartSummaryCardProps {
  biomarkers: DetectedBiomarker[];
  hasLabResult: boolean;
  onUploadClick?: () => void;
}

// Dictionary mapping biomarker names to layman-friendly explanations
const laymanTranslations: Record<string, {
  prefix: string;
  meaning: string;
  suggestion: string;
}> = {
  // Glucose & Metabolism
  'glicose': {
    prefix: 'Seu açúcar no sangue',
    meaning: 'o que pode indicar que seu corpo precisa de um pouco mais de atenção com a alimentação',
    suggestion: 'Equilibrar carboidratos e manter atividade física regular costuma ajudar.',
  },
  'insulina': {
    prefix: 'Seu nível de insulina',
    meaning: 'o que pode indicar que seu corpo está tendo mais dificuldade para usar o açúcar',
    suggestion: 'Pequenos ajustes na alimentação e atividade física costumam ajudar.',
  },
  'hemoglobina glicada': {
    prefix: 'Sua hemoglobina glicada',
    meaning: 'que reflete a média do açúcar no sangue nos últimos meses',
    suggestion: 'Mudanças graduais na alimentação podem trazer bons resultados.',
  },
  
  // Lipid Profile
  'colesterol': {
    prefix: 'Seu colesterol',
    meaning: '',
    suggestion: 'Isso é comum e pode melhorar com mudanças simples no dia a dia.',
  },
  'colesterol total': {
    prefix: 'Seu colesterol total',
    meaning: '',
    suggestion: 'Isso é comum e pode melhorar com mudanças simples no dia a dia.',
  },
  'ldl': {
    prefix: 'Seu colesterol LDL (o "ruim")',
    meaning: 'que pode acumular nas artérias com o tempo',
    suggestion: 'Uma alimentação rica em fibras e exercícios podem ajudar.',
  },
  'hdl': {
    prefix: 'Seu colesterol HDL (o "bom")',
    meaning: 'que ajuda a proteger suas artérias',
    suggestion: 'Atividade física regular pode ajudar a aumentar esse nível.',
  },
  'triglicerídeos': {
    prefix: 'As gorduras no seu sangue',
    meaning: '',
    suggestion: 'Reduzir açúcares e carboidratos refinados costuma ajudar.',
  },
  'triglicerideos': {
    prefix: 'As gorduras no seu sangue',
    meaning: '',
    suggestion: 'Reduzir açúcares e carboidratos refinados costuma ajudar.',
  },
  
  // Thyroid
  'tsh': {
    prefix: 'Sua tireoide',
    meaning: 'parece estar trabalhando um pouco diferente do esperado',
    suggestion: 'É uma boa ideia conversar com seu médico para entender melhor.',
  },
  't3': {
    prefix: 'Seu hormônio tireoidiano T3',
    meaning: 'que influencia seu metabolismo e energia',
    suggestion: 'Um acompanhamento médico pode ajudar a equilibrar.',
  },
  't4': {
    prefix: 'Seu hormônio tireoidiano T4',
    meaning: 'que afeta como seu corpo usa energia',
    suggestion: 'Um acompanhamento médico pode ajudar a equilibrar.',
  },
  
  // Liver
  'tgo': {
    prefix: 'Uma enzima do seu fígado (TGO)',
    meaning: 'que pode indicar que o fígado está trabalhando mais do que deveria',
    suggestion: 'Reduzir álcool e alimentos gordurosos pode ajudar.',
  },
  'tgp': {
    prefix: 'Uma enzima do seu fígado (TGP)',
    meaning: 'que pode indicar algum estresse no fígado',
    suggestion: 'Cuidar da alimentação e hidratar bem costuma ajudar.',
  },
  'ast': {
    prefix: 'Uma enzima do seu fígado (AST)',
    meaning: 'que pode indicar que o fígado está trabalhando mais do que deveria',
    suggestion: 'Reduzir álcool e alimentos gordurosos pode ajudar.',
  },
  'alt': {
    prefix: 'Uma enzima do seu fígado (ALT)',
    meaning: 'que pode indicar algum estresse no fígado',
    suggestion: 'Cuidar da alimentação e hidratar bem costuma ajudar.',
  },
  'ggt': {
    prefix: 'Sua GGT',
    meaning: 'uma enzima que pode indicar que o fígado está sobrecarregado',
    suggestion: 'Evitar álcool e cuidar da alimentação geralmente ajuda.',
  },
  
  // Blood
  'hemoglobina': {
    prefix: 'Seu sangue',
    meaning: 'está um pouco fraco para transportar oxigênio, o que pode causar cansaço',
    suggestion: 'Alimentação rica em ferro e uma consulta médica podem ajudar.',
  },
  'hematócrito': {
    prefix: 'A concentração do seu sangue',
    meaning: '',
    suggestion: 'Manter boa hidratação e alimentação balanceada costuma ajudar.',
  },
  'hemácias': {
    prefix: 'Suas células vermelhas do sangue',
    meaning: 'que transportam oxigênio pelo corpo',
    suggestion: 'Uma alimentação rica em ferro pode ajudar.',
  },
  'leucócitos': {
    prefix: 'Suas células de defesa',
    meaning: 'que protegem seu corpo contra infecções',
    suggestion: 'Se houver sintomas, converse com seu médico.',
  },
  'plaquetas': {
    prefix: 'Suas plaquetas',
    meaning: 'que ajudam na coagulação do sangue',
    suggestion: 'Um acompanhamento médico pode esclarecer melhor.',
  },
  
  // Kidney
  'creatinina': {
    prefix: 'Sua creatinina',
    meaning: 'um indicador de como seus rins estão filtrando o sangue',
    suggestion: 'Manter boa hidratação e acompanhar com seu médico é importante.',
  },
  'ureia': {
    prefix: 'Sua ureia',
    meaning: 'que mostra como seus rins estão funcionando',
    suggestion: 'Beber bastante água e uma alimentação equilibrada ajudam.',
  },
  'ácido úrico': {
    prefix: 'Seu ácido úrico',
    meaning: 'que em excesso pode causar desconfortos nas articulações',
    suggestion: 'Reduzir carnes vermelhas e álcool pode ajudar.',
  },
  
  // Vitamins & Minerals
  'vitamina d': {
    prefix: 'Sua vitamina D',
    meaning: 'que é importante para ossos, imunidade e disposição',
    suggestion: 'Pegar sol regularmente e, se necessário, suplementação podem ajudar.',
  },
  'vitamina b12': {
    prefix: 'Sua vitamina B12',
    meaning: 'importante para energia e funcionamento do sistema nervoso',
    suggestion: 'Alimentos de origem animal ou suplementação podem ajudar.',
  },
  'ferro': {
    prefix: 'Seu nível de ferro',
    meaning: 'essencial para a produção de sangue e energia',
    suggestion: 'Alimentos ricos em ferro, como carnes e folhas verdes, podem ajudar.',
  },
  'ferritina': {
    prefix: 'Suas reservas de ferro',
    meaning: '',
    suggestion: 'Uma alimentação balanceada e consulta médica podem orientar melhor.',
  },
  
  // Inflammation
  'pcr': {
    prefix: 'Um marcador de inflamação (PCR)',
    meaning: 'que pode indicar que seu corpo está reagindo a algo',
    suggestion: 'Identificar a causa com seu médico é importante.',
  },
  'proteína c reativa': {
    prefix: 'Um marcador de inflamação',
    meaning: 'que pode indicar que seu corpo está reagindo a algo',
    suggestion: 'Identificar a causa com seu médico é importante.',
  },
  'vhs': {
    prefix: 'Seu VHS',
    meaning: 'um indicador que pode sugerir inflamação no corpo',
    suggestion: 'Conversar com seu médico pode ajudar a entender melhor.',
  },
};

/**
 * Translates an altered biomarker to layman-friendly language
 */
const translateBiomarkerToLayman = (biomarker: DetectedBiomarker): string => {
  const normalizedName = biomarker.name.toLowerCase().trim();
  
  // Check for direct match in dictionary
  for (const [key, translation] of Object.entries(laymanTranslations)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      const isLow = biomarker.value !== null && biomarker.reference_min !== null && 
                    biomarker.value < biomarker.reference_min;
      
      const levelText = isLow ? 'está um pouco abaixo do ideal' : 'está um pouco acima do ideal';
      
      if (translation.meaning) {
        return `${translation.prefix} ${levelText}, ${translation.meaning}. ${translation.suggestion}`;
      } else {
        return `${translation.prefix} ${levelText}. ${translation.suggestion}`;
      }
    }
  }
  
  // Fallback: use AI-generated explanation if available
  if (biomarker.explanation) {
    return simplifyExplanation(biomarker.name, biomarker.explanation);
  }
  
  // Generic fallback
  const displayName = normalizeBiomarkerNameCase(biomarker.name);
  return `Seu exame de ${displayName.toLowerCase()} mostrou um resultado um pouco fora do padrão. Seu médico pode orientar os próximos passos.`;
};

/**
 * Simplifies AI-generated explanation by removing medical jargon
 */
const simplifyExplanation = (name: string, explanation: string): string => {
  // Already in Portuguese and hopefully user-friendly from AI
  // Just ensure it ends with a helpful suggestion if not present
  const hasSuggestion = explanation.includes('pode') || 
                        explanation.includes('ajuda') || 
                        explanation.includes('médico') ||
                        explanation.includes('conversar');
  
  if (!hasSuggestion) {
    return `${explanation} Converse com seu médico para entender melhor.`;
  }
  
  return explanation;
};

const SmartSummaryCard: React.FC<SmartSummaryCardProps> = ({ 
  biomarkers, 
  hasLabResult,
  onUploadClick 
}) => {
  const { t } = useTranslation();

  // Get only altered biomarkers (is_normal = false), limited to 5
  const alteredBiomarkers = biomarkers
    .filter(b => !b.is_normal)
    .slice(0, 5);

  // No lab result uploaded yet
  if (!hasLabResult) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="rounded-2xl shadow-card border-dashed border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-4">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                {t('smartSummaryTitle')}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {t('smartSummaryNoExam')}
              </p>
            </div>
            {onUploadClick && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onUploadClick}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                {t('smartSummaryUploadButton')}
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // All results are normal
  if (alteredBiomarkers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="rounded-2xl shadow-card bg-gradient-to-br from-success/5 via-success/10 to-emerald-500/5 border-success/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 rounded-lg bg-success/20">
                <Sparkles className="w-5 h-5 text-success" />
              </div>
              {t('smartSummaryTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-foreground leading-relaxed">
              {t('smartSummaryAllNormalLayman')}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Has altered biomarkers - translate each one
  const summaryParagraphs = alteredBiomarkers.map(b => translateBiomarkerToLayman(b));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="rounded-2xl shadow-card bg-gradient-to-br from-warning/5 via-warning/10 to-amber-500/5 border-warning/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 rounded-lg bg-warning/20">
              <Sparkles className="w-5 h-5 text-warning" />
            </div>
            {t('smartSummaryTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Optional intro if many altered */}
          {alteredBiomarkers.length > 3 && (
            <p className="text-sm text-muted-foreground">
              {t('smartSummaryIntro')}
            </p>
          )}
          
          {/* Layman explanations */}
          <div className="space-y-3">
            {summaryParagraphs.map((paragraph, index) => (
              <p key={index} className="text-base text-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Closing suggestion */}
          <p className="text-sm text-muted-foreground pt-2 border-t border-border/50">
            {t('smartSummaryClosing')}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SmartSummaryCard;
