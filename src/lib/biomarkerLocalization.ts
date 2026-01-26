/**
 * Biomarker Localization Layer
 * Maps English values to Portuguese and provides educational explanations
 */

// Translation map for common English biomarker values to Portuguese
const valueTranslations: Record<string, string> = {
  // Colors
  'yellow': 'Amarelo',
  'clear yellow': 'Amarelo Claro',
  'light yellow': 'Amarelo Claro',
  'dark yellow': 'Amarelo Escuro',
  'amber': 'Âmbar',
  'red': 'Vermelho',
  'brown': 'Marrom',
  'orange': 'Laranja',
  'green': 'Verde',
  'blue': 'Azul',
  'colorless': 'Incolor',
  'straw': 'Palha',
  
  // Appearance/Aspect
  'clear': 'Límpido',
  'slightly cloudy': 'Ligeiramente Turvo',
  'cloudy': 'Turvo',
  'turbid': 'Turvo',
  'hazy': 'Nebuloso',
  'transparent': 'Transparente',
  'opaque': 'Opaco',
  
  // Presence indicators
  'negative': 'Negativo',
  'positive': 'Positivo',
  'absent': 'Ausente',
  'present': 'Presente',
  'none': 'Nenhum',
  'none detected': 'Não Detectado',
  'not detected': 'Não Detectado',
  'detected': 'Detectado',
  'trace': 'Traços',
  'traces': 'Traços',
  
  // Quantity descriptors
  'rare': 'Raras',
  'few': 'Poucas',
  'some': 'Algumas',
  'moderate': 'Moderado',
  'many': 'Muitas',
  'numerous': 'Numerosas',
  'abundant': 'Abundantes',
  'occasional': 'Ocasionais',
  'frequent': 'Frequentes',
  'scarce': 'Escassas',
  
  // Semi-quantitative
  '+': '+',
  '++': '++',
  '+++': '+++',
  '++++': '++++',
  '1+': '1+',
  '2+': '2+',
  '3+': '3+',
  '4+': '4+',
  
  // Normal/abnormal
  'normal': 'Normal',
  'abnormal': 'Anormal',
  'within normal limits': 'Dentro dos Limites Normais',
  'reactive': 'Reativo',
  'non-reactive': 'Não Reativo',
  
  // Bacteria
  'no bacteria': 'Sem Bactérias',
  'bacteria present': 'Bactérias Presentes',
  'few bacteria': 'Poucas Bactérias',
  
  // Other common terms
  'intact': 'Íntegras',
  'fragmented': 'Fragmentadas',
  'granular': 'Granulosos',
  'hyaline': 'Hialinos',
  'cellular': 'Celulares',
  'mucus': 'Muco',
  'crystals': 'Cristais',
  'casts': 'Cilindros',
};

// Biomarker name translations
const nameTranslations: Record<string, string> = {
  // Urine biomarkers
  'color': 'Cor',
  'colour': 'Cor',
  'appearance': 'Aspecto',
  'aspect': 'Aspecto',
  'transparency': 'Transparência',
  'clarity': 'Clareza',
  'protein': 'Proteínas',
  'proteins': 'Proteínas',
  'glucose': 'Glicose',
  'ketones': 'Cetonas',
  'ketone bodies': 'Corpos Cetônicos',
  'blood': 'Sangue',
  'hemoglobin': 'Hemoglobina',
  'bilirubin': 'Bilirrubina',
  'urobilinogen': 'Urobilinogênio',
  'nitrite': 'Nitrito',
  'nitrites': 'Nitritos',
  'leukocytes': 'Leucócitos',
  'leukocyte esterase': 'Esterase Leucocitária',
  'white blood cells': 'Leucócitos',
  'wbc': 'Leucócitos',
  'red blood cells': 'Hemácias',
  'rbc': 'Hemácias',
  'erythrocytes': 'Hemácias',
  'epithelial cells': 'Células Epiteliais',
  'squamous epithelial cells': 'Células Epiteliais Escamosas',
  'bacteria': 'Bactérias',
  'yeast': 'Leveduras',
  'mucus': 'Muco',
  'casts': 'Cilindros',
  'crystals': 'Cristais',
  'specific gravity': 'Densidade',
  'density': 'Densidade',
  'ph': 'pH',
  
  // Blood biomarkers
  'total cholesterol': 'Colesterol Total',
  'hdl': 'HDL',
  'hdl cholesterol': 'Colesterol HDL',
  'ldl': 'LDL',
  'ldl cholesterol': 'Colesterol LDL',
  'triglycerides': 'Triglicerídeos',
  'fasting glucose': 'Glicose de Jejum',
  'glycated hemoglobin': 'Hemoglobina Glicada',
  'hba1c': 'HbA1c',
  'insulin': 'Insulina',
  'creatinine': 'Creatinina',
  'urea': 'Ureia',
  'uric acid': 'Ácido Úrico',
  'ast': 'AST',
  'alt': 'ALT',
  'ggt': 'GGT',
  'alkaline phosphatase': 'Fosfatase Alcalina',
  'tsh': 'TSH',
  't3': 'T3',
  't4': 'T4',
  'free t4': 'T4 Livre',
  'vitamin d': 'Vitamina D',
  'vitamin b12': 'Vitamina B12',
  'ferritin': 'Ferritina',
  'iron': 'Ferro',
  'crp': 'PCR',
  'c-reactive protein': 'Proteína C-Reativa',
  'platelets': 'Plaquetas',
  'hematocrit': 'Hematócrito',
  'mcv': 'VCM',
  'mch': 'HCM',
  'mchc': 'CHCM',
  'rdw': 'RDW',
};

