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

/**
 * Translates a biomarker name from English to Portuguese
 * Used as fallback when AI provides English names
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
