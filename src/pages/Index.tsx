import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useGuest } from '@/contexts/GuestContext';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { 
  Zap, 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Heart,
  Shield,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { isGuest, enterGuestMode } = useGuest();
  const { t } = useTranslation();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (!loading && (user || isGuest)) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, isGuest, navigate]);

  const handleGuestAccess = () => {
    enterGuestMode();
    navigate('/onboarding');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <span className="text-3xl font-bold text-foreground">LongLife<span className="text-primary">AI</span></span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Descubra sua{' '}
              <span className="text-gradient">Idade Biológica</span>
              <br />
              em Segundos
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Faça upload do seu exame de sangue e receba análises inteligentes com 
              recomendações personalizadas para uma vida mais longa e saudável.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="xl" 
                onClick={() => navigate('/auth')}
                className="group"
              >
                Começar Agora
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="xl" 
                variant="outline"
                onClick={handleGuestAccess}
              >
                Experimentar Grátis
              </Button>
            </div>

            {/* Scroll indicator */}
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="pt-16"
            >
              <ChevronDown className="w-8 h-8 text-muted-foreground mx-auto" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section 1 - Análise Rápida */}
      <section className="py-20 md:py-32 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Menos de um minuto
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                O painel LongLife AI oferece uma compreensão abrangente da sua saúde, 
                de forma mais eficiente do que nunca.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Nossa página de visão geral completa fornece tudo o que você precisa 
                para tomar as melhores decisões sobre sua saúde e longevidade.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-card rounded-3xl shadow-card p-6 border border-border/50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <span className="font-semibold text-foreground">Dashboard LongLife</span>
                    <span className="text-xs text-muted-foreground">Atualizado agora</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-secondary/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-primary">32</div>
                      <div className="text-xs text-muted-foreground">Idade Bio</div>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-success">Baixo</div>
                      <div className="text-xs text-muted-foreground">Risco</div>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-warning">5</div>
                      <div className="text-xs text-muted-foreground">Dicas</div>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    {['Glicose', 'Colesterol', 'Hemoglobina'].map((item, i) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                        <div className="flex-1 h-2 bg-secondary rounded-full">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${70 + i * 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section 2 - Monitoramento */}
      <section className="py-20 md:py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-2 md:order-1"
            >
              <div className="space-y-4">
                <div className="bg-card rounded-2xl shadow-card p-5 border border-border/50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-foreground">Glicose em Jejum</span>
                    <span className="text-sm text-primary font-semibold">92 mg/dL</span>
                  </div>
                  <div className="h-3 bg-gradient-to-r from-success via-warning to-destructive rounded-full relative">
                    <div className="absolute left-[30%] top-1/2 -translate-y-1/2 w-4 h-4 bg-card border-2 border-primary rounded-full shadow-md" />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>70</span>
                    <span>100</span>
                    <span>126</span>
                  </div>
                </div>

                <div className="bg-card rounded-2xl shadow-card p-5 border border-border/50">
                  <div className="text-sm font-medium text-foreground mb-3">Tendência - ALT</div>
                  <div className="h-24 flex items-end gap-1">
                    {[40, 55, 70, 65, 50, 45, 35, 30, 28].map((h, i) => (
                      <div 
                        key={i}
                        className="flex-1 bg-primary/20 rounded-t"
                        style={{ height: `${h}%` }}
                      >
                        <div 
                          className="w-full bg-primary rounded-t transition-all"
                          style={{ height: `${h * 0.7}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 order-1 md:order-2"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Monitoramento inteligente
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Nosso painel permite que você acompanhe as mudanças ao longo do tempo 
                e obtenha informações detalhadas sobre as tendências dos seus biomarcadores.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Fornecemos comparações inteligentes e intervenções de estilo de vida 
                cientificamente comprovadas para melhorar sua saúde.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section 3 - Prevenção */}
      <section className="py-20 md:py-32 px-4 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="space-y-3">
                {[
                  { name: 'Risco Metabólico', value: 'Baixo', color: 'success', percent: 15 },
                  { name: 'Risco Cardiovascular', value: 'Moderado', color: 'warning', percent: 32 },
                  { name: 'Inflamação', value: 'Baixa', color: 'success', percent: 8 },
                  { name: 'Função Hepática', value: 'Normal', color: 'success', percent: 12 },
                ].map((item, i) => (
                  <motion.div 
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card rounded-xl shadow-card p-4 border border-border/50 flex items-center gap-4"
                  >
                    <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center border-${item.color}`}>
                      <Heart className={`w-5 h-5 text-${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{item.name}</div>
                      <div className="text-sm text-muted-foreground">Próximos 10 anos</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold text-${item.color}`}>{item.percent}%</div>
                      <div className="text-xs text-muted-foreground">{item.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Prevenção simplificada
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Nossa plataforma gera previsões de risco utilizando as mais recentes 
                descobertas científicas e dados de saúde personalizados.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                As informações do painel ajudam você a identificar as mudanças de 
                estilo de vida que podem ter o maior impacto na sua longevidade.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section 4 - Compartilhamento */}
      <section className="py-20 md:py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Compartilhe com seu médico
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Nosso painel facilita a comunicação significativa entre você e 
                seus profissionais de saúde.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Gere relatórios de saúde completos em PDF após cada análise e 
                compartilhe informações valiosas sobre seus hábitos e biomarcadores.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full bg-primary/10 rounded-2xl transform rotate-3" />
                <div className="absolute -top-2 -left-2 w-full h-full bg-primary/5 rounded-2xl transform rotate-1" />
                <div className="relative bg-card rounded-2xl shadow-card p-6 border border-border/50">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                      <Heart className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Relatório LongLife AI</div>
                      <div className="text-xs text-muted-foreground">Gerado em 09/12/2024</div>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Idade Biológica</span>
                      <span className="font-medium text-foreground">32 anos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Risco Metabólico</span>
                      <span className="font-medium text-success">Baixo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Inflamação</span>
                      <span className="font-medium text-success">Baixa</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Biomarcadores</span>
                      <span className="font-medium text-foreground">13 analisados</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-3xl p-8 md:p-16 border border-primary/20"
          >
            <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto shadow-glow">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Comece sua jornada de longevidade hoje
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Descubra sua idade biológica, receba recomendações personalizadas e 
              tome controle da sua saúde com inteligência artificial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="xl" 
                onClick={() => navigate('/auth')}
                className="group"
              >
                Criar Conta Grátis
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="xl" 
                variant="outline"
                onClick={handleGuestAccess}
              >
                Testar como Visitante
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">LongLife<span className="text-primary">AI</span></span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Este aplicativo não fornece diagnóstico médico. Sempre consulte um profissional de saúde.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Termos</a>
              <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