// Educational explanations for biomarkers (Portuguese, non-medical language)
const biomarkerExplanations: Record<string, string> = {
  // Urine biomarkers
  'cor': 'A cor da urina indica seu nível de hidratação e pode sinalizar algumas condições. Urina amarelo claro geralmente indica boa hidratação.',
  'aspecto': 'Indica se a urina está límpida ou turva. O aspecto límpido é considerado normal e indica ausência de partículas visíveis.',
  'transparência': 'Avalia a clareza da urina. Uma urina transparente e límpida é considerada normal.',
  'proteínas': 'Pequenas quantidades de proteína na urina são normais. Níveis elevados podem indicar que os rins estão precisando de atenção.',
  'glicose': 'Normalmente não deve haver glicose na urina. A presença pode estar relacionada aos níveis de açúcar no sangue.',
  'cetonas': 'Substâncias produzidas quando o corpo queima gordura para energia. Podem aparecer durante jejum prolongado ou dietas com restrição de carboidratos.',
  'corpos cetônicos': 'Substâncias produzidas quando o corpo queima gordura para energia. Podem aparecer durante jejum prolongado ou dietas com restrição de carboidratos.',
  'sangue': 'A presença de sangue na urina deve ser investigada. Pode ter várias causas, desde exercício intenso até condições que precisam de acompanhamento.',
  'hemoglobina': 'Proteína responsável pelo transporte de oxigênio no sangue. Níveis adequados são importantes para energia e vitalidade.',
  'bilirrubina': 'Substância produzida quando o corpo recicla células sanguíneas antigas. Níveis elevados podem indicar que o fígado precisa de atenção.',
  'urobilinogênio': 'Substância formada no intestino a partir da bilirrubina. Pequenas quantidades são normais na urina.',
  'nitrito': 'Resultado negativo é normal. Resultado positivo pode indicar presença de bactérias e possível infecção urinária.',
  'nitritos': 'Resultado negativo é normal. Resultado positivo pode indicar presença de bactérias e possível infecção urinária.',
  'leucócitos': 'São células de defesa do corpo. Quantidades normais na urina são baixas. Níveis elevados podem indicar inflamação ou infecção.',
  'esterase leucocitária': 'Enzima liberada pelos leucócitos. Sua presença pode indicar inflamação no trato urinário.',
  'hemácias': 'São as células vermelhas do sangue. Pequenas quantidades podem ser normais. Quantidades maiores devem ser investigadas.',
  'células epiteliais': 'São células naturais do trato urinário. Quantidades raras a poucas geralmente são consideradas normais.',
  'bactérias': 'A urina normalmente é estéril. A presença de bactérias pode indicar contaminação da amostra ou infecção.',
  'leveduras': 'Fungos que normalmente não devem estar presentes em quantidades significativas na urina.',
  'muco': 'Produzido naturalmente pelo trato urinário. Pequenas quantidades são normais.',
  'cilindros': 'Estruturas formadas nos rins. Sua presença e tipo podem fornecer informações sobre a saúde renal.',
  'cristais': 'Podem se formar na urina dependendo do pH e concentração. Alguns tipos são normais, outros merecem acompanhamento.',
  'densidade': 'Indica a concentração da urina. Valores normais mostram que os rins estão concentrando adequadamente.',
  'ph': 'Mede a acidez da urina. Varia conforme a dieta e pode influenciar a formação de cristais.',
  
  // Blood biomarkers
  'colesterol total': 'Soma de todos os tipos de colesterol no sangue. É importante para a produção de hormônios, mas em excesso pode se acumular nas artérias.',
  'hdl': 'Conhecido como colesterol "bom". Ajuda a remover o excesso de colesterol das artérias. Níveis mais altos são geralmente melhores.',
  'colesterol hdl': 'Conhecido como colesterol "bom". Ajuda a remover o excesso de colesterol das artérias. Níveis mais altos são geralmente melhores.',
  'ldl': 'Conhecido como colesterol "ruim". Em excesso, pode se depositar nas paredes das artérias. É importante mantê-lo em níveis saudáveis.',
  'colesterol ldl': 'Conhecido como colesterol "ruim". Em excesso, pode se depositar nas paredes das artérias. É importante mantê-lo em níveis saudáveis.',
  'triglicerídeos': 'Tipo de gordura presente no sangue, usada como energia. Níveis elevados estão associados a maior risco cardiovascular.',
  'glicose de jejum': 'Nível de açúcar no sangue após período sem comer. Indica como o corpo processa a glicose.',
  'hemoglobina glicada': 'Mostra a média dos níveis de açúcar no sangue nos últimos 2-3 meses. Importante para acompanhar o controle glicêmico.',
  'hba1c': 'Mostra a média dos níveis de açúcar no sangue nos últimos 2-3 meses. Importante para acompanhar o controle glicêmico.',
  'insulina': 'Hormônio que ajuda o corpo a usar a glicose como energia. Seus níveis ajudam a avaliar o metabolismo.',
  'creatinina': 'Resíduo do metabolismo muscular, filtrado pelos rins. Seus níveis ajudam a avaliar a função renal.',
  'ureia': 'Resíduo do metabolismo de proteínas, eliminado pelos rins. Seus níveis ajudam a avaliar a função renal.',
  'ácido úrico': 'Resíduo do metabolismo de purinas. Níveis elevados podem estar associados a gota e pedras nos rins.',
  'ast': 'Enzima encontrada principalmente no fígado e coração. Seus níveis ajudam a avaliar a saúde desses órgãos.',
  'alt': 'Enzima encontrada principalmente no fígado. É um marcador sensível para avaliar a saúde hepática.',
  'ggt': 'Enzima que pode indicar como o fígado está funcionando. Pode ser afetada por medicamentos e álcool.',
  'fosfatase alcalina': 'Enzima presente em vários tecidos. Seus níveis podem indicar saúde óssea e hepática.',
  'tsh': 'Hormônio que controla a tireoide. Seus níveis ajudam a avaliar se a tireoide está funcionando adequadamente.',
  't3': 'Hormônio ativo da tireoide. Regula o metabolismo, energia e temperatura corporal.',
  't4': 'Principal hormônio produzido pela tireoide. É convertido em T3, a forma ativa.',
  't4 livre': 'Porção do T4 disponível para uso pelo corpo. Importante para avaliar a função da tireoide.',
  'vitamina d': 'Importante para ossos, imunidade e diversas funções do corpo. Muitas pessoas têm níveis insuficientes.',
  'vitamina b12': 'Essencial para o sistema nervoso e formação de células sanguíneas. Importante especialmente para vegetarianos.',
  'ferritina': 'Proteína que armazena ferro no corpo. Seus níveis indicam as reservas de ferro.',
  'ferro': 'Mineral essencial para o transporte de oxigênio no sangue. Importante para energia e vitalidade.',
  'pcr': 'Proteína que aumenta quando há inflamação no corpo. Níveis baixos são desejáveis.',
  'proteína c-reativa': 'Proteína que aumenta quando há inflamação no corpo. Níveis baixos são desejáveis.',
  'plaquetas': 'Células responsáveis pela coagulação do sangue. Importantes para parar sangramentos.',
  'hematócrito': 'Proporção de células vermelhas no sangue. Indica a capacidade de transportar oxigênio.',
  'vcm': 'Tamanho médio das hemácias. Ajuda a identificar tipos de anemia.',
  'hcm': 'Quantidade média de hemoglobina por hemácia. Relacionado à capacidade de transportar oxigênio.',
  'chcm': 'Concentração média de hemoglobina nas hemácias. Ajuda a avaliar a qualidade das células vermelhas.',
  'rdw': 'Variação no tamanho das hemácias. Pode ajudar a identificar diferentes condições.',
};

