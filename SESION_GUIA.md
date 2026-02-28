# Guía de Sesión — K-Beauty Colombia (Seoul Glow)

> Documento de referencia para retomar el proyecto en futuras sesiones.
> Última actualización: 2026-02-24

---

## 1. Descripción del Proyecto

Ecommerce de productos K-Beauty para Colombia, llamado **Seoul Glow**.
Construido con Next.js 15 + React 19 + TypeScript + Tailwind CSS.

---

## 2. Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend / SSR | Next.js 15 (App Router), React 19, TypeScript |
| Estilos | Tailwind CSS |
| Autenticación usuarios | Firebase Authentication |
| Base de datos usuarios/pedidos Firestore | Firebase Firestore |
| Base de datos productos/órdenes SQL | MySQL 8 + Prisma ORM |
| Pagos | Stripe (configurado, sin claves aún) / Wompi (código presente) |
| Proceso en servidor | PM2 |
| Runtime | Node.js v22.22.0 / npm 10.9.4 |

---

## 3. Ubicaciones Importantes

```
Proyecto:        /root/k-beautycolombia/
Build Next.js:   /root/k-beautycolombia/.next/
Variables de entorno:
  .env.local     → Firebase, Stripe, Admin, App URL
  .env           → Solo DATABASE_URL (para Prisma CLI)
Schema Prisma:   /root/k-beautycolombia/prisma/schema.prisma
Logs PM2:        /root/.pm2/logs/kbeauty-out.log
                 /root/.pm2/logs/kbeauty-error.log
```

---

## 4. Acceso a la App

| Recurso | URL |
|---------|-----|
| Tienda (inicio) | http://217.65.145.4:3001 |
| Catálogo | http://217.65.145.4:3001/tienda |
| Panel Admin | http://217.65.145.4:3001/admin/login |
| Login usuarios | http://217.65.145.4:3001/auth/login |

---

## 5. Credenciales y Servicios

### Panel de Administración
```
Email:     admin@kbeauty.com
Password:  Admin2024!
```
> El hash bcrypt y JWT secret están en `.env.local`.

### Base de Datos MySQL
```
Host:      localhost:3306
Database:  kbeauty
User:      kbeauty
Password:  kbeauty2024
URL:       mysql://kbeauty:kbeauty2024@localhost:3306/kbeauty
```
Acceso directo desde terminal:
```bash
mysql -u kbeauty -pkbeauty2024 kbeauty
```

### Firebase (proyecto: k-beauty-30ea2)
- Consola: https://console.firebase.google.com/project/k-beauty-30ea2
- Auth Domain: k-beauty-30ea2.firebaseapp.com
- Las credenciales completas están en `.env.local`

### Stripe
- Pendiente de configurar. Cuando se tengan las claves, agregar en `.env.local`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 6. Comandos de Gestión del Servidor

### Ver estado de la app
```bash
pm2 list
pm2 status kbeauty
```

### Ver logs en tiempo real
```bash
pm2 logs kbeauty
pm2 logs kbeauty --lines 50   # últimas 50 líneas
```

### Reiniciar la app (tras cambios en .env o config)
```bash
pm2 restart kbeauty
```

### Detener / Eliminar del proceso
```bash
pm2 stop kbeauty
pm2 delete kbeauty
```

### Volver a lanzar después de eliminar
```bash
cd /root/k-beautycolombia
pm2 start npm --name "kbeauty" -- start -- -p 3001
pm2 save
```

---

## 7. Flujo de Desarrollo

### Hacer cambios en el código
```bash
cd /root/k-beautycolombia

# 1. Editar archivos
# 2. Reconstruir
npm run build

# 3. Reiniciar
pm2 restart kbeauty
```

### Modo desarrollo (con hot reload, para iterar rápido)
```bash
cd /root/k-beautycolombia
pm2 stop kbeauty
npm run dev -- -p 3001
# Cuando termines: Ctrl+C y volver a pm2 start para producción
```

### Verificar tipos TypeScript sin compilar
```bash
cd /root/k-beautycolombia
npm run type-check
```

---

## 8. Base de Datos — Comandos Prisma

```bash
cd /root/k-beautycolombia

# Regenerar el cliente Prisma (tras cambiar schema.prisma)
npx prisma generate

# Sincronizar cambios del schema con la base de datos
npx prisma db push

# Ver y editar datos en UI web (corre en puerto 5555)
npx prisma studio

# Ejecutar seeds de productos de prueba
npm run seed:minimal
npm run seed:products   # seed completo
```

