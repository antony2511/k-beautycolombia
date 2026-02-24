'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useParams } from 'next/navigation';
import { useCartStore } from '@/lib/stores/useCartStore';
import type { Product } from '@/lib/data/products';

const routineSteps = [
  { icon: 'water_drop', label: 'Limpiar', active: false },
  { icon: 'blur_on', label: 'Tónico', active: false },
  { icon: 'opacity', label: 'Esencia', active: true },
  { icon: 'face', label: 'Crema', active: false },
  { icon: 'wb_sunny', label: 'Solar', active: false },
];

export default function ProductoPage() {
  const params = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('beneficios');
  const [productData, setProductData] = useState<Product | null>(null);
  const [relatedProductsList, setRelatedProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (response.ok) {
          const product = await response.json();
          setProductData(product);

          // Fetch related products (same category)
          if (product.category) {
            const relatedResponse = await fetch(`/api/products?category=${product.category}`);
            if (relatedResponse.ok) {
              const allProducts = await relatedResponse.json();
              // Filter out current product and take 4
              const related = allProducts
                .filter((p: Product) => p.id !== params.id)
                .slice(0, 4);
              setRelatedProductsList(related);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Si está cargando, mostrar spinner
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-grow container mx-auto px-6 py-12 max-w-7xl min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
            <p className="text-accent">Cargando producto...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Si no se encuentra el producto, mostrar mensaje
  if (!productData) {
    return (
      <>
        <Navbar />
        <main className="flex-grow container mx-auto px-6 py-12 max-w-7xl min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-4">
              Producto no encontrado
            </h1>
            <Link
              href="/tienda"
              className="text-secondary hover:text-primary transition-colors"
            >
              Volver a la tienda
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Usar las imágenes del producto o la imagen principal como fallback
  const productImages = productData.images || [productData.image];

  return (
    <>
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="text-xs uppercase tracking-widest text-accent mb-8">
          <Link href="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <Link href="/tienda" className="hover:text-primary transition-colors">
            Tienda
          </Link>
          <span className="mx-2">/</span>
          <span className="text-primary border-b border-primary">
            {productData.category || 'Producto'}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-4 h-fit lg:sticky lg:top-24">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:h-[600px] no-scrollbar shrink-0">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-24 lg:w-24 lg:h-32 shrink-0 border rounded overflow-hidden transition-all ${
                    selectedImage === idx
                      ? 'border-primary opacity-100'
                      : 'border-transparent hover:border-primary/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    width={96}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-grow bg-white/30 rounded-lg overflow-hidden relative group">
              <Image
                src={productImages[selectedImage]}
                alt={productData.name}
                width={800}
                height={1000}
                className="w-full h-[500px] lg:h-[600px] object-cover"
                priority
              />
              {productData.badge && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-bold uppercase tracking-widest text-primary">
                  {productData.badge}
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Title & Price */}
            <div className="border-b border-primary/10 pb-6">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-4xl lg:text-5xl font-medium text-primary leading-tight">
                  {productData.name}
                </h1>
                <button className="text-primary hover:text-red-500 transition-colors">
                  <span className="material-icons">favorite_border</span>
                </button>
              </div>

              <p className="text-sm text-accent uppercase tracking-wider mt-2">
                {productData.brand}
              </p>

              <div className="flex items-baseline gap-4 mt-4">
                <span className="text-3xl font-light text-primary">
                  {formatPrice(productData.price)}
                </span>
                {productData.compareAtPrice && (
                  <span className="text-sm text-accent line-through">
                    {formatPrice(productData.compareAtPrice)}
                  </span>
                )}
              </div>

              {/* Rating - Solo mostrar si existe */}
              <div className="flex gap-1 mt-3 items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-icons text-xs text-primary"
                  >
                    star
                  </span>
                ))}
                <span className="text-xs text-accent ml-2 tracking-wide">
                  (Nueva llegada)
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-primary/80 text-lg leading-relaxed">
              {productData.description ||
                'Producto de alta calidad importado directamente de Corea del Sur.'}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {/* Quantity */}
              <div className="flex items-center border border-primary rounded w-32 justify-between px-2 h-12">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-full flex items-center justify-center text-primary hover:bg-primary/5 transition-colors"
                >
                  -
                </button>
                <span className="text-primary">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-full flex items-center justify-center text-primary hover:bg-primary/5 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={() => addItem(productData, quantity)}
                className="flex-grow h-12 bg-secondary text-primary font-bold text-lg rounded hover:brightness-95 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Añadir al carrito</span>
                <span className="material-icons text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-accent mt-[-10px]">
              <span className="material-icons text-sm">local_shipping</span>
              <span>Envío gratis en Colombia por compras superiores a $150.000</span>
            </div>

            {/* Routine Visualizer */}
            <div className="bg-white/40 rounded-lg p-6 mt-4">
              <h3 className="text-xl text-primary mb-4 border-b border-primary/10 pb-2 font-medium">
                Rutina Recomendada
              </h3>
              <div className="flex justify-between items-center text-center relative">
                {/* Connecting Line */}
                <div className="absolute top-4 left-0 w-full h-[1px] bg-primary/20 -z-10"></div>

                {routineSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col items-center gap-2 group cursor-pointer transition-all ${
                      step.active
                        ? 'scale-110'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`${
                        step.active ? 'w-10 h-10' : 'w-8 h-8'
                      } rounded-full flex items-center justify-center z-10 shadow-md transition-all ${
                        step.active
                          ? 'bg-secondary border border-primary'
                          : 'bg-background-light border border-primary/20'
                      }`}
                    >
                      <span
                        className={`material-icons ${
                          step.active ? 'text-base' : 'text-sm'
                        } text-primary`}
                      >
                        {step.icon}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-primary">
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-8">
              <div className="flex border-b border-primary/10 gap-8">
                <button
                  onClick={() => setActiveTab('beneficios')}
                  className={`pb-3 text-lg transition-colors ${
                    activeTab === 'beneficios'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-accent hover:text-primary'
                  }`}
                >
                  Beneficios
                </button>
                <button
                  onClick={() => setActiveTab('ingredientes')}
                  className={`pb-3 text-lg transition-colors ${
                    activeTab === 'ingredientes'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-accent hover:text-primary'
                  }`}
                >
                  Ingredientes
                </button>
                <button
                  onClick={() => setActiveTab('uso')}
                  className={`pb-3 text-lg transition-colors ${
                    activeTab === 'uso'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-accent hover:text-primary'
                  }`}
                >
                  Cómo usar
                </button>
              </div>

              <div className="py-6">
                {activeTab === 'beneficios' && (
                  <ul className="space-y-3">
                    {productData.benefits && productData.benefits.length > 0 ? (
                      productData.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="material-icons text-primary mt-1 text-sm">
                            check_circle
                          </span>
                          <span className="text-primary/80 text-sm leading-relaxed">
                            {benefit}
                          </span>
                        </li>
                      ))
                    ) : (
                      <p className="text-primary/80">
                        Producto de alta calidad con múltiples beneficios para tu
                        piel.
                      </p>
                    )}
                  </ul>
                )}
                {activeTab === 'ingredientes' && (
                  <div className="text-primary/80">
                    {productData.ingredients && productData.ingredients.length > 0 ? (
                      <ul className="space-y-2">
                        {productData.ingredients.map((ingredient, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-secondary">•</span>
                            <span>{ingredient}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Ingredientes de alta calidad certificados por K-Beauty.</p>
                    )}
                  </div>
                )}
                {activeTab === 'uso' && (
                  <div className="text-primary/80">
                    {productData.howToUse && productData.howToUse.length > 0 ? (
                      <ol className="list-decimal list-inside space-y-2">
                        {productData.howToUse.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    ) : (
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Aplicar después de la limpieza</li>
                        <li>Usar cantidad adecuada según indicaciones</li>
                        <li>Masajear suavemente hasta absorber</li>
                        <li>Continuar con el siguiente paso de tu rutina</li>
                      </ol>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cross Sell Section */}
        <section className="mt-24 mb-12 border-t border-primary/10 pt-12">
          <h2 className="text-3xl text-primary text-center mb-12 font-medium italic">
            Completa tu ritual
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProductsList.map((product) => (
              <Link
                key={product.id}
                href={`/producto/${product.id}`}
                className="group cursor-pointer"
              >
                <div className="overflow-hidden rounded-lg mb-4 bg-white/40 relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={500}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addItem(product, 1);
                    }}
                    className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full shadow-sm hover:bg-secondary transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <span className="material-icons text-primary">
                      add
                    </span>
                  </button>
                </div>
                <h3 className="text-lg text-primary group-hover:text-secondary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-accent mb-2">{product.brand}</p>
                <p className="text-primary font-medium">
                  {formatPrice(product.price)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
