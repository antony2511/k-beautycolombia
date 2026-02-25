export interface ProductLite {
  id: string;
  name: string;
  brand: string;
  category: string;
  skinType: string[];
  benefits: string[];
  price: number;
  compareAtPrice?: number | null;
  image: string;
}

export interface Recommendation {
  product: ProductLite;
  reason: string;
  step: string;
}

// K-Beauty 8-step routine order (category slug → step number)
export const ROUTINE_ORDER: Record<string, number> = {
  limpiadores: 1,
  exfoliantes: 2,
  tónicos: 3,
  tonicos: 3,
  esencias: 4,
  sérums: 5,
  serums: 5,
  mascarillas: 6,
  hidratantes: 7,
  protectores: 8,
};

// Spanish labels for each step
const STEP_LABELS: Record<number, string> = {
  1: 'Limpieza',
  2: 'Exfoliación',
  3: 'Tónico',
  4: 'Esencia',
  5: 'Sérum',
  6: 'Mascarilla',
  7: 'Hidratación',
  8: 'Protección Solar',
};

function getStep(category: string): number {
  const normalized = category.toLowerCase().trim();
  return ROUTINE_ORDER[normalized] ?? 5; // default to sérum step if unknown
}

export function scoreProduct(current: ProductLite, candidate: ProductLite): number {
  // Penalize same category
  if (candidate.category.toLowerCase() === current.category.toLowerCase()) {
    return -20;
  }

  const currentStep = getStep(current.category);
  const candidateStep = getStep(candidate.category);
  const distance = Math.abs(currentStep - candidateStep);

  // Proximity score
  let score = 0;
  if (distance === 1) score += 5;
  else if (distance === 2) score += 3;
  else if (distance === 3) score += 2;
  else score += 1;

  // Skin type compatibility
  const currentSkinTypes = current.skinType.map((s) => s.toLowerCase());
  const candidateSkinTypes = candidate.skinType.map((s) => s.toLowerCase());

  const hasTodoTipo = candidateSkinTypes.some(
    (s) => s.includes('todo tipo') || s.includes('todos') || s.includes('todo')
  );

  if (hasTodoTipo) {
    score += 2;
  } else {
    const hasExactMatch = currentSkinTypes.some((s) => candidateSkinTypes.includes(s));
    if (hasExactMatch) score += 3;
  }

  return score;
}

// Specific reason messages for adjacent pairs
function getAdjacentReason(fromStep: number, toStep: number, currentCategory: string, recommendedCategory: string): string | null {
  const pair = `${fromStep}-${toStep}`;
  const messages: Record<string, string> = {
    '1-2': 'Exfolia después de limpiar para eliminar células muertas y preparar la piel',
    '2-3': 'Aplica el tónico para equilibrar el pH y maximizar la absorción del siguiente paso',
    '3-4': 'Prepara tu piel con el tónico para absorber mejor la esencia',
    '4-5': 'La esencia potencia la penetración del sérum en capas más profundas',
    '5-6': 'Complementa el sérum con una mascarilla para una hidratación intensiva',
    '6-7': 'Sella los beneficios de la mascarilla con una buena hidratación',
    '7-8': 'El último paso AM: fija la hidratación y protege del sol',
    '5-7': 'Sella los activos del sérum con esta hidratación profunda',
    '4-7': 'La esencia y la hidratante forman un dúo perfecto en la rutina coreana',
    '3-5': 'El tónico prepara las capas de la piel para absorber mejor los activos del sérum',
    '1-3': 'Completa la limpieza con un tónico para restaurar el equilibrio natural de tu piel',
  };

  return messages[pair] || null;
}

export function getReasonText(current: ProductLite, recommended: ProductLite): string {
  const currentStep = getStep(current.category);
  const recommendedStep = getStep(recommended.category);

  const distance = Math.abs(currentStep - recommendedStep);

  // Check for specific adjacent pair messages
  if (distance <= 3) {
    const fromStep = Math.min(currentStep, recommendedStep);
    const toStep = Math.max(currentStep, recommendedStep);
    const adjacentMsg = getAdjacentReason(fromStep, toStep, current.category, recommended.category);
    if (adjacentMsg) return adjacentMsg;
  }

  const currentCategoryLabel = STEP_LABELS[currentStep] || current.category;

  if (recommendedStep < currentStep) {
    return `Úsalo primero para preparar tu piel y potenciar el ${currentCategoryLabel.toLowerCase()}`;
  } else {
    return `Aplícalo después para sellar y prolongar el efecto del ${currentCategoryLabel.toLowerCase()}`;
  }
}

export function getRecommendations(
  currentProduct: ProductLite,
  catalog: ProductLite[],
  limit = 3
): Recommendation[] {
  const currentStep = getStep(currentProduct.category);

  const scored = catalog
    .filter((p) => p.id !== currentProduct.id)
    .map((p) => ({
      product: p,
      score: scoreProduct(currentProduct, p),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ product }) => {
    const step = STEP_LABELS[getStep(product.category)] || product.category;
    const reason = getReasonText(currentProduct, product);
    return { product, reason, step };
  });
}
