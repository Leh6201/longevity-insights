import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AcceptTerms: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!accepted || !user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          terms_accepted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: t('termsAccepted'),
        description: t('termsAcceptedDescription'),
      });

      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error saving terms acceptance:', error);
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('termsAcceptError'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-border/50 shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('acceptTermsTitle')}
          </h1>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Explanatory text */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('acceptTermsDescription')}
            </p>
          </div>

          {/* Checkbox */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="accept-terms"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked === true)}
              className="mt-0.5"
            />
            <Label 
              htmlFor="accept-terms" 
              className="text-sm text-foreground cursor-pointer leading-relaxed"
            >
              {t('acceptTermsCheckbox')}
            </Label>
          </div>

          {/* Link to full terms */}
          <Link 
            to="/terms?from=accept-terms" 
            state={{ from: '/accept-terms' }}
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <FileText className="w-4 h-4" />
            {t('readFullTerms')}
          </Link>

          {/* Continue button */}
          <Button
            onClick={handleContinue}
            disabled={!accepted || isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? t('loading') : t('continueToInsights')}
          </Button>

          {/* Skip option info */}
          <p className="text-xs text-center text-muted-foreground">
            {t('termsSkipInfo')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptTerms;
