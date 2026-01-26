import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Activity, ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import BiomarkerProgressCard from './BiomarkerProgressCard';
import DescriptiveBiomarkerCard from './DescriptiveBiomarkerCard';
import {
  DetectedBiomarker,
  calculateBiomarkerPercentage,
  isDescriptiveBiomarker,
  getBiomarkerDisplayValue,
} from '@/hooks/useDynamicBiomarkers';
import { translateBiomarkerName } from '@/lib/biomarkerLocalization';

interface DynamicBiomarkersListProps {
  biomarkers: DetectedBiomarker[];
  loading: boolean;
}

const DynamicBiomarkersList: React.FC<DynamicBiomarkersListProps> = ({
  biomarkers,
  loading,
}) => {
  const { t } = useTranslation();
  const [attentionOpen, setAttentionOpen] = React.useState(true);
  const [normalOpen, setNormalOpen] = React.useState(true);

  if (loading) {
    return (
      <Card className="rounded-2xl shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t('biomarkers')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-2 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (biomarkers.length === 0) {
    return (
      <Card className="rounded-2xl shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5" />
            {t('biomarkers')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              {t('noBiomarkersDetected')}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t('noBiomarkersDescription')}
            </p>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  // Group biomarkers by status - UI driven ONLY by is_normal from database
  const attentionBiomarkers = biomarkers.filter(b => !b.is_normal);
  const normalBiomarkers = biomarkers.filter(b => b.is_normal);

  const renderBiomarkerItem = (biomarker: DetectedBiomarker, index: number, baseDelay: number) => {
    // Get AI-generated display value
    const displayValue = getBiomarkerDisplayValue(biomarker);
    
    if (isDescriptiveBiomarker(biomarker)) {
      return (
        <DescriptiveBiomarkerCard
          key={biomarker.id}
          name={biomarker.name}
          value={displayValue}
          isNormal={biomarker.is_normal}
          explanation={biomarker.explanation}
          delay={baseDelay + index * 0.05}
        />
      );
    }
    
    return (
      <BiomarkerProgressCard
        key={biomarker.id}
        name={translateBiomarkerName(biomarker.name)}
        percentage={calculateBiomarkerPercentage(
          biomarker.value,
          biomarker.reference_min,
          biomarker.reference_max
        )}
        isNormal={biomarker.is_normal}
        delay={baseDelay + index * 0.05}
        infoText={biomarker.explanation || formatNumericBiomarkerInfo(biomarker)}
      />
    );
  };

  return (
    <div className="space-y-4">
      {/* Attention Section */}
      {attentionBiomarkers.length > 0 && (
        <Card className="rounded-2xl shadow-card overflow-hidden min-w-0 border-warning/30">
          <Collapsible open={attentionOpen} onOpenChange={setAttentionOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-2 cursor-pointer hover:bg-muted/30 transition-colors">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-warning" />
                    </div>
                    <span>Atenção</span>
                    <span className="text-sm font-normal text-warning">
                      ({attentionBiomarkers.length})
                    </span>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
                      attentionOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3 pt-0">
                {attentionBiomarkers.map((biomarker, index) => 
                  renderBiomarkerItem(biomarker, index, 0)
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {/* Normal Section */}
      {normalBiomarkers.length > 0 && (
        <Card className="rounded-2xl shadow-card overflow-hidden min-w-0">
          <Collapsible open={normalOpen} onOpenChange={setNormalOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-2 cursor-pointer hover:bg-muted/30 transition-colors">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span>Normal</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      ({normalBiomarkers.length})
                    </span>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
                      normalOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3 pt-0">
                {normalBiomarkers.map((biomarker, index) => 
                  renderBiomarkerItem(biomarker, index, 0.1)
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {/* Summary Card */}
      <Card className="rounded-2xl shadow-card bg-gradient-to-br from-card to-muted/30">
        <CardContent className="py-4">
          <div className="flex items-center justify-around">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {normalBiomarkers.length}
                </p>
                <p className="text-xs text-muted-foreground">{t('normal')}</p>
              </div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">
                  {attentionBiomarkers.length}
                </p>
                <p className="text-xs text-muted-foreground">{t('attention')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Fallback helper for numeric biomarker info when AI explanation is missing
const formatNumericBiomarkerInfo = (biomarker: DetectedBiomarker): string => {
  const parts: string[] = [];
  
  parts.push(`Valor: ${biomarker.value}${biomarker.unit ? ` ${biomarker.unit}` : ''}`);
  
  if (biomarker.reference_min !== null && biomarker.reference_max !== null) {
    parts.push(`Referência: ${biomarker.reference_min} - ${biomarker.reference_max}${biomarker.unit ? ` ${biomarker.unit}` : ''}`);
  }
  
  parts.push(biomarker.is_normal ? 'Status: Normal ✓' : 'Status: Atenção ⚠');
  
  return parts.join('\n');
};

export default DynamicBiomarkersList;
