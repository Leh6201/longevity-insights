import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

const resources = {
  pt: {
    translation: {
      // Name Step
      whatShouldWeCallYou: "Como devemos te chamar?",
      namePersonalizationDesc: "Este nome será usado para personalizar sua experiência no app.",
      yourName: "Seu nome",
      namePlaceholder: "Digite seu nome",
      helloUser: "Olá, {{name}} 👋",
      letsPersonalize: "Vamos personalizar sua experiência, {{name}}",
      
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
      nameInfo: "Vamos começar nos conhecendo melhor",
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
      sleepAverage: "Médio",
      sleepGood: "Bom",
      alcoholConsumption: "Consumo de Álcool",
      alcoholNone: "Nenhum",
      alcoholLow: "Baixo",
      alcoholModerate: "Médio",
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
      glucoseInfo: "Mede o nível de açúcar no sangue. Valores elevados podem indicar risco de diabetes. Manter níveis saudáveis ajuda a prevenir problemas de saúde.",
      cholesterolInfo: "Gordura essencial no sangue. Em excesso, pode se acumular nas artérias e aumentar o risco de doenças cardíacas.",
      hemoglobinInfo: "Proteína que transporta oxigênio no sangue. Níveis baixos podem indicar anemia, causando cansaço e fraqueza.",
      hdlInfo: "O 'colesterol bom'. Ajuda a remover o colesterol ruim das artérias, protegendo seu coração e vasos sanguíneos.",
      ldlInfo: "O 'colesterol ruim'. Em excesso, pode se depositar nas paredes das artérias, aumentando o risco de problemas cardíacos.",
      metabolicRiskInfo: "Avalia o risco de desenvolver síndrome metabólica, que inclui obesidade, diabetes e pressão alta. Manter um estilo de vida saudável reduz esse risco.",
      cardiovascularInfo: "Indica a saúde do seu coração e vasos sanguíneos. Fatores como colesterol, pressão arterial e estilo de vida afetam essa pontuação.",
      inflammatoryInfo: "Mede sinais de inflamação no corpo. Inflamação crônica pode estar ligada a várias doenças, incluindo problemas cardíacos.",
      fastingGlucoseInfo: "Mede o açúcar no sangue após jejum. É o principal indicador para detectar diabetes e pré-diabetes precocemente.",
      altTrendInfo: "ALT é uma enzima do fígado. Níveis elevados podem indicar estresse hepático causado por alimentação, medicamentos ou outras condições.",
      normal: "Normal",
      attention: "Atenção",
      actions: "Ações",
      updatedAt: "Atualizado em",
      updatedNow: "Atualizado agora",
      noBiomarkersDetected: "Nenhum biomarcador detectado",
      noBiomarkersDescription: "Não conseguimos identificar biomarcadores neste documento. Certifique-se de que o exame está legível e tente novamente.",
      
      // Profile Summary
      profileSummary: "Resumo do Perfil",
      primaryGoal: "Objetivo principal",
      bmiStatus: "Status IMC",
      hydration: "Hidratação",
      increaseWaterIntake: "Aumentar ingestão",
      goodWaterIntake: "Adequada",
      healthFocus: "Foco na saúde",
      bmiUnderweight: "Abaixo do peso",
      bmiNormal: "Normal",
      bmiOverweight: "Sobrepeso",
      bmiObese: "Atenção",
      glucoseMetabolism: "Metabolismo da Glicose",
      
      // Health Goals (snake_case keys from database)
      lose_weight: "Perder Peso",
      improve_energy: "Melhorar Energia",
      improve_sleep: "Melhorar Sono",
      reduce_cholesterol: "Reduzir Colesterol",
      reduce_blood_sugar: "Reduzir Açúcar no Sangue",
      increase_longevity: "Aumentar Longevidade",
      
      // Personalized Insights
      personalizedInsights: "Insights personalizados para você",
      insightUnderweight: "Seu peso está abaixo do ideal. Uma alimentação balanceada pode ajudar a alcançar um peso saudável.",
      insightHealthyWeight: "Você está em um peso saudável! Continue mantendo seus bons hábitos alimentares.",
      insightOverweight: "Pequenos ajustes na alimentação e exercícios podem ajudar você a alcançar um peso mais saudável.",
      insightObesity: "Cuidar do peso é importante para sua saúde. Considere buscar orientação de um profissional.",
      insightGoodHydration: "Ótimo! Você está mantendo uma boa hidratação diária.",
      insightModerateHydration: "Tente aumentar um pouco sua ingestão de água para melhorar a hidratação.",
      insightLowHydration: "Beber mais água pode melhorar sua energia e concentração ao longo do dia.",
      insightGoodSleep: "Que bom! Uma boa qualidade de sono favorece sua saúde e bem-estar.",
      insightAverageSleep: "Melhorar a qualidade do sono pode aumentar sua energia e disposição.",
      insightPoorSleep: "O sono é fundamental para sua saúde. Considere ajustar sua rotina noturna.",
      insightHighActivity: "Parabéns! Você mantém uma excelente frequência de atividade física.",
      insightModerateActivity: "Você está no caminho certo com seus exercícios. Continue assim!",
      insightLowActivity: "Um pouco mais de movimento pode trazer grandes benefícios para sua saúde.",
      insightNoActivity: "Começar com pequenas atividades físicas pode fazer uma grande diferença.",
      insightGreatMentalHealth: "Ótimo! Você está cuidando bem da sua saúde mental.",
      insightModerateMentalHealth: "Reservar tempo para relaxar e cuidar de si pode melhorar seu bem-estar.",
      insightLowMentalHealth: "Sua saúde mental é importante. Considere conversar com alguém de confiança.",
      insightNoAlcohol: "Parabéns por manter um estilo de vida sem álcool!",
      insightHighAlcohol: "Reduzir o consumo de álcool pode trazer benefícios significativos para sua saúde.",
      insightGoalLoseWeight: "Seu foco em perder peso é um ótimo passo para uma vida mais saudável.",
      insightGoalImproveEnergy: "Melhorar sua energia diária vai transformar sua qualidade de vida.",
      insightGoalImproveSleep: "Priorizar o sono é fundamental para sua saúde e bem-estar.",
      insightGoalReduceCholesterol: "Controlar o colesterol é essencial para a saúde do coração.",
      insightGoalReduceBloodSugar: "Manter o açúcar no sangue equilibrado protege sua saúde a longo prazo.",
      insightGoalIncreaseLongevity: "Investir na longevidade é cuidar do seu futuro com sabedoria.",
      
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
      
      // Exams History
      examsHistory: "Histórico de Exames",
      examsHistoryDescription: "Seus exames são salvos automaticamente. Acesse e gerencie seu histórico a qualquer momento.",
      noExamsYet: "Nenhum exame ainda",
      uploadFirstExam: "Envie seu primeiro exame para descobrir sua idade biológica!",
      exam: "Exame",
      viewDetails: "Ver Detalhes",
      totalExams: "{{count}} exame(s) no histórico",
      failedToAnalyze: "Falha ao analisar resultados do exame",
      
      // Dashboard Tabs
      tabSummary: "Resumo",
      tabInsights: "Insights",
      tabProfile: "Perfil",
      
      // Insights Tab - Enhanced
      insightsDescription: "Entenda o que seus dados significam para sua saúde",
      noInsightsYet: "Complete seu perfil para receber insights personalizados",
      priorityFocus: "Áreas de Atenção",
      priorityFocusDescription: "Estes pontos merecem sua atenção prioritária",
      updateYourInfo: "Atualize suas informações de saúde",
      goalsDriverDescription: "Seus insights são personalizados com base nestes objetivos",
      calculatedInsights: "Análise Personalizada",
      calculatedInsightsDescription: "Insights calculados a partir dos seus dados de saúde",
      
      // Insight Labels
      insightReported: "Informado",
      insightCalculated: "Calculado",
      insightRecommended: "Recomendado",
      insightDay: "dia",
      insightYears: "anos",
      insightRelatedTo: "Relacionado a",
      
      // Insight Categories
      insightCategoryBmi: "IMC",
      insightCategoryBmiTooltip: "Índice de Massa Corporal",
      insightCategoryHydration: "Hidratação",
      insightCategorySleep: "Qualidade do Sono",
      insightCategoryActivity: "Atividade Física",
      insightCategoryMentalHealth: "Saúde Mental",
      insightCategoryAlcohol: "Consumo de Álcool",
      insightCategoryAge: "Considerações pela Idade",
      
      // BMI Status Labels
      bmiStatusUnderweight: "Abaixo do peso",
      bmiStatusNormal: "Peso saudável",
      bmiStatusOverweight: "Sobrepeso",
      bmiStatusObese: "Obesidade",
      
      // BMI Insights
      insightBmiUnderweightInterpretation: "Seu IMC indica que seu peso está abaixo do recomendado para sua altura.",
      insightBmiUnderweightReason: "O peso abaixo do ideal pode afetar sua energia, imunidade e saúde óssea. Considere consultar um nutricionista para um plano alimentar adequado.",
      insightBmiNormalInterpretation: "Seu IMC está dentro da faixa saudável, indicando um bom equilíbrio entre peso e altura.",
      insightBmiNormalReason: "Manter o peso saudável reduz riscos de doenças cardiovasculares e metabólicas. Continue com seus hábitos positivos.",
      insightBmiOverweightInterpretation: "Seu IMC indica sobrepeso, o que significa que há uma quantidade de gordura corporal acima do ideal.",
      insightBmiOverweightReason: "O sobrepeso pode aumentar o risco de problemas como pressão alta, diabetes e doenças cardíacas. Pequenas mudanças na alimentação e atividade física podem fazer grande diferença.",
      insightBmiObeseInterpretation: "Seu IMC indica obesidade, uma condição que requer atenção para sua saúde geral.",
      insightBmiObeseReason: "A obesidade está associada a diversos riscos de saúde. Recomendamos buscar orientação de profissionais de saúde para um plano personalizado.",
      
      // Hydration Insights
      insightHydrationAdequateInterpretation: "Sua ingestão de água atende ou supera a recomendação calculada para seu peso.",
      insightHydrationAdequateReason: "Manter-se bem hidratado melhora a função cognitiva, digestão, e ajuda a eliminar toxinas do corpo.",
      insightHydrationModerateInterpretation: "Sua ingestão de água está um pouco abaixo do ideal para seu peso corporal.",
      insightHydrationModerateReason: "Tente aumentar gradualmente sua ingestão de água ao longo do dia para melhorar energia e concentração.",
      insightHydrationLowInterpretation: "Sua ingestão de água está significativamente abaixo da recomendação para seu peso.",
      insightHydrationLowReason: "A desidratação pode causar fadiga, dores de cabeça e afetar sua concentração. Considere usar lembretes para beber água.",
      insightHydrationAgeReason: "Com a idade, a sensação de sede diminui naturalmente. É importante manter um hábito regular de hidratação mesmo sem sentir sede.",
      insightHydrationAgeLowReason: "Após os 50 anos, a hidratação adequada é ainda mais importante para a saúde renal e função cognitiva. Estabeleça uma rotina de hidratação.",
      
      // Sleep Insights
      insightSleepGoodInterpretation: "Você reportou uma boa qualidade de sono, essencial para sua saúde geral.",
      insightSleepGoodReason: "O sono de qualidade fortalece o sistema imunológico, melhora a memória e ajuda na recuperação muscular. Continue priorizando seu descanso.",
      insightSleepAverageInterpretation: "Sua qualidade de sono é mediana, indicando que há espaço para melhorias.",
      insightSleepAverageReason: "Considere ajustar sua rotina noturna: evite telas antes de dormir, mantenha horários regulares e crie um ambiente escuro e silencioso.",
      insightSleepPoorInterpretation: "Você reportou sono de baixa qualidade, o que pode estar afetando sua saúde e bem-estar.",
      insightSleepPoorReason: "A falta de sono adequado afeta humor, concentração, metabolismo e imunidade. Priorizar a melhoria do sono pode trazer benefícios significativos para sua vida.",
      
      // Activity Insights
      insightActivityHighInterpretation: "Você mantém uma excelente frequência de atividade física semanal.",
      insightActivityHighReason: "A atividade física regular melhora a saúde cardiovascular, fortalece ossos e músculos, e contribui para o bem-estar mental.",
      insightActivityModerateInterpretation: "Sua frequência de exercícios está em um bom nível, atendendo às recomendações de saúde.",
      insightActivityModerateReason: "Continue assim! A consistência é mais importante que a intensidade. Sua rotina de exercícios contribui para sua longevidade.",
      insightActivityLowInterpretation: "Sua frequência de atividade física está abaixo do ideal recomendado para a saúde.",
      insightActivityLowReason: "Adicionar mais movimento ao seu dia pode melhorar sua energia, humor e saúde cardiovascular. Comece gradualmente.",
      insightActivityNoneInterpretation: "Você reportou não praticar atividade física regular atualmente.",
      insightActivityNoneReason: "A atividade física é um dos pilares da saúde. Mesmo caminhadas curtas podem trazer benefícios. Considere iniciar com atividades leves.",
      
      // Mental Health Insights
      insightMentalHighInterpretation: "Seu nível de saúde mental reportado está excelente.",
      insightMentalHighReason: "A saúde mental positiva melhora a qualidade de vida, relacionamentos e produtividade. Continue cuidando do seu bem-estar emocional.",
      insightMentalModerateInterpretation: "Seu nível de saúde mental está em uma faixa intermediária.",
      insightMentalModerateReason: "Reservar tempo para atividades prazerosas, conexões sociais e autocuidado pode ajudar a melhorar seu bem-estar mental.",
      insightMentalLowInterpretation: "Seu nível de saúde mental reportado merece atenção especial.",
      insightMentalLowReason: "Sua saúde mental é fundamental. Considere conversar com pessoas de confiança ou buscar apoio profissional. Você não precisa enfrentar isso sozinho.",
      
      // Alcohol Insights
      insightAlcoholNoneInterpretation: "Você reportou não consumir álcool.",
      insightAlcoholNoneReason: "Evitar o álcool contribui para melhor qualidade de sono, função hepática saudável e reduz riscos de diversas condições de saúde.",
      insightAlcoholHighInterpretation: "Seu consumo de álcool reportado está em um nível elevado.",
      insightAlcoholHighReason: "O consumo excessivo de álcool pode afetar o fígado, sono, peso e aumentar riscos de doenças. Considere reduzir gradualmente.",
      
      // Age Insights
      insightAgeInterpretation: "A partir dos 50 anos, seu corpo passa por mudanças que requerem atenção especial.",
      insightAgeReason: "Com a idade, a hidratação, recuperação muscular e prevenção tornam-se ainda mais importantes. Priorize check-ups regulares e mantenha hábitos saudáveis.",
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
