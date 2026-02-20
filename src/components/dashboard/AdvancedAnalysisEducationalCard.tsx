 import React from 'react';
 import { useTranslation } from 'react-i18next';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Progress } from '@/components/ui/progress';
 import { TrendingUp } from 'lucide-react';
 
 interface AdvancedAnalysisEducationalCardProps {
   examCount: number;
 }
 
 const AdvancedAnalysisEducationalCard: React.FC<AdvancedAnalysisEducationalCardProps> = ({ examCount }) => {
   const { t } = useTranslation();
   const requiredExams = 5;
   const progressPercentage = Math.min((examCount / requiredExams) * 100, 100);
 
   return (
     <Card className="overflow-hidden min-w-0">
       <CardHeader className="pb-2">
         <CardTitle className="flex items-center gap-2 text-lg">
           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
             <TrendingUp className="w-5 h-5 text-primary" />
           </div>
           {t('advancedAnalysisTitle')}
         </CardTitle>
       </CardHeader>
       <CardContent>
         <p className="text-sm text-muted-foreground mb-4">
           {t('advancedAnalysisDescription')}
         </p>
         
         <div className="border border-border rounded-2xl p-5">
           {/* Progress indicator */}
           <div className="flex items-center justify-between mb-3">
             <span className="text-sm font-medium text-foreground">
               {t('advancedAnalysisProgress')}
             </span>
             <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full">
               <span className="text-base font-bold text-primary">{examCount}</span>
               <span className="text-muted-foreground font-medium">/</span>
               <span className="text-base font-bold text-muted-foreground">{requiredExams}</span>
             </div>
           </div>
           
           {/* Progress bar */}
           <Progress 
             value={progressPercentage} 
             className="h-2 bg-muted"
           />
           
           {/* Helper text */}
            <p className="text-xs text-muted-foreground mt-3">
              Envie pelo menos 5 exames para desbloquear análises avançadas.
            </p>
         </div>
       </CardContent>
     </Card>
   );
 };
 
 export default AdvancedAnalysisEducationalCard;