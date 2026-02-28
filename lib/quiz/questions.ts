// Quiz de autoanálisis de piel K-Beauty

export type SkinTypeKey = 'seca' | 'grasa' | 'mixta' | 'normal' | 'sensible';

export interface QuizOption {
  id: string;
  label: string;
  scores?: Partial<Record<SkinTypeKey, number>>;
  value?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  type: 'single' | 'multi';
  options: QuizOption[];
}

export interface QuizAnswers {
  [questionId: number]: string | string[];
}

export interface SkinAnalysisResult {
  skinType: 'Piel Seca' | 'Piel Grasa' | 'Piel Mixta' | 'Piel Normal';
  isSensible: boolean;
  concerns: string[];
  preferredTexture: string;
  ageRange: string;
  routineComplexity: 'minimal' | 'basic' | 'full' | 'any';
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '¿Cómo sientes tu piel al despertar?',
    type: 'single',
    options: [
      { id: '1a', label: 'Tensa y tirante', scores: { seca: 3 } },
      { id: '1b', label: 'Brillante, especialmente en frente y nariz', scores: { grasa: 3 } },
      { id: '1c', label: 'Brillante en la zona T, seca en mejillas', scores: { mixta: 3 } },
      { id: '1d', label: 'Cómoda, ni grasa ni seca', scores: { normal: 3 } },
      { id: '1e', label: 'Irritada o con enrojecimiento', scores: { sensible: 3, seca: 1 } },
    ],
  },
  {
    id: 2,
    question: '¿Cómo luce tu piel al mediodía sin productos?',
    type: 'single',
    options: [
      { id: '2a', label: 'Opaca o con descamación', scores: { seca: 3 } },
      { id: '2b', label: 'Muy brillante en toda la cara', scores: { grasa: 3 } },
      { id: '2c', label: 'Brillante solo en frente, nariz y barbilla', scores: { mixta: 3 } },
      { id: '2d', label: 'Prácticamente igual a la mañana', scores: { normal: 3 } },
      { id: '2e', label: 'Con manchas rojas o sensación de calor', scores: { sensible: 3 } },
    ],
  },
  {
    id: 3,
    question: '¿Tu piel reacciona con escozor o rojez ante productos nuevos?',
    type: 'single',
    options: [
      { id: '3a', label: 'Casi siempre', scores: { sensible: 3 } },
      { id: '3b', label: 'A veces, con ciertos ingredientes', scores: { sensible: 2, seca: 1 } },
      { id: '3c', label: 'Rara vez', scores: { normal: 1, mixta: 1 } },
      { id: '3d', label: 'Nunca, tolera bien todo', scores: { grasa: 1, normal: 2 } },
    ],
  },
  {
    id: 4,
    question: '¿Cómo describirías tus poros?',
    type: 'single',
    options: [
      { id: '4a', label: 'Casi invisibles o muy pequeños', scores: { seca: 2, normal: 1 } },
      { id: '4b', label: 'Grandes y visibles en toda la cara', scores: { grasa: 3 } },
      { id: '4c', label: 'Grandes en nariz y frente, pequeños en mejillas', scores: { mixta: 3 } },
      { id: '4d', label: 'Normales, no me preocupan', scores: { normal: 2 } },
      { id: '4e', label: 'Sensibles al tacto o propensos a rojeces', scores: { sensible: 2 } },
    ],
  },
  {
    id: 5,
    question: '¿Con qué frecuencia sientes necesidad de eliminar el brillo?',
    type: 'single',
    options: [
      { id: '5a', label: 'Nunca, preferiría tener más hidratación', scores: { seca: 3 } },
      { id: '5b', label: 'Varias veces al día', scores: { grasa: 3 } },
      { id: '5c', label: 'Solo a mediodía en la zona T', scores: { mixta: 3 } },
      { id: '5d', label: 'Ocasionalmente, no es un problema', scores: { normal: 3 } },
    ],
  },
  {
    id: 6,
    question: '¿Tu piel se reseca o descama en climas fríos o con aire acondicionado?',
    type: 'single',
    options: [
      { id: '6a', label: 'Sí, siempre y me incomoda mucho', scores: { seca: 3 } },
      { id: '6b', label: 'Un poco, en algunas zonas', scores: { mixta: 2, seca: 1 } },
      { id: '6c', label: 'Rara vez', scores: { normal: 2, grasa: 1 } },
      { id: '6d', label: 'Nunca, mi piel siempre se ve brillante', scores: { grasa: 2 } },
      { id: '6e', label: 'Sí, y además me irrita', scores: { sensible: 2, seca: 2 } },
    ],
  },
  {
    id: 7,
    question: '¿Cuáles son tus principales preocupaciones?',
    type: 'multi',
    options: [
      { id: '7a', label: 'Acné y puntos negros', value: 'acne' },
      { id: '7b', label: 'Manchas y tono desigual', value: 'manchas' },
      { id: '7c', label: 'Líneas finas y envejecimiento', value: 'antiedad' },
      { id: '7d', label: 'Poros dilatados', value: 'poros' },
      { id: '7e', label: 'Hidratación y barrera cutánea', value: 'hidratacion' },
      { id: '7f', label: 'Sensibilidad y rojeces', value: 'sensibilidad' },
    ],
  },
  {
    id: 8,
    question: '¿Qué textura de productos prefieres?',
    type: 'single',
    options: [
      { id: '8a', label: 'Ligera y acuosa (gel, agua)', value: 'ligera' },
      { id: '8b', label: 'Media (loción, emulsión)', value: 'media' },
      { id: '8c', label: 'Rica y nutritiva (crema, bálsamo)', value: 'rica' },
      { id: '8d', label: 'No tengo preferencia', value: 'any' },
    ],
  },
  {
    id: 9,
    question: '¿Cuál es tu rango de edad?',
    type: 'single',
    options: [
      { id: '9a', label: 'Menos de 20 años', value: '<20' },
      { id: '9b', label: '20 – 30 años', value: '20-30' },
      { id: '9c', label: '31 – 40 años', value: '31-40' },
      { id: '9d', label: 'Más de 40 años', value: '>40' },
    ],
  },
  {
    id: 10,
    question: '¿Qué tan extensa quieres tu rutina?',
    type: 'single',
    options: [
      { id: '10a', label: 'Mínima: 2-3 pasos básicos', value: 'minimal' },
      { id: '10b', label: 'Básica: 4-5 pasos', value: 'basic' },
      { id: '10c', label: 'Completa: rutina K-Beauty de 6-8 pasos', value: 'full' },
      { id: '10d', label: 'No me importa, quiero lo mejor para mi piel', value: 'any' },
    ],
  },
];

