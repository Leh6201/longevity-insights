import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % rotatingPhrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
                onClick={() => navigate('/auth?mode=register')}
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
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="order-2 lg:order-1 space-y-6"
            >
              {/* Biomarker range card */}
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-xl sm:rounded-2xl shadow-xl border border-border/50 p-4 sm:p-6 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    </div>
                    <span className="font-medium text-foreground text-sm sm:text-base truncate">Glicose em Jejum</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-base sm:text-lg font-bold text-primary">92</span>
                    <span className="text-xs sm:text-sm text-muted-foreground">mg/dL</span>
                  </div>
                </div>
                <BiomarkerRangeIndicator 
                  value={92} 
                  min={70} 
                  max={126} 
                  animate={true}
                  animationDelay={0.5}
                />
                <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground mt-2">
                  <span>70 mg/dL</span>
                  <span className="text-success font-medium">Normal</span>
                  <span>126 mg/dL</span>
                </div>
              </motion.div>

              {/* Trend chart card */}
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-xl sm:rounded-2xl shadow-xl border border-border/50 p-4 sm:p-6 overflow-hidden"
              >
                <div className="flex justify-between items-center gap-2 mb-4">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success" />
                    </div>
                    <span className="font-medium text-foreground text-sm sm:text-base truncate">Tendência ALT</span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-success bg-success/10 px-2 py-1 rounded-full flex-shrink-0">-15% ↓</span>
                </div>
                <div className="h-24 sm:h-32 flex items-end gap-1 sm:gap-2 pt-4">
                  {[45, 60, 75, 70, 55, 50, 40, 35, 30].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                      className="flex-1 rounded-t-md sm:rounded-t-lg bg-gradient-to-t from-primary to-primary/50 relative group min-w-0"
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap hidden sm:block">
                        {h} U/L
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground mt-3">
                  <span>Jan</span>
                  <span>Set</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8 order-1 lg:order-2"
            >
              {/* Icon badge */}
              <div className="inline-flex items-center gap-3 bg-primary/10 rounded-full pl-2 pr-5 py-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-primary">Monitoramento Contínuo</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15]">
                Acompanhe sua
                <br />
                <span className="text-gradient">evolução</span>
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                Visualize tendências dos seus biomarcadores ao longo do tempo. 
                Identifique padrões e tome decisões informadas sobre sua saúde 
                com dados claros e objetivos.
              </p>
              
              <p className="text-muted-foreground leading-relaxed max-w-lg">
                Comparações inteligentes e intervenções de estilo de vida baseadas 
                em evidências científicas para resultados reais.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section 3 - Prevenção Simplificada */}
      <section className="py-24 md:py-40 px-4 relative overflow-hidden">
        {/* Background with subtle pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-secondary/30" />
        <div className="absolute inset-0 opacity-30">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="hsl(var(--primary)/0.3)" />
            </pattern>
            <rect fill="url(#dots)" width="100%" height="100%" />
          </svg>
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Risk cards */}
            <motion.div 
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              {[
                { name: 'Risco Metabólico', percent: 12, trend: -3, icon: Activity, color: 'success' },
                { name: 'Saúde Cardiovascular', percent: 18, trend: -5, icon: Heart, color: 'warning' },
                { name: 'Marcadores Inflamatórios', percent: 8, trend: -2, icon: Shield, color: 'success' },
                { name: 'Função Hepática', percent: 15, trend: -4, icon: Dna, color: 'success' },
                { name: 'Longevidade Geral', percent: -8, trend: 8, icon: Sparkles, color: 'primary' }
              ].map((item, i) => (
                <motion.div 
                  key={item.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  whileHover={{ x: 8, scale: 1.01 }}
                  className="bg-card rounded-xl sm:rounded-2xl shadow-lg border border-border/50 p-3 sm:p-5 flex items-center gap-3 sm:gap-5 cursor-pointer group overflow-hidden"
                >
                  <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center relative overflow-hidden flex-shrink-0`}>
                    <div className={`absolute inset-0 bg-${item.color}/20`} />
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 56 56">
                      <circle 
                        cx="28" cy="28" r="24" 
                        fill="none" 
                        stroke="hsl(var(--border))" 
                        strokeWidth="4"
                      />
                      <motion.circle 
                        cx="28" cy="28" r="24" 
                        fill="none" 
                        stroke={`hsl(var(--${item.color}))`}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="150.8"
                        initial={{ strokeDashoffset: 150.8 }}
                        whileInView={{ strokeDashoffset: 150.8 - (150.8 * Math.abs(item.percent) / 100) }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                        transform="rotate(-90 28 28)"
                      />
                    </svg>
                    <item.icon className={`w-4 h-4 sm:w-6 sm:h-6 text-${item.color} relative z-10`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground text-sm sm:text-base group-hover:text-primary transition-colors truncate">{item.name}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground truncate">Projeção próximos 10 anos</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-base sm:text-xl font-bold text-${item.color}`}>
                      {item.percent > 0 ? '+' : ''}{item.percent}%
                    </div>
                    <div className={`text-[10px] sm:text-xs ${item.trend > 0 ? 'text-success' : 'text-muted-foreground'} flex items-center justify-end gap-1`}>
                      <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {item.trend > 0 ? '+' : ''}{item.trend}% mês
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              {/* Icon badge */}
              <div className="inline-flex items-center gap-3 bg-primary/10 rounded-full pl-2 pr-5 py-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-primary">Prevenção Inteligente</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15]">
                Antecipe
                <br />
                <span className="text-gradient">riscos à saúde</span>
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                Nossa plataforma utiliza algoritmos avançados e as mais recentes 
                descobertas científicas para gerar previsões de risco personalizadas.
              </p>
              
              <p className="text-muted-foreground leading-relaxed max-w-lg">
                Identifique as mudanças de estilo de vida com maior impacto 
                potencial na sua longevidade e qualidade de vida.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section 4 - Relatórios */}
      <section className="py-24 md:py-40 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/3 via-background to-primary/3" />
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
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-primary">Relatórios Profissionais</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15]">
                Compartilhe com
                <br />
                <span className="text-gradient">seu médico</span>
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                Gere relatórios detalhados em PDF prontos para compartilhar com 
                profissionais de saúde. Facilite conversas significativas sobre 
                sua saúde.
              </p>
              
              <div className="flex flex-col gap-4 pt-4">
                {[
                  { icon: FileText, text: "Relatórios PDF completos e profissionais" },
                  { icon: LineChart, text: "Histórico de biomarcadores incluído" },
                  { icon: Sparkles, text: "Recomendações personalizadas anexadas" }
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

            {/* Report mockup */}
            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative">
                {/* Stacked papers effect */}
                <motion.div 
                  animate={{ rotate: [4, 5, 4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-3 -left-3 w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20"
                />
                <motion.div 
                  animate={{ rotate: [1, 2, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-1.5 -left-1.5 w-full h-full bg-gradient-to-br from-primary/10 to-transparent rounded-2xl border border-primary/10"
                />
                
                <div className="relative bg-card rounded-xl sm:rounded-2xl shadow-2xl border border-border/50 p-4 sm:p-8 backdrop-blur-sm overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center gap-3 sm:gap-4 pb-4 sm:pb-6 mb-4 sm:mb-6 border-b border-border/50">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-base sm:text-lg text-foreground truncate">Relatório LongLife AI</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Gerado em 09/12/2024</div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-3 sm:space-y-5">
                    {[
                      { label: 'Idade Biológica', value: '32 anos', badge: '-3 anos', badgeColor: 'success' },
                      { label: 'Risco Metabólico', value: 'Baixo', badge: 'Ótimo', badgeColor: 'success' },
                      { label: 'Inflamação', value: 'Controlada', badge: 'Normal', badgeColor: 'primary' },
                      { label: 'Biomarcadores', value: '13', badge: 'Completo', badgeColor: 'primary' }
                    ].map((item, i) => (
                      <motion.div 
                        key={item.label}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="flex items-center justify-between py-1 sm:py-2 gap-2"
                      >
                        <span className="text-xs sm:text-base text-muted-foreground truncate">{item.label}</span>
                        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
                          <span className="font-semibold text-foreground text-xs sm:text-base">{item.value}</span>
                          <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-${item.badgeColor}/10 text-${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* QR Code area */}
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border/50 flex items-center justify-between gap-2">
                    <div className="text-[10px] sm:text-xs text-muted-foreground min-w-0">
                      <div>Verificação digital</div>
                      <div className="font-mono mt-1 truncate">LLA-2024-12-09-32F8</div>
                    </div>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-9 h-9 sm:w-12 sm:h-12 grid grid-cols-4 gap-0.5">
                        {Array(16).fill(0).map((_, i) => (
                          <div key={i} className={`${Math.random() > 0.4 ? 'bg-foreground' : 'bg-transparent'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-40 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 rounded-[3rem] blur-3xl" />
            
            <div className="relative text-center space-y-8 sm:space-y-10 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-12 md:p-20 border border-primary/20 shadow-2xl">
              {/* Icon */}
              <motion.div 
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto shadow-2xl shadow-primary/30"
              >
                <Sparkles className="w-12 h-12 text-primary-foreground" />
              </motion.div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-[1.15]">
                Comece sua jornada de
                <br />
                <span className="text-gradient">longevidade hoje</span>
              </h2>
              
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
                Descubra sua idade biológica, receba recomendações personalizadas 
                e tome controle da sua saúde com inteligência artificial.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 px-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')}
                  className="group relative overflow-hidden shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-500 w-full sm:w-auto"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Criar Conta Grátis
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/auth?mode=register')}
                  className="border-primary/30 hover:bg-primary/10 w-full sm:w-auto"
                >
                  Criar Conta
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-border/50 bg-gradient-to-t from-secondary/30 to-transparent">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-foreground">LongLife</span>
                <span className="text-primary">AI</span>
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Este aplicativo não fornece diagnóstico médico. Sempre consulte um profissional de saúde.
            </p>
            
            <div className="flex items-center gap-8 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Termos de Uso</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
