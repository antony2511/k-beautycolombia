import type { SkinAnalysisResult } from './questions';

export interface SkinDescription {
  emoji: string;
  title: string;
  description: string;
  tip: string;
  starIngredients: string[];
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export const SKIN_DESCRIPTIONS: Record<SkinAnalysisResult['skinType'], SkinDescription> = {
  'Piel Seca': {
    emoji: '🌸',
    title: 'Piel Seca',
    description:
      'Tu piel produce menos sebo del necesario, lo que puede generar sensación de tirantez, opacidad y descamación. Necesita hidratación profunda y una barrera cutánea reforzada.',
    tip: 'En K-Beauty, el método "7 skin method" (aplicar tónico 7 veces en capas) es ideal para ti. Prioriza ingredientes humectantes y oclusivos.',
    starIngredients: ['Ácido hialurónico', 'Ceramidas', 'Centella Asiática', 'Pantenol', 'Glicerina'],
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
  },
  'Piel Grasa': {
    emoji: '✨',
    title: 'Piel Grasa',
    description:
      'Tu piel produce exceso de sebo, lo que puede ocasionar brillo, poros dilatados y tendencia al acné. Necesita regulación del sebo y limpieza efectiva sin eliminar la hidratación esencial.',
    tip: 'Opta por tónicos sin alcohol con niacinamida y humectantes oil-free. El doble método de limpieza K-Beauty es clave, ¡pero usa un limpiador en gel suave!',
    starIngredients: ['Niacinamida', 'Ácido salicílico', 'Té verde', 'Zinc', 'Arcilla de caolín'],
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
  },
  'Piel Mixta': {
    emoji: '🌿',
    title: 'Piel Mixta',
    description:
      'Tu piel combina zonas grasas (frente, nariz, barbilla) con zonas normales o secas (mejillas). El objetivo es equilibrar sin sobre-hidratar ni resecar ninguna zona.',
    tip: 'Usa productos ligeros tipo gel o emulsión que hidraten sin saturar la zona T. Puedes hacer "skincare multi-masking": mascarillas diferentes por zona de la cara.',
    starIngredients: ['Niacinamida', 'Ácido hialurónico', 'Aloe vera', 'Centella Asiática', 'Madecasoside'],
    bgColor: 'bg-green-50',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
  },
  'Piel Normal': {
    emoji: '💆',
    title: 'Piel Normal',
    description:
      'Tu piel está bien equilibrada: ni demasiado grasa ni demasiado seca. Tienes la suerte de poder enfocarte en el mantenimiento, la protección solar y la prevención del envejecimiento.',
    tip: 'Aprovecha tu piel equilibrada para construir una rutina K-Beauty completa. Enfócate en antioxidantes, protección solar y tratamientos antiedad preventivos.',
    starIngredients: ['Vitamina C', 'Retinol', 'Péptidos', 'Niacinamida', 'Ácido hialurónico'],
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-200',
  },
};

export const SENSIBLE_NOTE = {
  description:
    'Además, tu piel muestra signos de sensibilidad. Introduce productos nuevos de forma gradual (uno a la vez) y prefiere fórmulas libres de fragancias y sin alcohol.',
  ingredients: ['Centella Asiática', 'Madecasoside', 'Aloe vera', 'Beta-glucano', 'Avena coloidal'],
};

// Routine steps recommended per skin type
export const ROUTINE_STEPS_BY_TYPE: Record<SkinAnalysisResult['skinType'], string[]> = {
  'Piel Seca': ['limpiadores', 'tónicos', 'esencias', 'sérums', 'hidratantes', 'protectores'],
  'Piel Grasa': ['limpiadores', 'exfoliantes', 'tónicos', 'sérums', 'hidratantes', 'protectores'],
  'Piel Mixta': ['limpiadores', 'tónicos', 'esencias', 'sérums', 'mascarillas', 'hidratantes', 'protectores'],
  'Piel Normal': ['limpiadores', 'tónicos', 'esencias', 'sérums', 'hidratantes', 'protectores'],
};