export function analyzeSkin(answers: QuizAnswers): SkinAnalysisResult {
  const scores: Record<SkinTypeKey, number> = {
    seca: 0,
    grasa: 0,
    mixta: 0,
    normal: 0,
    sensible: 0,
  };

  // Process Q1-Q6: skin type scoring
  for (let qId = 1; qId <= 6; qId++) {
    const answer = answers[qId] as string;
    if (!answer) continue;
    const question = QUIZ_QUESTIONS[qId - 1];
    const option = question.options.find((o) => o.id === answer);
    if (option?.scores) {
      for (const [type, pts] of Object.entries(option.scores)) {
        if (type in scores) scores[type as SkinTypeKey] += pts;
      }
    }
  }

  // Determine primary skin type (excluding sensible)
  const primaryTypes: SkinTypeKey[] = ['seca', 'grasa', 'mixta', 'normal'];
  const dominant = primaryTypes.reduce((a, b) => (scores[a] >= scores[b] ? a : b));

  const skinTypeMap: Record<string, SkinAnalysisResult['skinType']> = {
    seca: 'Piel Seca',
    grasa: 'Piel Grasa',
    mixta: 'Piel Mixta',
    normal: 'Piel Normal',
  };

  const isSensible = scores.sensible >= 3;

  // Q7 - multi-select concerns: array of option ids → map to values
  const concernIds = (answers[7] as string[] | undefined) || [];
  const q7Options = QUIZ_QUESTIONS[6].options;
  const concerns = concernIds
    .map((id) => q7Options.find((o) => o.id === id)?.value || '')
    .filter(Boolean);

  // Q8 - preferred texture
  const textureId = answers[8] as string;
  const textureOption = QUIZ_QUESTIONS[7].options.find((o) => o.id === textureId);
  const preferredTexture = textureOption?.value || 'any';

  // Q9 - age range
  const ageId = answers[9] as string;
  const ageOption = QUIZ_QUESTIONS[8].options.find((o) => o.id === ageId);
  const ageRange = ageOption?.value || '';

  // Q10 - routine complexity
  const complexityId = answers[10] as string;
  const complexityOption = QUIZ_QUESTIONS[9].options.find((o) => o.id === complexityId);
  const routineComplexity = (complexityOption?.value || 'any') as SkinAnalysisResult['routineComplexity'];

  return {
    skinType: skinTypeMap[dominant],
    isSensible,
    concerns,
    preferredTexture,
    ageRange,
    routineComplexity,
  };
}
