import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductSlider from '@/components/productos/ProductSlider';
import BenefitsSlider from '@/components/home/BenefitsSlider';
import BrandsSlider from '@/components/home/BrandsSlider';
import { prisma } from '@/lib/prisma';

async function getBestSellers() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      badgeType: 'bestseller',
    },
    take: 4,
    orderBy: {
      createdAt: 'desc',
    },
  });

  // If no bestsellers, get first 4 products
  if (products.length === 0) {
    return await prisma.product.findMany({
      where: { isActive: true },
      take: 4,
      orderBy: { createdAt: 'desc' },
    });
  }

  return products;
}

const routineSteps = [
  {
    number: 1,
    title: 'Limpieza Doble',
    description:
      'Comienza con un limpiador en aceite para retirar maquillaje y protector solar, seguido de un limpiador acuoso.',
  },
  {
    number: 2,
    title: 'Tónico & Esencia',
    description:
      'Equilibra el pH de tu piel e hidrata profundamente para preparar tu rostro para los siguientes tratamientos.',
  },
  {
    number: 3,
    title: 'Hidratación',
    description:
      'Sella la humedad con una crema o emulsión adecuada para tu tipo de piel para mantener la barrera cutánea fuerte.',
  },
  {
    number: 4,
    title: 'Protección Solar',
    description:
      'El paso más importante. Aplica protector solar cada mañana para prevenir el envejecimiento prematuro.',
  },
];

const brands = [
  'COSRX',
  'BEAUTY OF JOSEON',
  'SOME BY MI',
  'LANEIGE',
  'INNISFREE',
  'ETUDE',
];

