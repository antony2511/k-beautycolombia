# Configuración de Supabase

Esta guía te ayudará a configurar Supabase para el proyecto Seoul Glow.

## Paso 1: Crear Proyecto en Supabase

1. Ve a https://supabase.com y crea una cuenta (o inicia sesión)
2. Crea un nuevo proyecto:
   - Nombre: `seoul-glow-ecommerce`
   - Password de base de datos: Guarda esto en un lugar seguro
   - Región: Elige la más cercana (por ejemplo: South America - São Paulo)
3. Espera a que el proyecto se inicialice (toma ~2 minutos)

## Paso 2: Obtener Credenciales

1. En el dashboard de Supabase, ve a **Settings > API**
2. Copia los siguientes valores:
   - `Project URL` → Esta es tu `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → Esta es tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → Esta es tu `SUPABASE_SERVICE_ROLE_KEY`

3. Crea un archivo `.env` en la raíz del proyecto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
```

## Paso 3: Crear Esquema de Base de Datos

Ve a **SQL Editor** en Supabase y ejecuta el siguiente script:

```sql
-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de productos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  images TEXT[] DEFAULT '{}',
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  ingredients TEXT[] DEFAULT '{}',
  how_to_use TEXT,
  stock INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de perfiles de usuario (extendiendo auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de direcciones
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  zip_code VARCHAR(10),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de órdenes
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  shipping DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  wompi_transaction_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de cupones
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value DECIMAL(10, 2) NOT NULL,
  min_purchase DECIMAL(10, 2),
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de posts del blog
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author VARCHAR(255),
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de reseñas de productos
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name VARCHAR(255),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil al registrarse
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Paso 4: Configurar Row Level Security (RLS)

Ejecuta este script para configurar las políticas de seguridad:

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Políticas para products (público puede leer, solo admin puede escribir)
CREATE POLICY "Productos visibles públicamente" ON products
  FOR SELECT USING (true);

-- Políticas para profiles (usuarios pueden ver y editar su propio perfil)
CREATE POLICY "Usuarios pueden ver su propio perfil" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para addresses (usuarios solo ven y editan sus propias direcciones)
CREATE POLICY "Usuarios pueden ver sus propias direcciones" ON addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden crear sus propias direcciones" ON addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propias direcciones" ON addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propias direcciones" ON addresses
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para orders (usuarios solo ven sus propias órdenes)
CREATE POLICY "Usuarios pueden ver sus propias órdenes" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Políticas para coupons (público puede leer cupones activos)
CREATE POLICY "Cupones activos visibles públicamente" ON coupons
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Políticas para blog_posts (público puede leer posts publicados)
CREATE POLICY "Posts publicados visibles públicamente" ON blog_posts
  FOR SELECT USING (published_at IS NOT NULL AND published_at <= NOW());

-- Políticas para reviews (público puede leer, usuarios autenticados pueden crear)
CREATE POLICY "Reseñas visibles públicamente" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Usuarios autenticados pueden crear reseñas" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Paso 5: Configurar Storage para Imágenes

1. En Supabase, ve a **Storage**
2. Crea un nuevo bucket llamado `products`
3. Configura el bucket como público:
   - Click en el bucket `products`
   - Ve a Policies
   - Crea una política para permitir lectura pública:

```sql
CREATE POLICY "Imágenes de productos visibles públicamente"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');
```

4. Crea otro bucket llamado `blog` y repite el proceso

## Paso 6: Configurar Autenticación

1. Ve a **Authentication > Providers**
2. Habilita los siguientes proveedores:
   - ✅ Email (ya habilitado por defecto)
   - ✅ Google (opcional, para login social)
3. Configura las URLs de redirección:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

## Paso 7: Probar la Conexión

Después de completar estos pasos, reinicia el servidor de desarrollo:

```bash
npm run dev
```

La aplicación ahora debería estar conectada a Supabase.

## Notas Importantes

- **NO compartas** tus claves de `service_role` públicamente
- El archivo `.env` está en `.gitignore` por seguridad
- Para producción, actualiza las URLs de redirección en Supabase
- Considera habilitar verificación por email en producción

## Próximos Pasos

Una vez configurado Supabase, podemos continuar con:
1. Implementar autenticación (registro, login, logout)
2. Crear el catálogo de productos
3. Implementar el carrito de compras
4. Integrar Wompi para pagos
