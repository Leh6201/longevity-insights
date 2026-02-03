import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">
            {t('privacyPolicyTitle')}
          </h1>
        </div>
      </header>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="container max-w-2xl mx-auto px-4 py-6">
          <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">
                {t('privacySection1Title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacySection1Content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">
                {t('privacySection2Title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacySection2Content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">
                {t('privacySection3Title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacySection3Content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">
                {t('privacySection4Title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacySection4Content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">
                {t('privacySection5Title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacySection5Content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">
                {t('privacySection6Title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacySection6Content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">
                {t('privacySection7Title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacySection7Content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">
                {t('privacySection8Title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacySection8Content')}
              </p>
            </section>

            <section className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground italic">
                {t('privacyLastUpdated')}
              </p>
            </section>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PrivacyPolicy;
