import { GlycemiaUnit } from '../types';

// Conversion constants
const MMOL_TO_MG_FACTOR = 18.0182;

/**
 * Convert mmol/L to mg/dL
 */
export const mmolToMg = (mmolValue: number): number => {
  return Math.round(mmolValue * MMOL_TO_MG_FACTOR);
};

/**
 * Convert mg/dL to mmol/L
 */
export const mgToMmol = (mgValue: number): number => {
  return Math.round((mgValue / MMOL_TO_MG_FACTOR) * 10) / 10; // Round to 1 decimal
};

/**
 * Convert any value to mg/dL (for storage)
 */
export const convertToMg = (value: number, unit: GlycemiaUnit): number => {
  if (unit === 'mmol/L') {
    return mmolToMg(value);
  }
  return value; // Already in mg/dL
};

/**
 * Convert mg/dL value to specified unit (for display)
 */
export const convertFromMg = (mgValue: number, targetUnit: GlycemiaUnit): number => {
  if (targetUnit === 'mmol/L') {
    return mgToMmol(mgValue);
  }
  return mgValue; // Keep in mg/dL
};

/**
 * Convert glycemia value between units
 */
export const convertGlycemia = (value: number, fromUnit: GlycemiaUnit, toUnit: GlycemiaUnit): number => {
  if (fromUnit === toUnit) {
    return value;
  }

  if (fromUnit === 'mg/dL' && toUnit === 'mmol/L') {
    return mgToMmol(value);
  }

  if (fromUnit === 'mmol/L' && toUnit === 'mg/dL') {
    return mmolToMg(value);
  }

  return value;
};

/**
 * Format glycemia value with unit
 */
export const formatGlycemiaValue = (value: number, unit: GlycemiaUnit): string => {
  if (unit === 'mmol/L') {
    return `${value.toFixed(1)} mmol/L`;
  }
  return `${Math.round(value)} mg/dL`;
};

/**
 * Get glycemia status based on mg/dL value
 */
export const getGlycemiaStatus = (mgValue: number, unit?: GlycemiaUnit) => {
  if (mgValue < 70) return {
    status: 'Hypoglycémie',
    category: 'low',
    color: '#dc2626',
    bgColor: '#fef2f2',
    severity: 'critical' as const
  };
  if (mgValue <= 140) return {
    status: 'Normal',
    category: 'normal',
    color: '#16a34a',
    bgColor: '#f0fdf4',
    severity: 'normal' as const
  };
  if (mgValue <= 200) return {
    status: 'Élevé',
    category: 'high',
    color: '#ea580c',
    bgColor: '#fff7ed',
    severity: 'warning' as const
  };
  return {
    status: 'Très élevé',
    category: 'very_high',
    color: '#dc2626',
    bgColor: '#fef2f2',
    severity: 'critical' as const
  };
};

/**
 * Get normal ranges for different units
 */
export const getNormalRanges = (unit: GlycemiaUnit) => {
  if (unit === 'mmol/L') {
    return {
      fasting: { min: 3.9, max: 7.8 },
      postMeal: { min: 3.9, max: 10.0 },
      unit: 'mmol/L'
    };
  }
  return {
    fasting: { min: 70, max: 140 },
    postMeal: { min: 70, max: 180 },
    unit: 'mg/dL'
  };
};

/**
 * Validate glycemia value based on unit
 */
export const validateGlycemiaValue = (value: number, unit: GlycemiaUnit): { isValid: boolean; message?: string } => {
  if (isNaN(value) || value <= 0) {
    return { isValid: false, message: 'Veuillez entrer une valeur valide' };
  }

  if (unit === 'mmol/L') {
    if (value < 1.1 || value > 33.3) {
      return { isValid: false, message: 'La valeur doit être entre 1.1 et 33.3 mmol/L' };
    }
  } else {
    if (value < 20 || value > 600) {
      return { isValid: false, message: 'La valeur doit être entre 20 et 600 mg/dL' };
    }
  }

  return { isValid: true };
};
