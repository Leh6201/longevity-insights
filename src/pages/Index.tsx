import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const rotatingPhrases = [
  { prefix: 'Descubra sua', highlight: 'Idade Biológica' },
  { prefix: 'Descubra seus', highlight: 'Riscos de Saúde' },
  { prefix: 'Descubra seu', highlight: 'Potencial de Longevidade' },
  { prefix: 'Descubra sua', highlight: 'Saúde Metabólica' },
];
import { Button } from '@/components/ui/button';
import BiomarkerRangeIndicator from '@/components/dashboard/BiomarkerRangeIndicator';
import { 
  Zap, 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Heart,
  Activity,
  Brain,
  Dna,
  Shield,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Clock,
  Target,
  LineChart
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % rotatingPhrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // Animation variants
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerChildren: Variants = {
    visible: { transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Premium background with multiple layers */}
        <div className="absolute inset-0">
          {/* Gradient mesh background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          
          {/* Animated orbs */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 right-[5%] w-[600px] h-[600px] bg-gradient-to-tl from-accent/15 to-transparent rounded-full blur-3xl"
          />
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="text-center space-y-10"
          >
            {/* Logo with glow effect */}
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-4 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl animate-pulse" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl">
                  <Heart className="w-9 h-9 text-primary-foreground" />
                </div>
              </div>
              <span className="text-4xl font-bold tracking-tight">
                <span className="text-foreground">LongLife</span>
                <span className="text-gradient">AI</span>
              </span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-[1.15] tracking-tight px-2"
            >
              <motion.span
                key={`prefix-${currentPhraseIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {rotatingPhrases[currentPhraseIndex].prefix}
              </motion.span>
              <br />
              <span className="relative inline-block min-h-[1.2em]">
                <motion.span 
                  key={`highlight-${currentPhraseIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="text-gradient"
                >
                  {rotatingPhrases[currentPhraseIndex].highlight}
                </motion.span>
                <motion.span 
                  animate={{ scaleX: [0, 1] }}
                  transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                  className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-primary via-accent to-primary rounded-full origin-left"
                />
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light px-4"
            >
              Envie seus exames e receba análises inteligentes com
              <span className="text-foreground font-medium"> recomendações personalizadas </span>
              para viver mais e melhor.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-6 px-4"
            >
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="group relative overflow-hidden shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-500 w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Começar Agora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <Button 
                size="lg" 
                variant="glass"
                onClick={() => navigate('/auth?mode=signup')}
                className="backdrop-blur-xl w-full sm:w-auto"
              >
                Criar Conta Grátis
              </Button>
            </motion.div>

            {/* Stats bar */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-16 pt-12 sm:pt-16 px-4"
            >
              {[
                { value: "13", label: "Biomarcadores" },
                { value: "<1min", label: "Análise" },
                { value: "100%", label: "Personalizado" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Scroll indicator */}
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="pt-12"
            >
              <div className="w-8 h-14 rounded-full border-2 border-muted-foreground/30 mx-auto flex items-start justify-center p-2">
                <motion.div 
                  animate={{ y: [0, 16, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1.5 h-3 bg-primary rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section 1 - Análise Instantânea */}
      <section className="py-24 md:py-40 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              {/* Icon badge */}
              <div className="inline-flex items-center gap-3 bg-primary/10 rounded-full pl-2 pr-5 py-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-primary">Análise Instantânea</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15]">
                Resultados em
                <br />
                <span className="text-gradient">segundos</span>
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                O painel LongLife AI transforma seus exames laboratoriais em 
                insights compreensíveis, oferecendo uma visão completa da sua saúde 
                de forma nunca antes vista.
              </p>
              
              <div className="flex flex-col gap-4 pt-4">
                {[
                  { icon: Clock, text: "Upload rápido e processamento automático" },
                  { icon: Brain, text: "Inteligência artificial de última geração" },
                  { icon: Shield, text: "Dados protegidos com criptografia" }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Dashboard mockup */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 rounded-[2rem] blur-2xl" />
                <div className="relative bg-card rounded-2xl sm:rounded-3xl shadow-2xl border border-border/50 p-4 sm:p-8 backdrop-blur-sm overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Dashboard</div>
                        <div className="text-xs text-muted-foreground">Atualizado agora</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-success" />
                      <div className="w-3 h-3 rounded-full bg-warning" />
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    </div>
                  </div>
                  
                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl sm:rounded-2xl p-2 sm:p-5 text-center border border-primary/20 min-w-0"
                    >
                      <div className="text-lg sm:text-3xl font-bold text-primary truncate">32</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">Idade Bio</div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="bg-gradient-to-br from-success/10 to-success/5 rounded-xl sm:rounded-2xl p-2 sm:p-5 text-center border border-success/20 min-w-0"
                    >
                      <div className="text-lg sm:text-3xl font-bold text-success truncate">Baixo</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">Risco</div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="bg-gradient-to-br from-warning/10 to-warning/5 rounded-xl sm:rounded-2xl p-2 sm:p-5 text-center border border-warning/20 min-w-0"
                    >
                      <div className="text-lg sm:text-3xl font-bold text-warning truncate">5</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">Dicas</div>
                    </motion.div>
                  </div>

                  {/* Biomarkers */}
                  <div className="space-y-3">
                    {[
                      { name: 'Glicose', value: 92, status: 'success', max: 100 },
                      { name: 'Colesterol Total', value: 78, status: 'success', max: 100 },
                      { name: 'Hemoglobina', value: 85, status: 'success', max: 100 }
                    ].map((item, i) => (
                      <motion.div 
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-secondary/50 rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between mb-2 min-w-0">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className={`w-2 h-2 rounded-full bg-${item.status} flex-shrink-0`} />
                            <span className="text-xs sm:text-sm font-medium text-foreground truncate">{item.name}</span>
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-primary flex-shrink-0 ml-2">{item.value}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.value}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section 2 - Monitoramento Inteligente */}
      <section className="py-24 md:py-40 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-background to-accent/3" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Chart mockups */}
            <motion.div 
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-accent/20 via-transparent to-primary/20 rounded-[2rem] blur-2xl" />
                <div className="relative bg-card rounded-2xl sm:rounded-3xl shadow-2xl border border-border/50 p-4 sm:p-8 backdrop-blur-sm overflow-hidden">
                  {/* Trend Chart mockup */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Tendências</div>
                        <div className="text-xs text-muted-foreground">Últimos 6 meses</div>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-medium">
                      ↓ -15%
                    </div>
                  </div>

                  {/* Chart visualization */}
                  <div className="h-48 relative">
                    <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        d="M 0 100 Q 50 80 100 90 T 200 70 T 300 50 T 400 30"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <motion.path
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1, duration: 1 }}
                        d="M 0 100 Q 50 80 100 90 T 200 70 T 300 50 T 400 30 L 400 150 L 0 150 Z"
                        fill="url(#chartGradient)"
                      />
                    </svg>
                    
                    {/* Data points */}
                    {[
                      { x: '10%', y: '67%', value: '98' },
                      { x: '35%', y: '60%', value: '92' },
                      { x: '60%', y: '47%', value: '85' },
                      { x: '85%', y: '33%', value: '78' }
                    ].map((point, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.5 + i * 0.15 }}
                        className="absolute"
                        style={{ left: point.x, top: point.y }}
                      >
                        <div className="w-4 h-4 rounded-full bg-primary border-2 border-card shadow-lg" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-6 mt-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-xs text-muted-foreground">Glicose</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success" />
                      <span className="text-xs text-muted-foreground">Alvo</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8 order-1 lg:order-2"
            >
              {/* Icon badge */}
              <div className="inline-flex items-center gap-3 bg-accent/10 rounded-full pl-2 pr-5 py-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="text-sm font-medium text-accent">Monitoramento Inteligente</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15]">
                Acompanhe sua
                <br />
                <span className="text-gradient">evolução</span>
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                Visualize tendências, compare resultados ao longo do tempo e 
                entenda como suas escolhas de estilo de vida impactam sua saúde.
              </p>
              
              <div className="flex flex-col gap-4 pt-4">
                {[
                  { icon: TrendingUp, text: "Gráficos interativos de evolução" },
                  { icon: Target, text: "Metas personalizadas de saúde" },
                  { icon: LineChart, text: "Análise de tendências" }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-muted-foreground">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section 3 - Prevenção Simplificada */}
      <section className="py-24 md:py-40 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              {/* Icon badge */}
              <div className="inline-flex items-center gap-3 bg-success/10 rounded-full pl-2 pr-5 py-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-success to-success/70 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-success-foreground" />
                </div>
                <span className="text-sm font-medium text-success">Prevenção Simplificada</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15]">
                Recomendações
                <br />
                <span className="text-gradient">personalizadas</span>
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                Receba orientações específicas baseadas nos seus resultados, 
                com dicas práticas para melhorar cada aspecto da sua saúde.
              </p>
              
              <div className="flex flex-col gap-4 pt-4">
                {[
                  { icon: Dna, text: "Análise genética integrada" },
                  { icon: Heart, text: "Foco em longevidade saudável" },
                  { icon: Brain, text: "Insights baseados em ciência" }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-success" />
                    </div>
                    <span className="text-muted-foreground">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Recommendations mockup */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-success/20 via-transparent to-primary/20 rounded-[2rem] blur-2xl" />
                <div className="relative bg-card rounded-2xl sm:rounded-3xl shadow-2xl border border-border/50 p-4 sm:p-8 backdrop-blur-sm overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success to-success/70 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-success-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Recomendações</div>
                      <div className="text-xs text-muted-foreground">Baseadas nos seus exames</div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-4">
                    {[
                      { priority: 'high', title: 'Aumentar ingestão de água', desc: 'Beber 2L/dia pode melhorar glicose em 8%', icon: '💧' },
                      { priority: 'medium', title: 'Caminhada diária', desc: '30 min reduz risco cardiovascular em 15%', icon: '🚶' },
                      { priority: 'low', title: 'Sono regular', desc: 'Dormir 7-8h otimiza marcadores inflamatórios', icon: '😴' }
                    ].map((rec, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.15 }}
                        className={`p-4 rounded-xl border ${
                          rec.priority === 'high' 
                            ? 'bg-warning/5 border-warning/20' 
                            : rec.priority === 'medium'
                            ? 'bg-primary/5 border-primary/20'
                            : 'bg-secondary/50 border-border/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{rec.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground text-sm">{rec.title}</div>
                            <div className="text-xs text-muted-foreground mt-1">{rec.desc}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section 4 - Share with Doctor */}
      <section className="py-24 md:py-40 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/3 via-background to-primary/3" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Report mockup */}
            <motion.div 
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 rounded-[2rem] blur-2xl" />
                <div className="relative bg-card rounded-2xl sm:rounded-3xl shadow-2xl border border-border/50 p-4 sm:p-8 backdrop-blur-sm overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Relatório de Saúde</div>
                        <div className="text-xs text-muted-foreground">PDF profissional</div>
                      </div>
                    </div>
                  </div>

                  {/* Report preview */}
                  <div className="bg-secondary/50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-4 pb-4 border-b border-border/50">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">LongLife AI</div>
                        <div className="text-xs text-muted-foreground">Relatório Completo</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Idade Biológica</span>
                        <span className="text-sm font-semibold text-primary">32 anos</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Risco Metabólico</span>
                        <span className="text-sm font-semibold text-success">Baixo</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Biomarcadores</span>
                        <span className="text-sm font-semibold text-foreground">13 analisados</span>
                      </div>
                    </div>

                    <Button className="w-full mt-4" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Baixar PDF
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8 order-1 lg:order-2"
            >
              {/* Icon badge */}
              <div className="inline-flex items-center gap-3 bg-primary/10 rounded-full pl-2 pr-5 py-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-primary">Compartilhe com seu Médico</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15]">
                Relatório
                <br />
                <span className="text-gradient">profissional</span>
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                Gere relatórios completos em PDF para compartilhar com seu médico, 
                facilitando o acompanhamento da sua saúde.
              </p>
              
              <div className="flex flex-col gap-4 pt-4">
                {[
                  { icon: FileText, text: "PDF formatado profissionalmente" },
                  { icon: Shield, text: "Dados seguros e confidenciais" },
                  { icon: Heart, text: "Insights para consultas médicas" }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-40 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.3, scale: 1 }}
          viewport={{ once: true }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px]"
        />
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15]">
              Comece sua jornada de
              <br />
              <span className="text-gradient">longevidade hoje</span>
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Junte-se a milhares de pessoas que estão transformando sua saúde 
              com o poder da inteligência artificial.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth?mode=signup')}
                className="group relative overflow-hidden shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-500"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Criar Conta Grátis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/auth')}
              >
                Já tenho conta
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-foreground">LongLife</span>
                <span className="text-gradient">AI</span>
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground text-center max-w-md">
              Este aplicativo não fornece diagnóstico médico. 
              Sempre consulte um profissional de saúde.
            </p>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <button className="hover:text-foreground transition-colors">Termos</button>
              <button className="hover:text-foreground transition-colors">Privacidade</button>
              <button className="hover:text-foreground transition-colors">Contato</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;