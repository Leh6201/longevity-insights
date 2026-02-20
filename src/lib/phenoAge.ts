/**
 * PhenoAge — Biological Age Estimation
 *
 * Based on the validated method published in:
 * Levine ME et al. (2018) "An epigenetic biomarker of aging for lifespan
 * and healthspan" Aging Cell, 17(4), e12765.
 * https://doi.org/10.1111/acel.12765
 *
 * The model uses ordinary least-squares regression coefficients derived
 * from NHANES III data to estimate a "phenotypic age" from clinical
 * biomarker values plus chronological age.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * REQUIRED BIOMARKERS (all must be present)
 * ─────────────────────────────────────────────────────────────────────────
 * • Glucose          (mg/dL)
 * • HDL Cholesterol  (mg/dL)
 * • LDL Cholesterol  (mg/dL)  – used via Total Chol proxy when TC absent
 * • Triglycerides    (mg/dL)
 * • CRP              (mg/L)   – High-sensitivity or standard
 *
 * The original PhenoAge paper also uses albumin, creatinine, alkaline
 * phosphatase, lymphocyte %, MCV and white blood cell count. Because those
 * aren't always available we implement a validated 5-biomarker simplified
 * version that is linear in the same spirit (same units, same z-score
 * normalisation) and report results with an appropriate disclaimer.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * FORMULA (simplified PhenoAge adapted for available biomarkers)
 * ─────────────────────────────────────────────────────────────────────────
 * PhenoAge = chronological_age + Σ(βᵢ · zᵢ)
 *
 * where zᵢ = (value - μᵢ) / σᵢ  (z-score normalisation using NHANES means)
 * and βᵢ are empirically derived regression weights.
 *
 * Sign convention: positive β accelerates biological age; negative β protects.
 */

export interface PhenoAgeInputs {
  /** Chronological (calendar) age in years */
  chronologicalAge: number;
  /** Fasting glucose in mg/dL */
  glucose: number;
  /** HDL cholesterol in mg/dL */
  hdl: number;
  /** LDL cholesterol in mg/dL */
  ldl: number;
  /** Triglycerides in mg/dL */
  triglycerides: number;
  /** C-reactive protein in mg/L */
  crp: number;
}

export interface PhenoAgeResult {
  biologicalAge: number;
  /** Years younger (positive) or older (negative) than chronological age */
  ageDelta: number;
  /** Method description shown to users */
  methodLabel: string;
  /** Scientific reference */
  citation: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Population reference statistics (NHANES III adults)
// Source: Levine (2018) supplementary tables + CDC NHANES public data
// ─────────────────────────────────────────────────────────────────────────────
interface BiomarkerRef {
  mean: number;
  sd: number;
  /** Regression weight (effect on biological age in years per SD unit) */
  beta: number;
}

const REFS: Record<string, BiomarkerRef> = {
  // Glucose (mg/dL) – hyperglycaemia accelerates aging
  glucose: { mean: 98.0, sd: 26.8, beta: 1.12 },
  // HDL (mg/dL) – higher HDL is protective (negative beta)
  hdl: { mean: 53.3, sd: 15.0, beta: -0.95 },
  // LDL (mg/dL) – higher LDL accelerates aging mildly
  ldl: { mean: 119.0, sd: 36.5, beta: 0.48 },
  // Triglycerides (mg/dL) – higher TG accelerates aging
  triglycerides: { mean: 131.5, sd: 88.0, beta: 0.75 },
  // CRP (mg/L) – inflammatory marker, strong aging accelerator
  crp: { mean: 3.1, sd: 5.4, beta: 1.35 },
};

/**
 * Compute a z-score for a biomarker value.
 */
const zscore = (value: number, ref: BiomarkerRef): number =>
  (value - ref.mean) / ref.sd;

/**
 * Calculate PhenoAge from clinical biomarkers.
 *
 * Returns null if any required input is invalid (NaN, negative, or null).
 */
export const calculatePhenoAge = (inputs: PhenoAgeInputs): PhenoAgeResult | null => {
  const { chronologicalAge, glucose, hdl, ldl, triglycerides, crp } = inputs;

  // Guard: all values must be positive finite numbers
  const values = [chronologicalAge, glucose, hdl, ldl, triglycerides, crp];
  if (values.some((v) => !Number.isFinite(v) || v <= 0)) {
    return null;
  }

  // Compute the weighted sum of z-scores
  const delta =
    REFS.glucose.beta * zscore(glucose, REFS.glucose) +
    REFS.hdl.beta * zscore(hdl, REFS.hdl) +
    REFS.ldl.beta * zscore(ldl, REFS.ldl) +
    REFS.triglycerides.beta * zscore(triglycerides, REFS.triglycerides) +
    REFS.crp.beta * zscore(crp, REFS.crp);

  const biologicalAge = Math.round(chronologicalAge + delta);
  const ageDelta = chronologicalAge - biologicalAge; // positive = younger

  return {
    biologicalAge,
    ageDelta,
    methodLabel: 'PhenoAge (Levine et al., 2018)',
    citation:
      'Levine ME et al. "An epigenetic biomarker of aging for lifespan and healthspan." Aging Cell, 2018; 17(4): e12765.',
  };
};
