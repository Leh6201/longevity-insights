import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

const resources = {
  pt: {
    translation: {
      // Auth
      welcome: "Bem-vindo ao LongLife AI",
      tagline: "Desbloqueie seu potencial de longevidade com insights de saúde baseados em IA",
      signIn: "Entrar",
      signUp: "Cadastrar",
      email: "E-mail",
      password: "Senha",
      name: "Nome",
      forgotPassword: "Esqueceu a senha?",
      continueWithGoogle: "Continuar com Google",
      continueWithApple: "Continuar com Apple",
      continueWithFacebook: "Continuar com Facebook",
      orContinueWith: "ou continue com",
      or: "ou",
      dontHaveAccount: "Não tem uma conta?",
      alreadyHaveAccount: "Já tem uma conta?",
      createAccount: "Criar Conta",
      resetPassword: "Redefinir Senha",
      sendResetLink: "Enviar Link",
      backToLogin: "Voltar ao Login",
      enterWithoutLogin: "Entrar sem Login",
      
      // Guest Mode
      guestMode: "Modo Visitante",
      guestBannerTitle: "Salve seu progresso!",
      guestBannerDesc: "Crie uma conta para salvar seus dados e acessá-los a qualquer momento.",
      guestAccountMessage: "Você está usando o modo visitante. Crie uma conta para salvar seu progresso.",
      
      // Onboarding
      onboardingTitle: "Vamos personalizar sua experiência",
      basicInfo: "Informações Básicas",
      lifestyle: "Estilo de Vida e Hábitos",
      healthGoals: "Objetivos de Saúde",
      medicalHistory: "Histórico Médico",
      age: "Idade",
      biologicalSex: "Sexo Biológico",
      male: "Masculino",
      female: "Feminino",
      weight: "Peso (kg)",
      height: "Altura (cm)",
      trainingFrequency: "Frequência de Treino Semanal",
      training0: "Nenhum",
      training1: "1-2 vezes",
      training2: "3-4 vezes",
      training3: "5+ vezes",
      sleepQuality: "Qualidade do Sono",
      sleepPoor: "Ruim",
      sleepAverage: "Média",
      sleepGood: "Boa",
      alcoholConsumption: "Consumo de Álcool",
      alcoholNone: "Nenhum",
      alcoholLow: "Baixo",
      alcoholModerate: "Moderado",
      alcoholHigh: "Alto",
      dailyWater: "Consumo Diário de Água (L)",
      mentalHealth: "Nível de Saúde Mental (1-10)",
      selectGoals: "Selecione Seus Objetivos de Saúde",
      loseWeight: "Perder Peso",
      improveEnergy: "Melhorar Energia",
      improveSleep: "Melhorar Sono",
      reduceCholesterol: "Reduzir Colesterol",
      reduceBloodSugar: "Reduzir Açúcar no Sangue",
      increaseLongevity: "Aumentar Longevidade",
      currentMedications: "Medicamentos Atuais",
      medicationsPlaceholder: "Liste os medicamentos que você está tomando...",
      medicalHistoryLabel: "Histórico Médico Básico",
      medicalHistoryPlaceholder: "Condições médicas ou histórico relevante...",
      next: "Próximo",
      back: "Voltar",
      complete: "Concluir",
      profileSaved: "Seu perfil foi salvo!",
      profileUpdated: "Seu perfil foi atualizado!",
      
      // Dashboard
      dashboard: "Painel",
      yourBiologicalAge: "Sua Idade Biológica",
      bodyFunctioning: "Seu corpo está funcionando como se você tivesse",
      yearsOld: "anos",
      greatNews: "Ótimas notícias! Sua idade biológica é menor que sua idade real.",
      roomForImprovement: "Sua idade biológica é maior que sua idade real. Vamos trabalhar para melhorar!",
      metabolicRisk: "Risco Metabólico",
      inflammationScore: "Índice de Inflamação",
      low: "Baixo",
      moderate: "Médio",
      high: "Alto",
      personalizedRecommendations: "Recomendações Personalizadas",
      lipidProfile: "Perfil Lipídico",
      glucoseMarkers: "Marcadores de Glicose",
      liverFunction: "Função Hepática",
      otherMarkers: "Outros Marcadores",
      uploadLabTest: "Enviar Exame",
      noLabResults: "Nenhum resultado de exame",
      uploadFirst: "Envie seu primeiro exame para obter insights personalizados",
      uploadFirstDescription: "Envie seu primeiro exame para descobrir sua idade biológica e receber recomendações personalizadas!",
      yourGoals: "Seus Objetivos",
      lastAnalysis: "Última análise",
      processingTime: "Tempo de processamento",
      reanalyze: "Reanalisar",
      reanalyzing: "Reanalisando...",
      pleaseWait: "Por favor aguarde enquanto processamos seus resultados.",
      resultsUpdated: "Seus resultados foram atualizados!",
      shareWithDoctor: "Compartilhar com Médico",
      analysisHistory: "Histórico de Análises",
      trackProgress: "Acompanhe seu progresso ao longo do tempo",
      viewAllAnalyses: "Veja todas as suas análises anteriores",
      advancedAnalytics: "Análises Avançadas",
      premiumAnalyticsDesc: "Obtenha insights mais profundos com análises avançadas",
      unlockAdvancedFeatures: "Desbloqueie recursos avançados",
      greatJob: "Parabéns!",
      bioAgeImproved: "Sua idade biológica melhorou em {{years}} anos!",
      noFileToReanalyze: "Nenhum arquivo disponível para reanalisar",
      reportGenerated: "Relatório de saúde baixado com sucesso!",
      reportError: "Falha ao gerar relatório. Tente novamente.",
      
      // Lab Upload
      uploadLabTitle: "Envie Seu Exame",
      uploadDescription: "Envie seus resultados de exames (PDF, imagem ou foto) e nossa IA extrairá seus biomarcadores automaticamente.",
      dragDrop: "Arraste e solte seu arquivo aqui, ou clique para selecionar",
      supportedFormats: "Formatos suportados: PDF, PNG, JPG",
      analyzing: "Analisando seus resultados...",
      analysisComplete: "Análise Concluída",
      
      // Settings
      settings: "Configurações",
      profile: "Perfil",
      editProfile: "Editar Perfil",
      account: "Conta",
      manageAccount: "Gerencie as configurações da sua conta",
      appPreferences: "Preferências do App",
      language: "Idioma",
      theme: "Tema",
      lightMode: "Modo Claro",
      darkMode: "Modo Escuro",
      saveChanges: "Salvar Alterações",
      settingsSaved: "Configurações salvas com sucesso!",
      logout: "Sair",
      deleteAccount: "Excluir Conta",
      changePassword: "Alterar Senha",
      editHealthData: "Editar Dados de Saúde",
      premium: "Premium",
      currentStatus: "Status atual",
      viewPremiumPlans: "Ver Planos Premium",
      supportLegal: "Suporte e Legal",
      sendFeedback: "Enviar Feedback",
      termsOfUse: "Termos de Uso",
      privacyPolicy: "Política de Privacidade",
      featureComingSoon: "Este recurso está chegando em breve!",
      guest: "Visitante",
      free: "Gratuito",
      
      // Edit Profile
      ageWarning: "Alterar sua idade afetará os cálculos de idade biológica",
      biomarkersNotEditable: "Biomarcadores só podem ser atualizados enviando um novo exame",
      
      // Premium
      premiumPlans: "Planos Premium",
      unlockFullPotential: "Desbloqueie Todo Seu Potencial",
      premiumDescription: "Tenha acesso ilimitado a todos os recursos e leve sua jornada de saúde para o próximo nível.",
      monthlyPlan: "Mensal",
      monthlyPlanDesc: "Cobrado mensalmente, cancele quando quiser",
      installmentPlan: "Parcelado",
      installmentPlanDesc: "Pague em 7 parcelas",
      month: "mês",
      popular: "Mais Popular",
      subscribe: "Assinar",
      premiumBenefit1: "Uploads ilimitados de exames",
      premiumBenefit2: "Análise avançada de IA",
      premiumBenefit3: "Histórico completo de análises",
      premiumBenefit4: "Acompanhamento de tendências",
      premiumDisclaimer: "Assinatura renova automaticamente. Cancele a qualquer momento nas configurações.",
      premiumFeature: "Recurso Premium",
      unlockNow: "Desbloquear Agora",
      
      // Tutorial
      skip: "Pular",
      getStarted: "Começar",
      tutorialStep1Title: "Envie Seu Exame",
      tutorialStep1Desc: "Envie seus resultados de exame de sangue como PDF ou imagem e deixe nossa IA extrair seus biomarcadores.",
      tutorialStep2Title: "Descubra Sua Idade Biológica",
      tutorialStep2Desc: "Veja como seu corpo está realmente envelhecendo com base nos seus biomarcadores e estilo de vida.",
      tutorialStep3Title: "Receba Recomendações Personalizadas",
      tutorialStep3Desc: "Receba dicas de saúde acionáveis adaptadas ao seu perfil único.",
      
      // Biomarkers
      totalCholesterol: "Colesterol Total",
      hdl: "HDL",
      ldl: "LDL",
      triglycerides: "Triglicerídeos",
      glucose: "Glicose",
      hemoglobin: "Hemoglobina",
      creatinine: "Creatinina",
      ast: "AST",
      alt: "ALT",
      ggt: "GGT",
      vitaminD: "Vitamina D",
      tsh: "TSH",
      crp: "PCR",
      notAvailable: "Não Disponível",
      
      // Biomarker Tooltips
      totalCholesterolTooltip: "O colesterol total mede todo o colesterol no sangue. Níveis altos podem aumentar o risco de doenças cardíacas.",
      hdlTooltip: "HDL é o colesterol 'bom' que ajuda a remover outras formas de colesterol da corrente sanguínea.",
      ldlTooltip: "LDL é o colesterol 'ruim' que pode se acumular nas artérias e aumentar o risco de doenças cardíacas.",
      triglycericesTooltip: "Triglicerídeos são gorduras no sangue. Níveis altos podem aumentar o risco de doenças cardíacas.",
      glucoseTooltip: "A glicose no sangue mede os níveis de açúcar. Níveis altos podem indicar risco de diabetes.",
      hemoglobinTooltip: "A hemoglobina transporta oxigênio no sangue. Níveis baixos podem indicar anemia.",
      creatinineTooltip: "A creatinina é um produto residual filtrado pelos rins. Níveis altos podem indicar problemas renais.",
      astTooltip: "AST é uma enzima encontrada no fígado. Níveis elevados podem indicar dano hepático.",
      altTooltip: "ALT é uma enzima hepática. Níveis altos frequentemente indicam inflamação ou dano no fígado.",
      ggtTooltip: "GGT é uma enzima hepática que pode indicar problemas no fígado ou nas vias biliares quando elevada.",
      vitaminDTooltip: "A vitamina D é essencial para a saúde óssea e função imunológica. Níveis baixos são comuns.",
      tshTooltip: "O TSH controla a produção de hormônios da tireoide. Níveis anormais podem indicar problemas na tireoide.",
      crpTooltip: "A PCR indica inflamação no corpo. Níveis altos podem sinalizar infecção ou condições crônicas.",
      
      // Disclaimer
      disclaimer: "Este aplicativo não fornece diagnóstico médico. Sempre consulte um profissional de saúde.",
      
      // General
      loading: "Carregando...",
      error: "Ocorreu um erro",
      success: "Sucesso",
      cancel: "Cancelar",
      save: "Salvar",
      delete: "Excluir",
      edit: "Editar",
      uploadForRecommendations: "Envie seus exames para receber recomendações personalizadas",
      
      // New Dashboard
      bioAge: "Idade Bio",
      risk: "Risco",
      tips: "Dicas",
      healthProjections: "Projeções de Saúde",
      projectionNext10Years: "Projeção próximos 10 anos",
      cardiovascularHealth: "Saúde Cardiovascular",
      inflammatoryMarkers: "Marcadores Inflamatórios",
      fastingGlucose: "Glicose em Jejum",
      trend: "Tendência",
      biomarkers: "Biomarcadores",
      normal: "Normal",
      actions: "Ações",
      updatedAt: "Atualizado em",
      updatedNow: "Atualizado agora",
      glucoseMetabolism: "Metabolismo da Glicose",
      
      // Health Goals (snake_case keys from database)
      lose_weight: "Perder Peso",
      improve_energy: "Melhorar Energia",
      improve_sleep: "Melhorar Sono",
      reduce_cholesterol: "Reduzir Colesterol",
      reduce_blood_sugar: "Reduzir Açúcar no Sangue",
      increase_longevity: "Aumentar Longevidade",
      
      // Auth Toast Messages
      signUpFailed: "Falha ao cadastrar",
      accountCreated: "Conta criada!",
      welcomeToApp: "Bem-vindo ao LongLife AI",
      googleSignInFailed: "Falha ao entrar com Google",
      signedOut: "Desconectado",
      seeYouNextTime: "Até a próxima!",
      checkYourEmail: "Verifique seu e-mail",
      resetLinkSent: "Enviamos um link para redefinir sua senha",
      signInFailed: "Falha ao entrar",
      resetFailed: "Falha ao redefinir",
      
      // Lab Upload
      invalidFileType: "Tipo de arquivo inválido",
      pleaseUploadValidFile: "Por favor, envie um arquivo PDF, PNG ou JPG",
      thisMayTakeMoment: "Isso pode levar um momento...",
      uploadingFile: "Enviando...",
      analyzeLabResults: "Analisar Exame",
      biomarkersExtracted: "Seus biomarcadores foram extraídos com sucesso!",
      failedToAnalyze: "Falha ao analisar resultados do exame",
    },
  },
};

// Function to get initial language
const getInitialLanguage = (): string => {
  // Check sessionStorage for guest
  const sessionLang = sessionStorage.getItem('longlife-language-guest');
  if (sessionLang) return sessionLang;
  
  // Check localStorage
  const storedLang = localStorage.getItem('longlife-language');
  if (storedLang) return storedLang;
  
  // Default to Portuguese (Brazil)
  return 'pt';
};

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'pt',
  interpolation: {
    escapeValue: false,
  },
});

// Helper function to change language and persist it
export const changeLanguage = async (lang: string, isGuest: boolean = false) => {
  i18n.changeLanguage(lang);
  localStorage.setItem('longlife-language', lang);
  
  if (isGuest) {
    sessionStorage.setItem('longlife-language-guest', lang);
  } else {
    // Try to save to profile if logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ language: lang, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
    }
  }
};

export default i18n;