export default async function HomePage() {
  const bestSellers = await getBestSellers();

  return (
    <>
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-12 md:pt-32 md:pb-24 overflow-hidden min-h-[700px] md:min-h-[800px]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-background-white/80 via-secondary/5 to-background-white/80 z-10"></div>
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3t8zFNjqMHb4gUoeEiAL8ARUjYVgpnu0bSgZyq_t31TQviF6jm-EUufzVjA_FmTxeXCNRAKXQo3eOA5bh_uN7SpK2llX_DG7MUXkqM3HHb_cJfAtjv3hf3wb7-eA5CWkgvNpMf-uB3EiHG2rdeJuZHw4SKXnjVRzskS8CpqkaHXpUtRjJ4Rk7xLCHs9EvpxFxWM6lzIpsoOFiMYAiuZRFR-bdLMzASL1q6KmSZtK4GCT5w8r1f-Wi3Pv4uJ_g-Bd9FKAxo7W3a_x1"
              alt="Asian woman with radiant glowing skin"
              fill
              className="object-cover object-center scale-105 animate-[scale_20s_ease-in-out_infinite]"
              priority
            />
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Floating circles */}
            <div className="absolute top-20 right-10 w-32 h-32 bg-secondary/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-secondary-light/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>

            {/* Sparkle elements */}
            <div className="absolute top-32 left-1/4 w-2 h-2 bg-secondary rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-32 right-1/3 w-2 h-2 bg-secondary rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
          </div>

          {/* Content */}
          <div className="relative z-20 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center min-h-[600px]">
            {/* Badge animado */}
            <div className="mb-6 inline-flex items-center gap-2 bg-gradient-to-r from-secondary to-secondary-light text-white backdrop-blur-md px-5 py-2.5 rounded-full w-fit shadow-2xl shadow-secondary/50 animate-slide-in-left">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span className="font-bold tracking-widest text-sm uppercase">
                K-Beauty Colombia
              </span>
            </div>

            {/* Título con animación */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary mb-6 leading-[1.1] max-w-3xl animate-slide-in-left drop-shadow-2xl" style={{ animationDelay: '0.1s', textShadow: '0 4px 20px rgba(255,255,255,0.8)' }}>
              Descubre el secreto <br />
              de la{' '}
              <span className="relative inline-block">
                <span className="text-secondary italic relative z-10">Glass Skin</span>
                <span className="absolute bottom-2 left-0 w-full h-4 bg-secondary/40 -skew-x-12 -z-10 blur-sm"></span>
              </span>
              .
            </h1>

            {/* Descripción */}
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl max-w-lg shadow-xl animate-slide-in-left border border-white/50" style={{ animationDelay: '0.2s' }}>
              <p className="text-lg md:text-xl text-primary font-medium leading-relaxed">
                Productos auténticos importados de Corea del Sur. Transforma tu
                rutina con ingredientes puros y tecnología innovadora.
              </p>
            </div>

            {/* Botones mejorados */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
              <Link
                href="/tienda"
                className="group relative px-10 py-5 bg-primary text-white rounded-full font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-primary/50 inline-flex items-center justify-center"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <span className="relative z-10">Comprar Ahora</span>
                <span className="material-icons ml-2 text-lg relative z-10 group-hover:translate-x-2 transition-transform">
                  arrow_forward
                </span>
              </Link>

              <Link
                href="/rutina"
                className="group px-10 py-5 bg-white/95 backdrop-blur-md text-primary border-2 border-primary rounded-full font-bold text-lg hover:bg-primary hover:text-white transition-all duration-300 inline-flex items-center justify-center hover:scale-110 shadow-xl"
              >
                Ver Rutina
                <span className="material-icons ml-2 text-lg group-hover:rotate-90 transition-transform duration-300">
                  explore
                </span>
              </Link>
            </div>

            {/* Stats o features rápidos - Slider automático en móvil */}
            <BenefitsSlider />
          </div>
        </section>

        {/* Los Más Vendidos Section */}
        <section className="py-20 bg-gradient-to-b from-background-white to-background-gray">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="section-title">Los Más Vendidos</h2>
                <p className="section-subtitle">
                  Los favoritos de nuestra comunidad en Colombia.
                </p>
              </div>
              <Link
                href="/tienda"
                className="hidden md:flex items-center text-primary font-medium hover:text-secondary transition-colors"
              >
                Ver todo
                <span className="material-icons ml-1 text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Slider de productos */}
            <ProductSlider products={bestSellers} autoSlide={true} slideInterval={4000} />

            <div className="mt-8 lg:hidden text-center">
              <Link
                href="/tienda"
                className="inline-flex items-center text-primary font-medium hover:text-secondary transition-colors"
              >
                Ver todo
                <span className="material-icons ml-1 text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Routine Education Section */}
        <section className="py-24 bg-surface-white border-y border-accent-light/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-2 block">
                  Educación
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                  Tu Rutina en 4 Pasos
                </h2>
                <p className="text-accent mb-8 text-lg leading-relaxed">
                  La belleza coreana no se trata de cubrir imperfecciones, sino de
                  cuidar la piel desde la raíz. Sigue estos pasos esenciales para
                  lograr una piel sana y luminosa.
                </p>
                <div className="space-y-8">
                  {routineSteps.map((step) => (
                    <div key={step.number} className="flex">
                      <div className="flex-shrink-0 mr-6">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-primary font-bold text-xl">
                          {step.number}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-primary mb-2">
                          {step.title}
                        </h4>
                        <p className="text-gray-500">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-full min-h-[500px] rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeHzymRWIQuHEdDcenT1D7x6E5wF7DX5YKQi5rwQXZOHZWXhIrQqn0wTLDZR1JyQGAqISCrxaXXdugB4UvM8kR8DOsQRrb5xK0oSmbLxInooea5uzJjcXdHXx3rRG4BS7LetDtMOTOCH6d7hZviTDtFVDcoLcPsdGBTA9FoMhw0Ravv7IcRzZFN9-fgX3n7BCnrmH3pMp6ZhQ_ZFUBtLdLiPx30_4a3aU1r37zM9oBhEBbBy_lxujzpmYvXec3nFKJcL1cv9b-I3dA"
                  alt="Close up of person applying skincare cream"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-8">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl w-full">
                    <p className="text-white italic">
                      "Desde que empecé la rutina coreana, mi piel nunca ha estado
                      tan suave y radiante. ¡Los productos son magia!"
                    </p>
                    <div className="mt-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-300 mr-3 overflow-hidden relative">
                        <Image
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsEf_tVgKQgK2M9tZc2jCVLae_guGAwbQdmw6JE6BumpaPDLgjuICPoIYvIonWj7amnJkGET64PdIY7tTe1TjGqgQltdfRzLbEebzop32tEY_MTBSDLxERSxOfBWL93oyEb1OdKYSCwDn2mJ1CXij57UNEivVP-I2g9th9imhn9tx2-PjsLup3xELq91emShHJKdhq2Iz74nNwStr9r1A0tnuEUiCyHuJoOtAgDEkbGRn6T4tPK3fq3VZq1ogXKVCQenS2WY5mkEhh"
                          alt="User avatar"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-white text-sm font-medium">
                        Valentina R. - Bogotá
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Medical Curation Section */}
        <section className="py-24 bg-gradient-to-br from-background-gray via-background-white to-background-gray">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white rounded-3xl shadow-2xl overflow-hidden border border-accent-light/30">
              {/* Imagen - Lado Izquierdo */}
              <div className="relative h-full min-h-[600px] lg:min-h-[700px] order-2 lg:order-1">
                <Image
                  src="/dra-berenice.png"
                  alt="Dra. Berenice Rodríguez - Médica Estética"
                  fill
                  className="object-cover object-top"
                  style={{ objectPosition: 'center top' }}
                />
                {/* Overlay sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>

                {/* Badge flotante */}
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
                  <p className="text-sm font-bold text-primary">Médica Estética</p>
                </div>
              </div>

              {/* Contenido - Lado Derecho */}
              <div className="p-8 lg:p-16 order-1 lg:order-2">
                {/* Subtítulo */}
                <span className="inline-block text-secondary font-bold uppercase tracking-widest text-sm mb-4 bg-secondary/10 px-4 py-2 rounded-full">
                  Criterio Profesional
                </span>

                {/* Título */}
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
                  La Ciencia detrás de tu{' '}
                  <span className="relative inline-block">
                    <span className="text-secondary italic">Glow</span>
                    <span className="absolute bottom-1 left-0 w-full h-3 bg-secondary/30 -skew-x-12"></span>
                  </span>
                </h2>

                {/* Cuerpo de texto */}
                <div className="mb-8 space-y-4">
                  <p className="text-lg text-accent leading-relaxed">
                    Como médica estética, entiendo que cada piel es un ecosistema único. He seleccionado personalmente cada producto de esta tienda, asegurándome de que la innovación coreana cumpla con los más altos estándares de salud cutánea.
                  </p>
                  <p className="text-lg text-accent leading-relaxed font-medium">
                    No solo vendemos productos; compartimos resultados probados.
                  </p>
                </div>

                {/* Firma */}
                <div className="mb-8 flex items-center gap-4">
                  <div className="h-px flex-grow bg-gradient-to-r from-accent/50 to-transparent"></div>
                  <p className="text-primary font-bold text-lg italic">Dra. Berenice Rodríguez</p>
                </div>

                {/* CTA Button */}
                <Link
                  href="/sobre-nosotros"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-secondary to-secondary-light text-white rounded-full font-bold text-lg shadow-xl shadow-secondary/30 hover:shadow-2xl hover:shadow-secondary/50 transition-all duration-300 hover:scale-105"
                >
                  <span>Conoce mi trayectoria</span>
                  <span className="material-icons text-xl group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>

                {/* Decorative element */}
                <div className="mt-8 flex items-center gap-4 opacity-60">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-secondary/30 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-secondary/50 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-secondary/70 border-2 border-white"></div>
                  </div>
                  <p className="text-sm text-accent">
                    +500 clientas satisfechas en Colombia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brands Section */}
        <section className="py-12 bg-gradient-to-r from-background-cream/30 via-secondary/5 to-background-cream/30 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 text-center mb-8">
            <h3 className="text-lg font-medium text-accent uppercase tracking-widest">
              Nuestras Marcas Oficiales
            </h3>
          </div>

          {/* Slider para móvil */}
          <div className="lg:hidden">
            <BrandsSlider brands={brands} />
          </div>

          {/* Diseño estático para desktop */}
          <div className="hidden lg:flex justify-between items-center max-w-7xl mx-auto px-6 opacity-60 hover:opacity-100 transition-all duration-500 gap-8">
            {brands.map((brand) => (
              <span
                key={brand}
                className="text-2xl font-bold text-primary/70 hover:text-primary cursor-pointer transition-colors"
              >
                {brand}
              </span>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-br from-secondary/10 via-secondary-light/10 to-secondary/10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <span className="material-icons text-5xl text-secondary mb-4">
              mail_outline
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Únete al Glow Club
            </h2>
            <p className="text-accent mb-8 max-w-xl mx-auto">
              Recibe tips de cuidado de la piel, acceso anticipado a nuevos
              productos y un{' '}
              <span className="text-primary font-bold">10% de descuento</span> en
              tu primera compra.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                className="input-field flex-1"
                placeholder="Tu correo electrónico"
                required
              />
              <button type="submit" className="btn-primary">
                Suscribirme
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
