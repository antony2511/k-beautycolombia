'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const SkinQuizModal = dynamic(() => import('./SkinQuizModal'), { ssr: false });

export default function QuizSection() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="py-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent-light/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-secondary/15 text-secondary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <span className="material-icons text-sm">auto_awesome</span>
            Nuevo: Análisis de piel personalizado
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            ¿No sabes qué productos elegir?
          </h2>
          <p className="text-accent max-w-xl mx-auto mb-8 leading-relaxed">
            Responde 10 preguntas rápidas y te diremos exactamente qué tipo de piel
            tienes y cuál es la rutina K-Beauty perfecta para ti con productos reales
            de nuestra tienda.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="btn-primary flex items-center gap-2 text-base px-8 py-3"
            >
              <span className="material-icons text-sm">face</span>
              Descubre tu rutina ideal →
            </button>
            <span className="text-sm text-accent">⏱ Solo 2 minutos · 10 preguntas</span>
          </div>
        </div>
      </section>

      <SkinQuizModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
