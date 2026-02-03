/**
 * Biomarker Localization Layer (Simplified)
 * 
 * NOTE: This file has been simplified. All interpretation logic has been moved to the AI.
 * The AI now generates display_value and explanation for each biomarker dynamically.
 * 
 * This file now only contains minimal fallback utilities for edge cases where
 * AI-generated values might be missing.
 */

// Simple name translations for fallback display (when AI doesn't provide translation)
const nameTranslations: Record<string, string> = {
  'color': 'Cor',
  'colour': 'Cor',
  'appearance': 'Aspecto',
  'aspect': 'Aspecto',
  'protein': 'Proteínas',
  'glucose': 'Glicose',
  'nitrite': 'Nitrito',
  'ph': 'pH',
  'density': 'Densidade',
  'hemoglobin': 'Hemoglobina',
  'total cholesterol': 'Colesterol Total',
  'hdl': 'HDL',
  'ldl': 'LDL',
  'triglycerides': 'Triglicerídeos',
  'creatinine': 'Creatinina',
  'tsh': 'TSH',
  'vitamin d': 'Vitamina D',
};

// Acrônimos comuns que devem permanecer em caixa alta
const knownAcronyms = new Set([
  'HDL',
  'LDL',
  'VLDL',
  'TGO',
  'TGP',
  'AST',
  'ALT',
  'GGT',
  'TSH',
  'T3',
  'T4',
  'HIV',
  'HBV',
  'HCV',
  'CRP',
  'PCR',
  'INR',
  'RNI',
  'DHL',
  'CK',
  'CHCM',
  'VCM',
  'HCM',
  'RDW',
]);

/**
 * Normaliza nomes que chegam em CAIXA ALTA (ex.: do OCR/IA) para uma capitalização
 * mais natural na UI, preservando siglas (LDL, HDL, TGO...).
 */
export function normalizeBiomarkerNameCase(input: string): string {
  if (!input) return input;

  // Mantém separadores (espaços, hífens, parênteses, etc.) para não "quebrar" o layout
  const parts = input.match(/[A-Za-zÀ-ÖØ-öø-ÿ0-9]+|[^A-Za-zÀ-ÖØ-öø-ÿ0-9]+/g);
  if (!parts) return input;

  return parts
    .map((part) => {
      // Se não é uma palavra (ex.: " - ", "(")
      if (!/^[A-Za-zÀ-ÖØ-öø-ÿ0-9]+$/.test(part)) return part;

      const upper = part.toLocaleUpperCase('pt-BR');
      const lower = part.toLocaleLowerCase('pt-BR');

      // Se já contém minúsculas (ex.: eGFR, pH), não mexe
      if (part !== upper) return part;

      // Preserva siglas
      if (knownAcronyms.has(upper)) return upper;

      // Heurística: tokens curtos em caixa alta geralmente são siglas (ex.: U/L)
      if (upper.length <= 4 && /[A-ZÀ-ÖØ-Ý]/.test(upper)) return upper;

      // Caso padrão: "COLESTEROL" -> "Colesterol"
      return lower.charAt(0).toLocaleUpperCase('pt-BR') + lower.slice(1);
    })
    .join('');
}

/**
 * Translates a biomarker name from English to Portuguese
 * Used as fallback when AI provides English names
 */
export function translateBiomarkerName(name: string): string {
  if (!name) return name;
  
  const normalizedName = name.toLowerCase().trim();
  
  // Check direct translation
  if (nameTranslations[normalizedName]) {
    return normalizeBiomarkerNameCase(nameTranslations[normalizedName]);
  }
  
  // Return original if already in Portuguese or no translation found
  return normalizeBiomarkerNameCase(name);
}

/**
 * Gets the explanation for a biomarker
 * Returns the AI-generated explanation from the biomarker data
 * This function is now a simple passthrough - the explanation comes from the database
 */
export function getBiomarkerExplanation(name: string, aiExplanation?: string | null): string | undefined {
  // Return AI-generated explanation if available
  if (aiExplanation) {
    return aiExplanation;
  }
  
  // No fallback - let the UI handle missing explanations
  return undefined;
}

/**
 * @deprecated - Use AI-generated display_value instead
 * Kept for backwards compatibility during migration
 */
export function translateBiomarkerValue(value: string): string {
  return value;
}

/**
 * @deprecated - Use AI-generated display_value instead
 */
export function normalizeToResult(value: string): string {
  return value;
}

/**
 * @deprecated - Use AI-generated explanation instead
 */
export function getExplanatoryText(value: string): string | undefined {
  return undefined;
}

/**
 * @deprecated
 */
export function isExplanatoryValue(value: string): boolean {
  return false;
}

/**
 * @deprecated
 */
export function hasExplanation(name: string): boolean {
  return false;
}
