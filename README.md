# GlowSeoul - Ecommerce K-Beauty Colombia

Plataforma de ecommerce profesional, premium y minimalista para productos de belleza coreana en Colombia.

## Stack Tecnológico

- **Frontend:** Next.js 15 con React 19 y TypeScript
- **Styling:** Tailwind CSS con diseño personalizado
- **Backend:** Supabase (Auth, Database, Storage)
- **Pagos:** Wompi (Colombia)
- **Deployment:** Vercel (recomendado)

## Características

- ✅ Diseño premium minimalista (completado)
- ✅ Responsive design (completado)
- ✅ Navegación funcional (completado)
- ⏳ Sistema de autenticación
- ⏳ Catálogo de productos con filtros
- ⏳ Carrito de compras
- ⏳ Pasarela de pago Wompi
- ⏳ Panel de administración
- ⏳ Sistema de cupones/descuentos
- ⏳ Blog integrado con CMS
- ⏳ Optimización SEO

## Instalación

```bash
# Clonar el repositorio (si aplica)
git clone <repo-url>

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

El sitio estará disponible en http://localhost:3000

## Variables de Entorno

Copia `.env.example` a `.env` y configura las siguientes variables:

- **Supabase:** Crea un proyecto en https://supabase.com
- **Wompi:** Obtén tus credenciales en https://wompi.com

## Estructura del Proyecto

```
.
├── app/                    # Next.js App Router
│   ├── (tienda)/          # Rutas de tienda
│   ├── admin/             # Panel de administración
│   ├── api/               # API routes
│   ├── blog/              # Blog
│   └── page.tsx           # Homepage
├── components/            # Componentes React
│   ├── layout/           # Layout components (Nav, Footer)
│   ├── ui/               # UI components reutilizables
│   ├── productos/        # Componentes de productos
│   ├── carrito/          # Componentes de carrito
│   └── checkout/         # Componentes de checkout
├── lib/                   # Utilidades y configuraciones
│   ├── supabase/         # Cliente Supabase
│   ├── hooks/            # Custom hooks
│   ├── stores/           # State management (Zustand)
│   ├── utils/            # Utilidades
│   └── validations/      # Esquemas de validación (Zod)
├── types/                # TypeScript types
└── public/               # Assets estáticos
```

## Comandos Disponibles

```bash
npm run dev          # Servidor de desarrollo con Turbopack
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run type-check   # Verificar tipos TypeScript
```

## Roadmap de Desarrollo

### Fase 1: Configuración Base (Completado)
- ✅ Setup Next.js 15 + TypeScript
- ✅ Configuración Tailwind CSS
- ✅ Migración del diseño a componentes
- ✅ Estructura de carpetas

### Fase 2: Supabase & Auth (En progreso)
- ⏳ Configuración Supabase
- ⏳ Esquema de base de datos
- ⏳ Sistema de autenticación
- ⏳ Perfiles de usuario

### Fase 3: Catálogo de Productos
- ⏳ Modelo de datos de productos
- ⏳ Página de catálogo con filtros
- ⏳ Búsqueda de productos
- ⏳ Página de detalle de producto

### Fase 4: Carrito & Checkout
- ⏳ Estado global del carrito (Zustand)
- ⏳ Página de carrito
- ⏳ Proceso de checkout
- ⏳ Integración Wompi

### Fase 5: Panel Admin
- ⏳ Dashboard administrativo
- ⏳ Gestión de productos
- ⏳ Gestión de órdenes
- ⏳ Sistema de cupones

### Fase 6: Funcionalidades Adicionales
- ⏳ Blog con CMS
- ⏳ Notificaciones por email
- ⏳ SEO optimization
- ⏳ Performance optimization

## Diseño

El diseño sigue una estética moderna y minimalista inspirada en K-Beauty:

- **Paleta de colores:**
  - Primary: `#344648` (gris azulado oscuro)
  - Secondary: `#FFBB98` (peach - acentos)
  - Background Cream: `#FBE0C3` (beige suave)
  - Background Light: `#FFF5EB` (crema claro)
  - Accent: `#7D8E95` (gris azulado medio)

- **Tipografía:** Space Grotesk (sans-serif moderno)
- **Estilo:** Premium, limpio, minimalista, orientado a ecommerce

## Licencia

Proyecto privado - GlowSeoul Colombia © 2026
