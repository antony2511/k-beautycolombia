'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const variantOptions = [
  { value: 'promo', label: 'Promo', desc: 'Color rosa/secundario — ideal para lanzamientos', color: 'bg-pink-500' },
  { value: 'sale', label: 'Oferta', desc: 'Color rojo — descuentos y rebajas', color: 'bg-red-500' },
  { value: 'info', label: 'Info', desc: 'Color azul — avisos informativos', color: 'bg-blue-500' },
  { value: 'warning', label: 'Aviso', desc: 'Color amarillo — advertencias importantes', color: 'bg-amber-400' },
];

const typeOptions = [
  {
    value: 'top_bar',
    label: 'Barra superior',
    icon: 'horizontal_rule',
    desc: 'Franja delgada encima del navbar, visible en todas las páginas',
  },
  {
    value: 'modal',
    label: 'Popup modal',
    icon: 'open_in_new',
    desc: 'Ventana emergente centrada al cargar la página (1 vez por sesión)',
  },
];

export default function NuevoBannerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    message: '',
    subMessage: '',
    type: 'top_bar',
    variant: 'promo',
    image: '',
    link: '',
    linkText: '',
    isActive: true,
    dismissible: true,
    startDate: '',
    endDate: '',
  });

  const set = (field: string, value: unknown) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.message.trim()) {
      setError('El mensaje principal es obligatorio');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        subMessage: form.subMessage || null,
        image: form.image || null,
        link: form.link || null,
        linkText: form.linkText || null,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
      };

      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/admin/banners');
      } else {
        setError(data.error || 'Error al crear el banner');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Nuevo Banner</h1>
          <p className="text-gray-600 mt-1">Crea una alerta o anuncio para los visitantes</p>
        </div>
        <Link
          href="/admin/banners"
          className="px-4 py-2 border-2 border-accent-light rounded-lg hover:border-secondary transition-colors"
        >
          Cancelar
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo */}
        <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
          <h2 className="text-lg font-bold text-primary mb-4">Tipo de banner</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {typeOptions.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  form.type === opt.value
                    ? 'border-secondary bg-secondary/5'
                    : 'border-accent-light hover:border-secondary/40'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={opt.value}
                  checked={form.type === opt.value}
                  onChange={(e) => set('type', e.target.value)}
                  className="mt-1 accent-secondary"
                />
                <div>
                  <div className="flex items-center gap-2 font-semibold text-primary">
                    <span className="material-icons text-sm text-secondary">{opt.icon}</span>
                    {opt.label}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Variante */}
        <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
          <h2 className="text-lg font-bold text-primary mb-4">Estilo / Color</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {variantOptions.map((opt) => (
              <label
                key={opt.value}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${
                  form.variant === opt.value
                    ? 'border-secondary bg-secondary/5'
                    : 'border-accent-light hover:border-secondary/40'
                }`}
              >
                <input
                  type="radio"
                  name="variant"
                  value={opt.value}
                  checked={form.variant === opt.value}
                  onChange={(e) => set('variant', e.target.value)}
                  className="sr-only"
                />
                <span className={`w-8 h-8 rounded-full ${opt.color}`} />
                <span className="font-semibold text-sm text-primary">{opt.label}</span>
                <span className="text-xs text-gray-400 leading-tight">{opt.desc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6 space-y-4">
          <h2 className="text-lg font-bold text-primary">Contenido</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje principal <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.message}
              onChange={(e) => set('message', e.target.value)}
              placeholder="Ej: ¡Envío gratis en compras mayores a $150.000!"
              className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje secundario{' '}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={form.subMessage}
              onChange={(e) => set('subMessage', e.target.value)}
              placeholder="Ej: Solo por hoy • Código: GLOW10"
              className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de imagen{' '}
              <span className="text-gray-400 font-normal">(opcional — solo se muestra en popup modal)</span>
            </label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => set('image', e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
            />
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="mt-2 h-32 w-full object-cover rounded-lg border border-accent-light"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL del botón <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={form.link}
                onChange={(e) => set('link', e.target.value)}
                placeholder="/tienda o /kits"
                className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto del botón <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={form.linkText}
                onChange={(e) => set('linkText', e.target.value)}
                placeholder="Ej: Ver ofertas"
                className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Programación */}
        <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6 space-y-4">
          <h2 className="text-lg font-bold text-primary">Programación</h2>
          <p className="text-sm text-gray-500">
            Deja en blanco para mostrar el banner indefinidamente mientras esté activo.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de inicio
              </label>
              <input
                type="datetime-local"
                value={form.startDate}
                onChange={(e) => set('startDate', e.target.value)}
                className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de fin
              </label>
              <input
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => set('endDate', e.target.value)}
                className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Opciones */}
        <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6 space-y-4">
          <h2 className="text-lg font-bold text-primary">Opciones</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set('isActive', e.target.checked)}
              className="w-5 h-5 accent-secondary rounded"
            />
            <div>
              <span className="font-medium text-gray-800">Banner activo</span>
              <p className="text-xs text-gray-500">Los banners inactivos no se muestran a los usuarios</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.dismissible}
              onChange={(e) => set('dismissible', e.target.checked)}
              className="w-5 h-5 accent-secondary rounded"
            />
            <div>
              <span className="font-medium text-gray-800">Permite cerrarlo</span>
              <p className="text-xs text-gray-500">
                El usuario puede descartarlo; no volverá a aparecer en la misma sesión
              </p>
            </div>
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? 'Creando...' : 'Crear Banner'}
          </button>
        </div>
      </form>
    </div>
  );
}
