'use client';

import { useState, useEffect } from 'react';
import QuizStep from './QuizStep';
import QuizResult from './QuizResult';
import { QUIZ_QUESTIONS, analyzeSkin } from '@/lib/quiz/questions';
import type { QuizAnswers, SkinAnalysisResult } from '@/lib/quiz/questions';

interface SkinQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SkinQuizModal({ isOpen, onClose }: SkinQuizModalProps) {
  const [step, setStep] = useState(0); // 0-indexed, 0 = intro
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [result, setResult] = useState<SkinAnalysisResult | null>(null);

  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentQuestion = QUIZ_QUESTIONS[step - 1]; // step 1 = Q1
  const isIntro = step === 0;
  const isResult = result !== null;
  const progress = isIntro ? 0 : Math.round((step / totalQuestions) * 100);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  function handleAnswer(questionId: number, answer: string | string[]) {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }

  function handleNext() {
    if (step < totalQuestions) {
      setStep((s) => s + 1);
    } else {
      // All questions answered → analyze
      const analysis = analyzeSkin(answers);
      setResult(analysis);
    }
  }

  function handlePrev() {
    if (step > 1) setStep((s) => s - 1);
  }

  function handleRetake() {
    setStep(0);
    setAnswers({});
    setResult(null);
  }

  function handleClose() {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setStep(0);
      setAnswers({});
      setResult(null);
    }, 300);
  }

  if (!isOpen) return null;

  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const canGoNext =
    !isIntro &&
    !isResult &&
    currentQuestion &&
    (currentQuestion.type === 'single'
      ? !!currentAnswer
      : Array.isArray(currentAnswer) && currentAnswer.length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal panel */}
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-icons text-secondary text-xl">face</span>
            <span className="font-bold text-primary text-sm uppercase tracking-wide">
              Análisis de Piel
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-background-gray transition-colors text-accent hover:text-primary"
            aria-label="Cerrar"
          >
            <span className="material-icons text-xl">close</span>
          </button>
        </div>

        {/* Progress bar */}
        {!isIntro && !isResult && (
          <div className="px-6 pb-2 flex-shrink-0">
            <div className="flex justify-between text-xs text-accent mb-1.5">
              <span>Pregunta {step} de {totalQuestions}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-accent-light/30 rounded-full h-1.5">
              <div
                className="bg-secondary h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {isIntro && (
            <div className="animate-fade-in py-4 text-center">
              <div className="text-6xl mb-4">🌿</div>
              <h2 className="text-2xl font-bold text-primary mb-3">
                Descubre tu tipo de piel
              </h2>
              <p className="text-accent leading-relaxed mb-2">
                Responde 10 preguntas rápidas y te diremos exactamente qué tipo de
                piel tienes y cuál es la rutina K-Beauty ideal para ti.
              </p>
              <p className="text-sm text-accent/70 mb-6">⏱ Solo toma 2 minutos</p>
              <button
                onClick={() => setStep(1)}
                className="btn-primary w-full text-base py-3"
              >
                Comenzar análisis
              </button>
            </div>
          )}

          {!isIntro && !isResult && currentQuestion && (
            <QuizStep
              key={step}
              question={currentQuestion}
              currentAnswer={currentAnswer}
              onAnswer={(ans) => handleAnswer(currentQuestion.id, ans)}
              onNext={handleNext}
            />
          )}

          {isResult && result && (
            <QuizResult result={result} onRetake={handleRetake} onClose={handleClose} />
          )}
        </div>

        {/* Footer navigation (only for single-select steps, not intro/result) */}
        {!isIntro && !isResult && currentQuestion?.type === 'single' && (
          <div className="flex gap-3 px-6 pb-5 pt-2 flex-shrink-0 border-t border-accent-light/20">
            {step > 1 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 text-sm text-accent hover:text-primary transition-colors py-2 px-3 rounded-xl hover:bg-background-gray"
              >
                <span className="material-icons text-sm">arrow_back</span>
                Anterior
              </button>
            )}
            <div className="flex-1" />
            {step === totalQuestions ? (
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 text-sm"
              >
                Ver mis resultados
                <span className="material-icons text-sm">auto_awesome</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 text-sm"
              >
                Siguiente
                <span className="material-icons text-sm">arrow_forward</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
