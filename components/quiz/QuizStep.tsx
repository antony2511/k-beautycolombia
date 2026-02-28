'use client';

import { QuizQuestion } from '@/lib/quiz/questions';

interface QuizStepProps {
  question: QuizQuestion;
  currentAnswer: string | string[] | undefined;
  onAnswer: (answer: string | string[]) => void;
  onNext: () => void;
}

export default function QuizStep({ question, currentAnswer, onAnswer, onNext }: QuizStepProps) {
  const isMulti = question.type === 'multi';
  const selectedIds = isMulti
    ? ((currentAnswer as string[]) || [])
    : currentAnswer
    ? [currentAnswer as string]
    : [];

  function handleSingleSelect(optionId: string) {
    onAnswer(optionId);
    // Auto-advance after brief delay
    setTimeout(() => onNext(), 300);
  }

  function handleMultiToggle(optionId: string) {
    const current = (currentAnswer as string[]) || [];
    if (current.includes(optionId)) {
      onAnswer(current.filter((id) => id !== optionId));
    } else {
      onAnswer([...current, optionId]);
    }
  }

  return (
    <div className="animate-fade-in">
      <h3 className="text-lg font-semibold text-primary mb-1 leading-snug">
        {question.question}
      </h3>
      {isMulti && (
        <p className="text-sm text-accent mb-4">Selecciona todas las que apliquen</p>
      )}

      <div className={`grid gap-3 mt-4 ${question.options.length > 4 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {question.options.map((option) => {
          const isSelected = selectedIds.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() =>
                isMulti ? handleMultiToggle(option.id) : handleSingleSelect(option.id)
              }
              className={`
                relative text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium
                ${
                  isSelected
                    ? 'border-secondary bg-secondary/10 text-primary'
                    : 'border-accent-light/40 bg-white text-primary/80 hover:border-secondary/50 hover:bg-secondary/5'
                }
              `}
            >
              {isMulti && (
                <span
                  className={`
                    inline-flex items-center justify-center w-4 h-4 rounded border mr-2 flex-shrink-0 align-middle
                    ${isSelected ? 'bg-secondary border-secondary text-white' : 'border-accent'}
                  `}
                >
                  {isSelected && (
                    <span className="material-icons text-[10px]">check</span>
                  )}
                </span>
              )}
              {option.label}
            </button>
          );
        })}
      </div>

      {isMulti && (
        <button
          onClick={onNext}
          disabled={selectedIds.length === 0}
          className="mt-6 w-full btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continuar
        </button>
      )}
    </div>
  );
}
