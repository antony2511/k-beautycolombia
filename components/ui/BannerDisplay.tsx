'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Banner {
  id: string;
  message: string;
  subMessage?: string | null;
  type: string;
  variant: string;
  image?: string | null;
  link?: string | null;
  linkText?: string | null;
  dismissible: boolean;
}

const variantStyles: Record<string, { bar: string; badge: string; btn: string; close: string; solid: string }> = {
  promo: {
    bar: 'bg-gradient-to-r from-secondary to-secondary/80 text-white',
    badge: 'bg-white/20 text-white',
    btn: 'bg-white text-secondary hover:bg-white/90',
    close: 'text-white/80 hover:text-white hover:bg-white/20',
    solid: 'bg-secondary',
  },
  sale: {
    bar: 'bg-gradient-to-r from-red-500 to-red-400 text-white',
    badge: 'bg-white/20 text-white',
    btn: 'bg-white text-red-500 hover:bg-white/90',
    close: 'text-white/80 hover:text-white hover:bg-white/20',
    solid: 'bg-red-500',
  },
  info: {
    bar: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white',
    badge: 'bg-white/20 text-white',
    btn: 'bg-white text-blue-600 hover:bg-white/90',
    close: 'text-white/80 hover:text-white hover:bg-white/20',
    solid: 'bg-blue-600',
  },
  warning: {
    bar: 'bg-gradient-to-r from-amber-400 to-amber-300 text-amber-900',
    badge: 'bg-amber-900/10 text-amber-900',
    btn: 'bg-amber-900 text-amber-100 hover:bg-amber-800',
    close: 'text-amber-900/70 hover:text-amber-900 hover:bg-amber-900/10',
    solid: 'bg-amber-400',
  },
};

const variantIcon: Record<string, string> = {
  promo: 'local_offer',
  sale: 'percent',
  info: 'info',
  warning: 'warning',
};

const variantLabel: Record<string, string> = {
  promo: 'Promo',
  sale: 'Oferta',
  info: 'Info',
  warning: 'Aviso',
};

// ─── Top Bar ──────────────────────────────────────────────────────────────────

function TopBar({ banner, onDismiss }: { banner: Banner; onDismiss: () => void }) {
  const s = variantStyles[banner.variant] ?? variantStyles.promo;

  return (
    <div className={`relative z-50 w-full py-2.5 px-4 ${s.bar}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap text-sm font-medium">
        <span className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${s.badge}`}>
          <span className="material-icons text-xs">{variantIcon[banner.variant] ?? 'local_offer'}</span>
          {variantLabel[banner.variant] ?? 'Promo'}
        </span>

        <span className="text-center">
          {banner.message}
          {banner.subMessage && (
            <span className="opacity-80 ml-1.5">{banner.subMessage}</span>
          )}
        </span>

        {banner.link && banner.linkText && (
          <Link
            href={banner.link}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-colors ${s.btn}`}
          >
            {banner.linkText}
          </Link>
        )}
      </div>

      {banner.dismissible && (
        <button
          onClick={onDismiss}
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${s.close}`}
          aria-label="Cerrar"
        >
          <span className="material-icons text-base">close</span>
        </button>
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function BannerModal({ banner, onDismiss }: { banner: Banner; onDismiss: () => void }) {
  const s = variantStyles[banner.variant] ?? variantStyles.promo;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={banner.dismissible ? onDismiss : undefined}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">

        {/* Image (if any) — shown at top, full-width */}
        {banner.image ? (
          <div className="bg-white w-full flex items-center justify-center p-4">
            <img
              src={banner.image}
              alt={banner.message}
              className="max-w-full max-h-64 w-auto h-auto object-contain rounded-lg"
            />
          </div>
        ) : (
          /* Fallback color strip with icon */
          <div className={`${s.bar} px-6 pt-6 pb-4 text-center`}>
            <span className="material-icons text-4xl mb-1 block">
              {variantIcon[banner.variant] ?? 'local_offer'}
            </span>
          </div>
        )}

        {/* Content */}
        <div className={`px-6 py-5 text-center ${banner.image ? 'bg-white' : `${s.bar}`}`}>
          <p className={`text-xl font-bold leading-snug ${banner.image ? 'text-primary' : ''}`}>
            {banner.message}
          </p>
          {banner.subMessage && (
            <p className={`mt-1.5 text-sm ${banner.image ? 'text-accent' : 'opacity-85'}`}>
              {banner.subMessage}
            </p>
          )}
        </div>

        {/* Footer — CTA button only */}
        {(banner.link && banner.linkText) || banner.dismissible ? (
          <div className="bg-white px-6 pb-6 pt-1 flex flex-col gap-3">
            {banner.link && banner.linkText && (
              <Link
                href={banner.link}
                onClick={onDismiss}
                className={`w-full text-center py-3 px-5 rounded-xl font-bold text-sm text-white transition-colors ${s.solid} hover:opacity-90`}
              >
                {banner.linkText}
              </Link>
            )}
            {/* "Entendido" only when there's no CTA button but banner is dismissible */}
            {!(banner.link && banner.linkText) && banner.dismissible && (
              <button
                onClick={onDismiss}
                className="w-full py-3 px-5 rounded-xl font-medium text-sm border-2 border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Entendido
              </button>
            )}
          </div>
        ) : null}

        {/* Close X */}
        {banner.dismissible && (
          <button
            onClick={onDismiss}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors"
            aria-label="Cerrar"
          >
            <span className="material-icons text-lg">close</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Controller ───────────────────────────────────────────────────────────────

export default function BannerDisplay() {
  const [topBars, setTopBars] = useState<Banner[]>([]);
  const [modals, setModals] = useState<Banner[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = sessionStorage.getItem('dismissed_banners');
    const dismissed = stored ? new Set<string>(JSON.parse(stored)) : new Set<string>();
    setDismissedIds(dismissed);

    fetch('/api/banners')
      .then((r) => r.json())
      .then((data: Banner[]) => {
        if (!Array.isArray(data)) return;
        const visible = data.filter((b) => !dismissed.has(b.id));
        setTopBars(visible.filter((b) => b.type === 'top_bar'));
        const firstModal = visible.find((b) => b.type === 'modal');
        if (firstModal) setModals([firstModal]);
      })
      .catch(() => {});
  }, []);

  const dismiss = (id: string) => {
    const next = new Set(dismissedIds).add(id);
    setDismissedIds(next);
    sessionStorage.setItem('dismissed_banners', JSON.stringify([...next]));
    setTopBars((prev) => prev.filter((b) => b.id !== id));
    setModals((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <>
      {topBars.map((banner) => (
        <TopBar key={banner.id} banner={banner} onDismiss={() => dismiss(banner.id)} />
      ))}
      {modals[0] && (
        <BannerModal banner={modals[0]} onDismiss={() => dismiss(modals[0].id)} />
      )}
    </>
  );
}
