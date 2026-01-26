import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Activity } from 'lucide-react';
import BiomarkerProgressCard from './BiomarkerProgressCard';
import DescriptiveBiomarkerCard from './DescriptiveBiomarkerCard';
import {
  DetectedBiomarker,
  groupBiomarkersByCategory,
  getCategoryDisplayName,
  calculateBiomarkerPercentage,
  isDescriptiveBiomarker,
  getBiomarkerDisplayValue,
} from '@/hooks/useDynamicBiomarkers';
import { 
  translateBiomarkerName, 
  getBiomarkerExplanation 
} from '@/lib/biomarkerLocalization';

interface DynamicBiomarkersListProps {
  biomarkers: DetectedBiomarker[];
  loading: boolean;
}

const DynamicBiomarkersList: React.FC<DynamicBiomarkersListProps> = ({
  biomarkers,
  loading,
}) => {
  const { t } = useTranslation();

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

  const groupedBiomarkers = groupBiomarkersByCategory(biomarkers);
  const categories = Object.keys(groupedBiomarkers);

  // Separate numeric and descriptive biomarkers for counting
  const numericBiomarkers = biomarkers.filter(b => !isDescriptiveBiomarker(b));
  const descriptiveBiomarkers = biomarkers.filter(b => isDescriptiveBiomarker(b));

  return (
    <div className="space-y-4">
      {categories.map((category, categoryIndex) => {
        const categoryBiomarkers = groupedBiomarkers[category];
        const numericInCategory = categoryBiomarkers.filter(b => !isDescriptiveBiomarker(b));
        const descriptiveInCategory = categoryBiomarkers.filter(b => isDescriptiveBiomarker(b));

        return (
          <Card key={category} className="rounded-2xl shadow-card overflow-hidden min-w-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                {getCategoryDisplayName(category)}
                <span className="text-sm font-normal text-muted-foreground">
                  ({categoryBiomarkers.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Numeric biomarkers with progress bars */}
              {numericInCategory.length > 0 && (
                <div className="space-y-4">
                  {numericInCategory.map((biomarker, index) => (
                    <BiomarkerProgressCard
                      key={biomarker.id}
                      name={translateBiomarkerName(biomarker.name)}
                      percentage={calculateBiomarkerPercentage(
                        biomarker.value,
                        biomarker.reference_min,
                        biomarker.reference_max
                      )}
                      isNormal={biomarker.is_normal}
                      delay={categoryIndex * 0.1 + index * 0.05}
                      infoText={getBiomarkerExplanation(biomarker.name) || formatNumericBiomarkerInfo(biomarker)}
                    />
                  ))}
                </div>
              )}

              {/* Descriptive biomarkers as plain text */}
              {descriptiveInCategory.length > 0 && (
                <div className="space-y-2">
                  {descriptiveInCategory.map((biomarker, index) => (
                    <DescriptiveBiomarkerCard
                      key={biomarker.id}
                      name={biomarker.name}
                      value={getBiomarkerDisplayValue(biomarker)}
                      isNormal={biomarker.is_normal}
                      delay={categoryIndex * 0.1 + (numericInCategory.length + index) * 0.05}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Summary of normal vs abnormal */}
      <Card className="rounded-2xl shadow-card bg-gradient-to-br from-card to-muted/30">
        <CardContent className="py-4">
          <div className="flex items-center justify-around">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {biomarkers.filter((b) => b.is_normal).length}
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
                  {biomarkers.filter((b) => !b.is_normal).length}
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

// Helper function to format numeric biomarker info for tooltip
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