/**
 * Escapes special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Translates a biomarker value from English to Portuguese
 */
export function translateBiomarkerValue(value: string): string {
  if (!value) return value;
  
  const normalizedValue = value.toLowerCase().trim();
  
  // Check direct translation
  if (valueTranslations[normalizedValue]) {
    return valueTranslations[normalizedValue];
  }
  
  // Try to find partial matches for compound values
  let translatedValue = value;
  for (const [english, portuguese] of Object.entries(valueTranslations)) {
    const escapedEnglish = escapeRegex(english);
    const regex = new RegExp(`\\b${escapedEnglish}\\b`, 'gi');
    translatedValue = translatedValue.replace(regex, portuguese);
  }
  
  // If no translation found and value looks like English, return original
  // Portuguese values will pass through unchanged
  return translatedValue;
}

/**
 * Translates a biomarker name from English to Portuguese
 */
export function translateBiomarkerName(name: string): string {
  if (!name) return name;
  
  const normalizedName = name.toLowerCase().trim();
  
  // Check direct translation
  if (nameTranslations[normalizedName]) {
    return nameTranslations[normalizedName];
  }
  
  // Return original if already in Portuguese or no translation found
  return name;
}

/**
 * Gets the educational explanation for a biomarker
 * Returns undefined if no explanation is available
 */
