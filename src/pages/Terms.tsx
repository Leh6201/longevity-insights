import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from 'react-i18next';

// Helper function to highlight key phrases in text
const highlightKeyPhrases = (text: string): React.ReactNode => {
  const keyPhrases = [
    'não constituem diagnóstico médico',
    'não realiza diagnósticos clínicos',
    'não prescreve medicamentos ou tratamentos',
    'prescrição de tratamentos',
    'não substitui exames médicos ou laboratoriais',
    'não deve ser utilizado como única fonte',
    'não substitui o acompanhamento médico profissional',
    'A responsabilidade pelas decisões tomadas com base nas informações do aplicativo é exclusivamente sua',
    'consulte regularmente médicos',
    'busque orientação profissional adequada',
    'Em caso de emergência médica, procure atendimento imediatamente',
  ];

  let result: React.ReactNode[] = [];
  let remainingText = text;
  let keyIndex = 0;

  // Sort phrases by their position in text to process them in order
  const phrasesInText = keyPhrases
    .map(phrase => ({ phrase, index: text.indexOf(phrase) }))
    .filter(item => item.index !== -1)
    .sort((a, b) => a.index - b.index);

  let lastIndex = 0;
  phrasesInText.forEach(({ phrase, index }) => {
    // Add text before the phrase
    if (index > lastIndex) {
      result.push(text.substring(lastIndex, index));
    }
    // Add highlighted phrase
    result.push(
      <strong key={keyIndex++} className="text-foreground font-medium">
        {phrase}
      </strong>
    );
    lastIndex = index + phrase.length;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex));
  }

  return result.length > 0 ? result : text;
};

const Terms: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const sections = [
    { title: 'termsSection1Title', content: 'termsSection1Content' },
    { title: 'termsSection2Title', content: 'termsSection2Content' },
    { title: 'termsSection3Title', content: 'termsSection3Content' },
    { title: 'termsSection4Title', content: 'termsSection4Content' },
    { title: 'termsSection5Title', content: 'termsSection5Content' },
    { title: 'termsSection6Title', content: 'termsSection6Content' },
    { title: 'termsSection7Title', content: 'termsSection7Content' },
  ];

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
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <h1 className="text-base font-semibold text-foreground">
              {t('termsTitle')}
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="container max-w-2xl mx-auto px-4 py-8">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <section key={index} className="space-y-3">
                <h2 className="text-base font-semibold text-foreground tracking-tight">
                  {t(section.title)}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {highlightKeyPhrases(t(section.content))}
                </p>
              </section>
            ))}

            {/* Last updated */}
            <div className="pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground/70 italic">
                {t('termsLastUpdated')}
              </p>
            </div>

            {/* Action Button */}
            <div className="pt-4 pb-8">
              <Button
                onClick={() => navigate(-1)}
                className="w-full"
                size="lg"
              >
                <Check className="w-4 h-4 mr-2" />
                {t('understood')}
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Terms;