### Ver tablas actuales
```bash
mysql -u kbeauty -pkbeauty2024 kbeauty -e "SHOW TABLES;"
mysql -u kbeauty -pkbeauty2024 kbeauty -e "SELECT COUNT(*) as total FROM Product;"
```

---

## 9. Estructura de Carpetas Clave

```
app/
├── (tienda)/          # Rutas de la tienda pública
├── admin/             # Panel de administración (protegido por middleware)
│   ├── login/
│   ├── dashboard/
│   ├── productos/
│   ├── ordenes/
│   └── usuarios/
├── api/               # API Routes de Next.js
│   ├── admin/         # Endpoints del admin (products, orders, users, stats)
│   ├── checkout/      # create-order, verify-payment, verify-stripe-payment
│   └── products/      # Listado y detalle de productos
├── auth/              # Login, registro, recuperación de contraseña
├── carrito/           # Página del carrito
├── checkout/          # Formulario y confirmación de pago
├── producto/[id]/     # Detalle de producto
└── tienda/            # Catálogo general

lib/
├── admin/auth.ts      # JWT + bcrypt para sesión admin
├── firebase/          # config.ts, auth.ts, firestore.ts
├── firebase-admin.ts  # SDK Admin (servidor)
├── prisma.ts          # Cliente Prisma singleton
├── stores/            # Zustand (carrito, auth)
├── stripe/server.ts   # Cliente Stripe
└── wompi/client.ts    # Cliente Wompi
```

---

## 10. Correcciones ya Aplicadas

Los siguientes problemas fueron resueltos durante el despliegue inicial:

| Archivo | Problema | Solución |
|---------|----------|----------|
| `app/api/checkout/create-order/route.ts` | Importaba `@/lib/supabase/server` (eliminado) | Reescrito con Prisma |
| `app/api/checkout/verify-payment/route.ts` | Idem | Reescrito con Prisma |
| `app/api/checkout/verify-stripe-payment/route.ts` | Idem | Reescrito con Prisma |
| `app/auth/reset-password/page.tsx` | `useSearchParams()` sin Suspense | Envuelto en `<Suspense>` |
| `app/buscar/page.tsx` | Idem | Envuelto en `<Suspense>` |
| `app/checkout/confirmacion/[orderId]/page.tsx` | Idem | Envuelto en `<Suspense>` |
| `next.config.ts` | Build fallaba por errores ESLint/tipos | `ignoreDuringBuilds: true` |

---

## 11. Pendientes / Próximos Pasos

### Prioridad Alta
- [ ] **Agregar productos** al catálogo (via `/admin/productos/nuevo` o script seed)
- [ ] **Configurar Stripe** con claves reales de prueba
- [ ] **Configurar dominio** y proxy reverso (Nginx) para no exponer el puerto 3001

### Prioridad Media
- [ ] **Configurar Firebase Storage** para subir imágenes de productos desde el admin
- [ ] **Email transaccional** con Resend (variable `RESEND_API_KEY` en `.env.local`)
- [ ] **Webhook de Stripe** para confirmar pagos automáticamente

### Prioridad Baja
- [ ] Corregir errores de TypeScript (`any` types) para habilitar type-checking en build
- [ ] Corregir advertencias de ESLint (dependencias en `useEffect`, imágenes `<img>` vs `<Image>`)
- [ ] Implementar blog (`/blog`)
- [ ] Optimización SEO (meta tags, sitemap)

---

## 12. Configurar Nginx (Proxy Reverso) — Referencia Rápida

Para exponer la app en el puerto 80 con un dominio:

```nginx
server {
    listen 80;
    server_name tudominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 13. Cambiar la Contraseña del Admin

Genera un nuevo hash bcrypt con Node:
```bash
node -e "const b=require('bcryptjs'); console.log(b.hashSync('NuevaPassword', 12));"
```
Luego actualiza `ADMIN_PASSWORD_HASH` en `.env.local` y reinicia:
```bash
pm2 restart kbeauty
```

---

*Proyecto corriendo en PM2 (id: 2) en puerto 3001. Estado guardado en `/root/.pm2/dump.pm2`.*
