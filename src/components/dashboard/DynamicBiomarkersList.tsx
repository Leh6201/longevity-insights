import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Activity, ChevronDown, Beaker, Droplets, FlaskConical, Pill, Heart } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import BiomarkerRangeBar from './BiomarkerRangeBar';
import DescriptiveBiomarkerCard from './DescriptiveBiomarkerCard';
import {
  DetectedBiomarker,
  isDescriptiveBiomarker,
  getBiomarkerDisplayValue,
  groupBiomarkersByCategory,
  getCategoryDisplayName,
} from '@/hooks/useDynamicBiomarkers';
import { translateBiomarkerName } from '@/lib/biomarkerLocalization';

interface DynamicBiomarkersListProps {
  biomarkers: DetectedBiomarker[];
  loading: boolean;
}

// Get icon for category
const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    sangue: <Droplets className="w-4 h-4" />,
    urina: <Beaker className="w-4 h-4" />,
    fezes: <FlaskConical className="w-4 h-4" />,
    hormonio: <Pill className="w-4 h-4" />,
    vitamina: <Pill className="w-4 h-4" />,
    mineral: <FlaskConical className="w-4 h-4" />,
    lipidio: <Heart className="w-4 h-4" />,
    enzima: <FlaskConical className="w-4 h-4" />,
    virologia: <Beaker className="w-4 h-4" />,
    parasitologia: <Beaker className="w-4 h-4" />,
    geral: <Activity className="w-4 h-4" />,
  };
  return iconMap[category.toLowerCase()] || <Activity className="w-4 h-4" />;
};

const DynamicBiomarkersList: React.FC<DynamicBiomarkersListProps> = ({
  biomarkers,
  loading,
}) => {
  const { t } = useTranslation();
  const [attentionOpen, setAttentionOpen] = React.useState(true);
  const [normalOpen, setNormalOpen] = React.useState(true);
  const [openCategories, setOpenCategories] = React.useState<Record<string, boolean>>({});

  // Toggle category collapse state
  const toggleCategory = (key: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Check if category is open (default to open)
  const isCategoryOpen = (key: string) => {
    return openCategories[key] !== false;
  };

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

  // Further group by category
  const attentionByCategory = groupBiomarkersByCategory(attentionBiomarkers);
  const normalByCategory = groupBiomarkersByCategory(normalBiomarkers);

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
    
    // Use range bar for numeric biomarkers - shows position in reference range
    return (
      <BiomarkerRangeBar
        key={biomarker.id}
        name={translateBiomarkerName(biomarker.name)}
        value={biomarker.value}
        displayValue={displayValue}
        referenceMin={biomarker.reference_min}
        referenceMax={biomarker.reference_max}
        unit={biomarker.unit}
        isNormal={biomarker.is_normal}
        delay={baseDelay + index * 0.05}
        infoText={biomarker.explanation || formatNumericBiomarkerInfo(biomarker)}
      />
    );
  };

  const renderCategorySection = (
    category: string, 
    categoryBiomarkers: DetectedBiomarker[], 
    sectionType: 'attention' | 'normal',
    categoryIndex: number
  ) => {
    const categoryKey = `${sectionType}-${category}`;
    const isOpen = isCategoryOpen(categoryKey);
    
    return (
      <Collapsible 
        key={categoryKey}
        open={isOpen} 
        onOpenChange={() => toggleCategory(categoryKey)}
      >
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                sectionType === 'attention' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'
              }`}>
                {getCategoryIcon(category)}
              </div>
              <span className="text-sm font-medium">{getCategoryDisplayName(category)}</span>
              <span className="text-xs text-muted-foreground">({categoryBiomarkers.length})</span>
            </div>
            <ChevronDown 
              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-2 pt-2 pl-2">
            {categoryBiomarkers.map((biomarker, index) => 
              renderBiomarkerItem(biomarker, index, categoryIndex * 0.1)
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  // Sort categories for consistent display order
  const sortedCategories = (grouped: Record<string, DetectedBiomarker[]>) => {
    const categoryOrder = ['sangue', 'urina', 'fezes', 'hormonio', 'vitamina', 'mineral', 'lipidio', 'enzima', 'virologia', 'parasitologia', 'geral'];
    return Object.keys(grouped).sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.toLowerCase());
      const bIndex = categoryOrder.indexOf(b.toLowerCase());
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });
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
                {sortedCategories(attentionByCategory).map((category, index) => 
                  renderCategorySection(category, attentionByCategory[category], 'attention', index)
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
                {sortedCategories(normalByCategory).map((category, index) => 
                  renderCategorySection(category, normalByCategory[category], 'normal', index)
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
