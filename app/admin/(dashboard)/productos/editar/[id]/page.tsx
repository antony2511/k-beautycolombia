'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProductFormData {
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  compareAtPrice: number;
  stock: number;
  badge: string;
  badgeType: string;
  image: string;
  images: string[];
  benefits: string[];
  ingredients: string[];
  howToUse: string[];
  skinType: string[];
  isActive: boolean;
}

export default function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [productId, setProductId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: 0,
    compareAtPrice: 0,
    stock: 0,
    badge: '',
    badgeType: '',
    image: '',
    images: [],
    benefits: [],
    ingredients: [],
    howToUse: [],
    skinType: [],
    isActive: true,
  });

  const [currentBenefit, setCurrentBenefit] = useState('');
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [currentHowToUse, setCurrentHowToUse] = useState('');

  const categories = [
    'Limpiadores',
    'Hidratación',
    'Tratamiento',
    'Mascarillas',
    'Protección Solar',
    'Exfoliantes',
    'Sérum',
    'Contorno de Ojos',
  ];

  const badgeTypes = [
    { value: 'bestseller', label: 'Bestseller' },
    { value: 'new', label: 'Nuevo' },
    { value: 'discount', label: 'Descuento' },
  ];

  const skinTypes = [
    'Normal',
    'Seca',
    'Grasa',
    'Mixta',
    'Sensible',
    'Todo tipo',
  ];

  useEffect(() => {
    params.then((p) => {
      setProductId(p.id);
      fetchProduct(p.id);
    });
  }, []);

  const fetchProduct = async (id: string) => {
    try {
      setLoadingData(true);
      const response = await fetch(`/api/admin/products/${id}`);
      const data = await response.json();

      if (response.ok) {
        const product = data.product;
        setFormData({
          name: product.name || '',
          brand: product.brand || '',
          category: product.category || '',
          description: product.description || '',
          price: product.price || 0,
          compareAtPrice: product.compareAtPrice || 0,
          stock: product.stock || 0,
          badge: product.badge || '',
          badgeType: product.badgeType || '',
          image: product.image || '',
          images: product.images || [],
          benefits: product.benefits || [],
          ingredients: product.ingredients || [],
          howToUse: product.howToUse || [],
          skinType: product.skinType || [],
          isActive: product.isActive ?? true,
        });
      } else {
        setError(data.error || 'Error al cargar producto');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoadingData(false);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isMain: boolean = true
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Solo se permiten imágenes JPG, PNG o WebP');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      setError('');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/products/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        if (isMain) {
          setFormData((prev) => ({ ...prev, image: data.url }));
        } else {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, data.url],
          }));
        }
      } else {
        setError(data.error || 'Error al subir imagen');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Error al subir imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeAdditionalImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addArrayItem = (
    field: 'benefits' | 'ingredients' | 'howToUse',
    value: string,
    setter: (value: string) => void
  ) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], value.trim()],
    }));
    setter('');
  };

  const removeArrayItem = (
    field: 'benefits' | 'ingredients' | 'howToUse',
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.name || !formData.brand || !formData.price || !formData.image) {
        setError('Por favor completa todos los campos obligatorios');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/productos');
      } else {
        setError(data.error || 'Error al actualizar producto');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/productos');
      } else {
        const data = await response.json();
        setError(data.error || 'Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Editar Producto</h1>
          <p className="text-gray-600 mt-1">
            Modifica la información del producto
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
          >
            Eliminar
          </button>
          <Link
            href="/admin/productos"
            className="px-4 py-2 border-2 border-accent-light rounded-lg hover:border-secondary transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-primary mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border-2 border-accent-light rounded-lg hover:border-secondary transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
          <h2 className="text-xl font-bold text-primary mb-4">
            Información Básica
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Producto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, brand: e.target.value }))
                }
                className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Precios e Inventario */}
        <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
          <h2 className="text-xl font-bold text-primary mb-4">
            Precios e Inventario
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: parseFloat(e.target.value) || 0,
                  }))
                }
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio Comparación
              </label>
              <input
                type="number"
                value={formData.compareAtPrice || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    compareAtPrice: parseFloat(e.target.value) || 0,
                  }))
                }
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.stock || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    stock: parseInt(e.target.value) || 0,
                  }))
                }
                min="0"
                className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Badge
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, badge: e.target.value }))
                }
                placeholder="Ej: Bestseller, Nuevo"
                className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Badge
              </label>
              <select
                value={formData.badgeType}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, badgeType: e.target.value }))
                }
                className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
              >
                <option value="">Sin tipo</option>
                {badgeTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Imágenes */}
        <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
          <h2 className="text-xl font-bold text-primary mb-4">Imágenes</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen Principal <span className="text-red-500">*</span>
              </label>
              {formData.image ? (
                <div className="relative inline-block">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-accent-light"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, image: '' }))
                    }
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-accent-light rounded-lg cursor-pointer hover:border-secondary">
                  <span className="text-gray-500">
                    {uploadingImage ? 'Subiendo...' : 'Click para subir imagen'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imágenes Adicionales (máx. 4)
              </label>
              <div className="grid grid-cols-4 gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt={`Additional ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-accent-light"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {formData.images.length < 4 && (
                  <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-accent-light rounded-lg cursor-pointer hover:border-secondary">
                    <span className="text-gray-500 text-sm">+</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detalles del Producto */}
        <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
          <h2 className="text-xl font-bold text-primary mb-4">
            Detalles del Producto
          </h2>

          {/* Beneficios */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beneficios
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentBenefit}
                onChange={(e) => setCurrentBenefit(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addArrayItem('benefits', currentBenefit, setCurrentBenefit);
                  }
                }}
                placeholder="Escribe un beneficio y presiona Enter"
                className="flex-1 px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  addArrayItem('benefits', currentBenefit, setCurrentBenefit)
                }
                className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark"
              >
                Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.benefits.map((benefit, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-accent-light/30 rounded-full text-sm"
                >
                  {benefit}
                  <button
                    type="button"
                    onClick={() => removeArrayItem('benefits', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Ingredientes */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredientes
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addArrayItem(
                      'ingredients',
                      currentIngredient,
                      setCurrentIngredient
                    );
                  }
                }}
                placeholder="Escribe un ingrediente y presiona Enter"
                className="flex-1 px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  addArrayItem(
                    'ingredients',
                    currentIngredient,
                    setCurrentIngredient
                  )
                }
                className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark"
              >
                Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-accent-light/30 rounded-full text-sm"
                >
                  {ingredient}
                  <button
                    type="button"
                    onClick={() => removeArrayItem('ingredients', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Cómo Usar */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cómo Usar
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentHowToUse}
                onChange={(e) => setCurrentHowToUse(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addArrayItem('howToUse', currentHowToUse, setCurrentHowToUse);
                  }
                }}
                placeholder="Escribe un paso y presiona Enter"
                className="flex-1 px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  addArrayItem('howToUse', currentHowToUse, setCurrentHowToUse)
                }
                className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark"
              >
                Agregar
              </button>
            </div>
            <div className="space-y-2">
              {formData.howToUse.map((step, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-accent-light/30 rounded-lg text-sm"
                >
                  <span className="font-semibold">{index + 1}.</span>
                  <span className="flex-1">{step}</span>
                  <button
                    type="button"
                    onClick={() => removeArrayItem('howToUse', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tipo de Piel */}
          <div>
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
        </div>

        {/* Estado */}
        <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
          <h2 className="text-xl font-bold text-primary mb-4">Estado</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
              }
              className="w-5 h-5 text-secondary border-2 border-accent-light rounded focus:ring-2 focus:ring-secondary"
            />
            <span className="text-gray-700">Producto activo (visible en la tienda)</span>
          </label>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
