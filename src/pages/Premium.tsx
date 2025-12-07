import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, Sparkles, Diamond, TrendingUp, History, Upload, Brain } from 'lucide-react';

const Premium: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const benefits = [
    { icon: Upload, label: t('premiumBenefit1') },
    { icon: Brain, label: t('premiumBenefit2') },
    { icon: History, label: t('premiumBenefit3') },
    { icon: TrendingUp, label: t('premiumBenefit4') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto h-full flex items-center px-4">
          <Button variant="ghost" size="icon" onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="ml-4 text-lg font-semibold">{t('premiumPlans')}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <Diamond className="w-5 h-5" />
              <span className="font-semibold">Premium</span>
            </div>
            <h2 className="text-3xl font-display font-bold">{t('unlockFullPotential')}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">{t('premiumDescription')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Plan */}
            <Card className="relative overflow-hidden border-2 border-primary">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  {t('popular')}
                </span>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {t('monthlyPlan')}
                </CardTitle>
                <CardDescription>{t('monthlyPlanDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">R$ 39,99</span>
                  <span className="text-muted-foreground">/{t('month')}</span>
                </div>
                <ul className="space-y-3">
                  {benefits.map((benefit, idx) => {
                    const Icon = benefit.icon;
                    return (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm">{benefit.label}</span>
                      </li>
                    );
                  })}
                </ul>
                <Button className="w-full" size="lg">
                  {t('subscribe')}
                </Button>
              </CardContent>
            </Card>

            {/* Installment Plan */}
            <Card className="border-2 border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Diamond className="w-5 h-5 text-muted-foreground" />
                  {t('installmentPlan')}
                </CardTitle>
                <CardDescription>{t('installmentPlanDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">7x R$ 7,99</span>
                </div>
                <ul className="space-y-3">
                  {benefits.map((benefit, idx) => {
                    const Icon = benefit.icon;
                    return (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                          <Check className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <span className="text-sm">{benefit.label}</span>
                      </li>
                    );
                  })}
                </ul>
                <Button variant="outline" className="w-full" size="lg">
                  {t('subscribe')}
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            {t('premiumDisclaimer')}
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Premium;
