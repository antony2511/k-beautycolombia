'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import type { SkinAnalysisResult } from '@/lib/quiz/questions';
import { SKIN_DESCRIPTIONS, SENSIBLE_NOTE, ROUTINE_STEPS_BY_TYPE } from '@/lib/quiz/skinDescriptions';
import { ROUTINE_ORDER } from '@/lib/recommendations/engine';

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

const STEP_ICONS: Record<number, string> = {
  1: 'soap',
  2: 'auto_fix_high',
  3: 'water_drop',
  4: 'science',
  5: 'biotech',
  6: 'spa',
  7: 'opacity',
  8: 'wb_sunny',
};

interface ApiProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
}

interface QuizResultProps {
  result: SkinAnalysisResult;
  onRetake: () => void;
  onClose: () => void;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function QuizResult({ result, onRetake, onClose }: QuizResultProps) {
  const { user } = useAuth();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const desc = SKIN_DESCRIPTIONS[result.skinType];
  const recommendedSteps = ROUTINE_STEPS_BY_TYPE[result.skinType];

  // Map recommended steps to step numbers, sorted
  const routineSteps = recommendedSteps
    .map((slug) => ({ slug, step: ROUTINE_ORDER[slug] ?? 0 }))
    .filter((s) => s.step > 0)
    .sort((a, b) => a.step - b.step);

  // Fetch matching products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const encodedType = encodeURIComponent(result.skinType);
        const res = await fetch(`/api/products?skinType=${encodedType}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch {
        // show empty state
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchProducts();
  }, [result.skinType]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/quiz/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(result),
      });
      if (res.ok) setSaved(true);
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  }

  const tiendaUrl = `/tienda?skinType=${encodeURIComponent(result.skinType)}`;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Skin type header */}
      <div className={`rounded-2xl p-4 border ${desc.bgColor} ${desc.textColor} ${desc.borderColor}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{desc.emoji}</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-0.5">
              Tu tipo de piel
            </p>
            <h3 className="text-xl font-bold">
              {result.skinType}
              {result.isSensible && (
                <span className="ml-2 text-sm font-medium bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                  + Sensible
                </span>
              )}
            </h3>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <p className="text-sm text-primary/80 leading-relaxed">{desc.description}</p>
        {result.isSensible && (
          <p className="text-sm text-rose-700 mt-2 leading-relaxed italic">
            {SENSIBLE_NOTE.description}
          </p>
        )}
      </div>

      {/* K-Beauty tip */}
      <div className="bg-secondary/10 rounded-xl p-4 border border-secondary/20">
        <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">
          Tip K-Beauty para ti
        </p>
        <p className="text-sm text-primary/80 leading-relaxed">{desc.tip}</p>
      </div>

      {/* Star ingredients */}
      <div>
        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
          Ingredientes estrella
        </p>
        <div className="flex flex-wrap gap-2">
          {desc.starIngredients.map((ing) => (
            <span
              key={ing}
              className="text-xs bg-accent-light/40 text-primary px-3 py-1 rounded-full border border-accent/20"
            >
              {ing}
            </span>
          ))}
          {result.isSensible &&
            SENSIBLE_NOTE.ingredients.slice(0, 2).map((ing) => (
              <span
                key={ing}
                className="text-xs bg-rose-50 text-rose-700 px-3 py-1 rounded-full border border-rose-200"
              >
                {ing}
              </span>
            ))}
        </div>
      </div>

      {/* Routine steps */}
      <div>
        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
          Tu rutina K-Beauty recomendada
        </p>
        <div className="flex flex-wrap gap-2">
          {routineSteps.map(({ step }) => (
            <div
              key={step}
              className="flex items-center gap-1.5 bg-primary/5 border border-primary/10 rounded-xl px-3 py-2"
            >
              <span className="material-icons text-primary/60 text-sm">
                {STEP_ICONS[step] || 'circle'}
              </span>
              <span className="text-xs font-semibold text-primary">
                {step}. {STEP_LABELS[step]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div>
        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
          Productos perfectos para ti
        </p>
        {loadingProducts ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 bg-accent-light/30 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-sm text-accent text-center py-4">
            Explora nuestra tienda para encontrar productos ideales para ti.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.slice(0, 6).map((product) => (
              <Link
                key={product.id}
                href={`/producto/${product.id}`}
                onClick={onClose}
                className="group rounded-xl border border-accent-light/30 bg-white overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-24 bg-background-gray overflow-hidden">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-icons text-accent/40 text-3xl">inventory_2</span>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium text-primary line-clamp-2 leading-tight">
                    {product.name}
                  </p>
                  <p className="text-xs font-bold text-secondary mt-1">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-2">
        <Link
          href={tiendaUrl}
          onClick={onClose}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <span className="material-icons text-sm">store</span>
          Ver todos los productos para mi piel
        </Link>

        {user && !saved && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all disabled:opacity-50"
          >
            <span className="material-icons text-sm">
              {saving ? 'hourglass_empty' : 'bookmark'}
            </span>
            {saving ? 'Guardando...' : 'Guardar mi análisis'}
          </button>
        )}

        {saved && (
          <div className="flex items-center justify-center gap-2 text-success text-sm font-medium">
            <span className="material-icons text-sm">check_circle</span>
            Análisis guardado en tu perfil
          </div>
        )}

        <button
          onClick={onRetake}
          className="w-full text-center text-sm text-accent hover:text-primary transition-colors py-1"
        >
          Repetir el quiz
        </button>
      </div>
    </div>
  );
}
