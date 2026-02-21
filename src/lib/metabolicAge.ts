/**
 * Metabolic Biological Age — Proprietary Estimation Model (v1)
 *
 * Estimates biological age based on metabolic and inflammatory biomarkers
 * commonly available in routine blood tests.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * REQUIRED BIOMARKERS (all must be present)
 * ─────────────────────────────────────────────────────────────────────────
 * • Fasting Glucose   (mg/dL)
 * • HDL Cholesterol   (mg/dL)
 * • LDL Cholesterol   (mg/dL)
 * • Triglycerides     (mg/dL)
 *
 * ─────────────────────────────────────────────────────────────────────────
 * METHOD
 * ─────────────────────────────────────────────────────────────────────────
 * 1. Compute deviation of each biomarker from its optimal reference value.
 * 2. Normalise deviations into a standard scale using reference ranges.
 * 3. Apply physiologically-motivated weights.
 * 4. Sum into a MetabolicScore.
 * 5. BiologicalAge = ChronologicalAge + MetabolicScore × AdjustmentFactor
 * 6. Clamp the delta to [-5, +5] years to avoid extreme outputs.
 */

export interface MetabolicAgeInputs {
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
}

export interface MetabolicAgeResult {
  biologicalAge: number;
  /** Years younger (positive) or older (negative) than chronological age */
  ageDelta: number;
  /** Method label for UI */
  methodLabel: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Optimal reference values and normalisation ranges
// Derived from clinical guideline midpoints (healthy adult population)
// ─────────────────────────────────────────────────────────────────────────────
interface BiomarkerConfig {
  /** Optimal (ideal) value */
  optimal: number;
  /** Standard deviation-equivalent for normalisation */
  range: number;
  /** Weight (positive = higher value ages; negative = higher value protects) */
  weight: number;
}

const BIOMARKERS: Record<string, BiomarkerConfig> = {
  // Glucose: optimal ~90 mg/dL; higher accelerates aging
  glucose:       { optimal: 90,  range: 25, weight:  0.28 },
  // HDL: optimal ~60 mg/dL; higher is protective (negative weight)
  hdl:           { optimal: 60,  range: 15, weight: -0.25 },
  // LDL: optimal ~100 mg/dL; higher accelerates aging
  ldl:           { optimal: 100, range: 35, weight:  0.20 },
  // Triglycerides: optimal ~100 mg/dL; higher accelerates aging
  triglycerides: { optimal: 100, range: 60, weight:  0.27 },
};

/** Global scaling factor to map metabolic score → years */
const ADJUSTMENT_FACTOR = 2.5;

/** Maximum absolute delta (years) */
const MAX_DELTA = 5;

/**
 * Compute deviation from optimal, normalised by range.
 * Positive = worse than optimal; negative = better than optimal.
 */
const normalisedDeviation = (value: number, cfg: BiomarkerConfig): number =>
  (value - cfg.optimal) / cfg.range;

/**
 * Calculate Metabolic Biological Age.
 *
 * Returns null if any required input is invalid (NaN, negative, or zero).
 */
export const calculateMetabolicAge = (inputs: MetabolicAgeInputs): MetabolicAgeResult | null => {
  const { chronologicalAge, glucose, hdl, ldl, triglycerides } = inputs;

  // Guard: all values must be positive finite numbers
  const values = [chronologicalAge, glucose, hdl, ldl, triglycerides];
  if (values.some((v) => !Number.isFinite(v) || v <= 0)) {
    return null;
  }

  // Compute weighted metabolic score
  const metabolicScore =
    BIOMARKERS.glucose.weight       * normalisedDeviation(glucose, BIOMARKERS.glucose) +
    BIOMARKERS.hdl.weight           * normalisedDeviation(hdl, BIOMARKERS.hdl) +
    BIOMARKERS.ldl.weight           * normalisedDeviation(ldl, BIOMARKERS.ldl) +
    BIOMARKERS.triglycerides.weight * normalisedDeviation(triglycerides, BIOMARKERS.triglycerides);

  // Scale to years and clamp
  const rawDelta = metabolicScore * ADJUSTMENT_FACTOR;
  const clampedDelta = Math.max(-MAX_DELTA, Math.min(MAX_DELTA, rawDelta));

  const biologicalAge = Math.round(chronologicalAge + clampedDelta);
  const ageDelta = chronologicalAge - biologicalAge; // positive = younger

  return {
    biologicalAge,
    ageDelta,
    methodLabel: 'Modelo Metabólico de Idade Biológica',
  };
};