export function getBiomarkerExplanation(name: string): string | undefined {
  if (!name) return undefined;
  
  const normalizedName = name.toLowerCase().trim();
  
  // Check direct match
  if (biomarkerExplanations[normalizedName]) {
    return biomarkerExplanations[normalizedName];
  }
  
  // Try English to Portuguese translation first, then look up
  const translatedName = translateBiomarkerName(name).toLowerCase().trim();
  if (biomarkerExplanations[translatedName]) {
    return biomarkerExplanations[translatedName];
  }
  
  return undefined;
}

/**
 * Checks if an explanation exists for a biomarker
 */
export function hasExplanation(name: string): boolean {
  return getBiomarkerExplanation(name) !== undefined;
}

// Patterns that indicate explanatory text rather than a simple result
const explanatoryPatterns = [
  /não houve/i,
  /após.*incubação/i,
  /crescimento.*bacteriano/i,
  /resultado.*indica/i,
  /presença de/i,
  /ausência de/i,
  /dentro.*limites/i,
  /valores.*referência/i,
  /observa-se/i,
  /detectado.*presença/i,
];

// Map explanatory text patterns to concise results
const explanatoryToResult: Array<{ pattern: RegExp; result: string }> = [
  { pattern: /não houve crescimento/i, result: 'Negativo' },
  { pattern: /sem crescimento/i, result: 'Negativo' },
  { pattern: /ausência de/i, result: 'Ausente' },
  { pattern: /não detectad[oa]/i, result: 'Não Detectado' },
  { pattern: /não observad[oa]/i, result: 'Ausente' },
  { pattern: /negativo para/i, result: 'Negativo' },
  { pattern: /positivo para/i, result: 'Positivo' },
  { pattern: /presença de/i, result: 'Presente' },
  { pattern: /dentro.*normais?/i, result: 'Normal' },
  { pattern: /dentro.*limites/i, result: 'Normal' },
  { pattern: /valores? normal/i, result: 'Normal' },
];

/**
 * Checks if a value is explanatory text rather than a concise result
 */
export function isExplanatoryValue(value: string): boolean {
  if (!value) return false;
  
  // If value is very long, it's likely explanatory
  if (value.length > 40) return true;
  
  // Check for explanatory patterns
  return explanatoryPatterns.some(pattern => pattern.test(value));
}

/**
 * Normalizes an explanatory value to a concise result
 * Returns the original value if it's already concise
 */
export function normalizeToResult(value: string): string {
  if (!value) return value;
  
  // If not explanatory, return as-is (with translation)
  if (!isExplanatoryValue(value)) {
    return translateBiomarkerValue(value);
  }
  
  // Try to map to a concise result
  for (const { pattern, result } of explanatoryToResult) {
    if (pattern.test(value)) {
      return result;
    }
  }
  
  // Fallback: if we can't determine, return "Ver detalhes"
  return 'Ver detalhes';
}

/**
 * Gets explanatory text for the tooltip
 * Returns the original value if it's explanatory, otherwise undefined
 */
export function getExplanatoryText(value: string): string | undefined {
  if (!value) return undefined;
  
  if (isExplanatoryValue(value)) {
    return value;
  }
  
  return undefined;
}
