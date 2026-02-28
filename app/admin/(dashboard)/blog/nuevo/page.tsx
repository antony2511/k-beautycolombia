'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  skinType: string[];
  brands: string[];
  relatedProductIds: string[];
  isPublished: boolean;
  author: string;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function NuevoArticuloPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    skinType: [],
    brands: [],
    relatedProductIds: [],
    isPublished: false,
    author: 'Dra. Berenice Rodríguez',
  });

  const [currentBrand, setCurrentBrand] = useState('');
  const [currentProductId, setCurrentProductId] = useState('');

  const skinTypes = ['Normal', 'Seca', 'Grasa', 'Mixta', 'Sensible', 'Todas'];

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const toggleSkinType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      skinType: prev.skinType.includes(type)
        ? prev.skinType.filter((t) => t !== type)
        : [...prev.skinType, type],
    }));
  };

  const addBrand = () => {
    if (!currentBrand.trim()) return;
    setFormData((prev) => ({
      ...prev,
      brands: [...prev.brands, currentBrand.trim()],
    }));
    setCurrentBrand('');
  };

  const removeBrand = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      brands: prev.brands.filter((_, i) => i !== index),
    }));
  };

  const addProductId = () => {
    if (!currentProductId.trim()) return;
    setFormData((prev) => ({
      ...prev,
      relatedProductIds: [...prev.relatedProductIds, currentProductId.trim()],
    }));
    setCurrentProductId('');
  };

  const removeProductId = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      relatedProductIds: prev.relatedProductIds.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (isPublished: boolean) => {
    setLoading(true);
    setError('');

    try {
      if (!formData.title || !formData.slug || !formData.excerpt || !formData.content || !formData.coverImage || !formData.category) {
        setError('Por favor completa todos los campos obligatorios');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, isPublished }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/blog');
      } else {
        setError(data.error || 'Error al crear artículo');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Nuevo Artículo</h1>
          <p className="text-gray-600 mt-1">Crea un nuevo artículo para el blog</p>
        </div>
        <Link
          href="/admin/blog"
          className="px-4 py-2 border-2 border-accent-light rounded-lg hover:border-secondary transition-colors"
        >
          Cancelar
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Información Básica */}
        <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
          <h2 className="text-xl font-bold text-primary mb-4">Información Básica</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
                placeholder="Ej: Rutina de noche para piel grasa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="flex-1 px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none font-mono text-sm"
                  placeholder="rutina-de-noche-para-piel-grasa"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      slug: generateSlug(prev.title),
                    }))
                  }
                  className="px-4 py-2 bg-accent-light hover:bg-accent/20 rounded-lg text-sm transition-colors"
                >
                  Regenerar
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">URL: /blog/{formData.slug || 'mi-articulo'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
              >
                <option value="">Seleccionar categoría</option>
                <option value="rutina_dia">Rutina de día</option>
                <option value="rutina_noche">Rutina de noche</option>
                <option value="ingredientes">Ingredientes</option>
                <option value="casos_exito">Casos de éxito</option>
                <option value="consejos">Consejos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extracto <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                rows={3}
                className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
                placeholder="Breve descripción del artículo que aparecerá en el listado..."
              />
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
          <h2 className="text-xl font-bold text-primary mb-4">Contenido del Artículo</h2>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, content: e.target.value }))
            }
            rows={16}
            className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none font-mono text-sm"
            placeholder="Escribe el contenido completo del artículo aquí..."
          />
        </div>

        {/* Imagen de portada */}
        <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
          <h2 className="text-xl font-bold text-primary mb-4">Imagen de Portada</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de la imagen <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.coverImage}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, coverImage: e.target.value }))
              }
              className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
              placeholder="https://..."
            />
            {formData.coverImage && (
              <div className="mt-3">
                <img
                  src={formData.coverImage}
                  alt="Preview"
                  className="h-48 object-cover rounded-lg border-2 border-accent-light"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Detalles */}
        <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
          <h2 className="text-xl font-bold text-primary mb-4">Detalles</h2>

          {/* Tipo de Piel */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Piel
            </label>
            <div className="flex flex-wrap gap-2">
              {skinTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleSkinType(type)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    formData.skinType.includes(type)
                      ? 'border-secondary bg-secondary text-white'
                      : 'border-accent-light hover:border-secondary'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Marcas */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marcas Mencionadas
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentBrand}
                onChange={(e) => setCurrentBrand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addBrand();
                  }
                }}
                placeholder="Ej: COSRX, LANEIGE..."
                className="flex-1 px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
              />
              <button
                type="button"
                onClick={addBrand}
                className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark"
              >
                Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.brands.map((brand, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-accent-light/30 rounded-full text-sm"
                >
                  {brand}
                  <button
                    type="button"
                    onClick={() => removeBrand(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Productos Relacionados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IDs de Productos Relacionados
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentProductId}
                onChange={(e) => setCurrentProductId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addProductId();
                  }
                }}
                placeholder="ID del producto..."
                className="flex-1 px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none font-mono text-sm"
              />
              <button
                type="button"
                onClick={addProductId}
                className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark"
              >
                Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.relatedProductIds.map((pid, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-accent-light/30 rounded-full text-sm font-mono"
                >
                  {pid}
                  <button
                    type="button"
                    onClick={() => removeProductId(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Estado */}
        <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
          <h2 className="text-xl font-bold text-primary mb-4">Estado</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))
              }
              className="w-5 h-5 text-secondary border-2 border-accent-light rounded focus:ring-2 focus:ring-secondary"
            />
            <span className="text-gray-700">Publicar artículo (visible en el blog)</span>
          </label>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="px-6 py-3 border-2 border-accent-light rounded-lg hover:border-secondary transition-colors disabled:opacity-50"
          >
            Guardar borrador
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Publicar'}
          </button>
        </div>
      </div>
    </div>
  );
}
