# Configuración de Stripe para K-Beauty Ecommerce

## 🎯 Cómo Obtener tus Credenciales de Stripe

### Paso 1: Crear Cuenta en Stripe

1. Ve a: https://dashboard.stripe.com/register
2. Regístrate con tu correo electrónico
3. Completa la información de tu negocio

### Paso 2: Acceder al Dashboard

1. Inicia sesión en: https://dashboard.stripe.com
2. Verás un interruptor en la esquina superior derecha que dice **"Modo de prueba"** (Test mode)
3. **Asegúrate de que esté ACTIVADO** - debe mostrar "Datos de prueba" o "Test mode"

### Paso 3: Obtener las API Keys

1. En el menú lateral izquierdo, click en **"Developers" (Desarrolladores)**
2. Click en **"API keys" (Claves de API)**
3. Verás dos claves:

#### a) Publishable Key (Clave Pública)
- Comienza con `pk_test_...`
- Es segura para usar en el frontend
- **Cópiala**

#### b) Secret Key (Clave Secreta)
- Comienza con `sk_test_...`
- Click en **"Reveal test key token"** para verla
- ⚠️ **¡NUNCA la compartas públicamente!**
- **Cópiala**

### Paso 4: Configurar en tu Proyecto

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Reemplaza las líneas de Stripe con tus claves:

```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_TU_CLAVE_AQUI
STRIPE_SECRET_KEY=sk_test_TU_CLAVE_AQUI
```

3. **Ejemplo real**:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51abc123XYZ...
STRIPE_SECRET_KEY=sk_test_51abc123XYZ...
```

### Paso 5: Reiniciar el Servidor

Después de actualizar las variables de entorno:

```bash
# Detén el servidor (Ctrl+C)
# Luego ejecuta:
npm run dev
```

---

## 💳 Tarjetas de Prueba de Stripe

Usa estas tarjetas para probar pagos:

### ✅ Pago Exitoso
- **Número**: `4242 4242 4242 4242`
- **MM/AA**: Cualquier fecha futura (ej: 12/25)
- **CVC**: Cualquier 3 dígitos (ej: 123)
- **ZIP**: Cualquier código postal (ej: 12345)

### ❌ Pago Rechazado (Fondos insuficientes)
- **Número**: `4000 0000 0000 9995`
- **MM/AA**: Cualquier fecha futura
- **CVC**: Cualquier 3 dígitos

### ⏳ Requiere Autenticación 3D Secure
- **Número**: `4000 0027 6000 3184`
- **MM/AA**: Cualquier fecha futura
- **CVC**: Cualquier 3 dígitos

Más tarjetas de prueba: https://stripe.com/docs/testing

---

## 🔐 Seguridad

### ⚠️ IMPORTANTE:

1. **NUNCA** subas tu `.env.local` a Git (ya está en `.gitignore`)
2. **NUNCA** compartas tu Secret Key (`sk_test_...`)
3. La Publishable Key (`pk_test_...`) es segura para el frontend

### Verificar que .env.local NO esté en Git:

```bash
git status
```

Si aparece `.env.local`, agrégalo al `.gitignore`:

```bash
echo ".env.local" >> .gitignore
```

---

## 🚀 Flujo de Pago con Stripe

### Cómo Funciona:

1. **Usuario llena el formulario de checkout**
2. **Click en "Proceder al Pago"**
3. **Se crea una orden en Supabase**
4. **Se crea una sesión de Stripe Checkout**
5. **Usuario es redirigido a Stripe** (página segura de Stripe)
6. **Usuario ingresa datos de tarjeta**
7. **Stripe procesa el pago**
8. **Usuario es redirigido de vuelta** con resultado
9. **Se verifica el pago con Stripe**
10. **Se actualiza la orden en Supabase**
11. **Se muestra confirmación al usuario**

---

## 📊 Ver Pagos en el Dashboard de Stripe

1. Ve a: https://dashboard.stripe.com/test/payments
2. Verás todos los pagos de prueba realizados
3. Click en cualquier pago para ver detalles completos

---

## ✅ Verificar que Todo Funciona

### Test Completo:

1. Agrega productos al carrito
2. Ve al carrito → "Proceder al Pago"
3. Completa el formulario de checkout
4. Click en "Proceder al Pago"
5. Deberías ser redirigido a Stripe
6. Usa la tarjeta `4242 4242 4242 4242`
7. Completa el pago
8. Deberías volver a tu sitio con confirmación ✅

---

## 🆘 Problemas Comunes

### Error: "STRIPE_SECRET_KEY no está configurada"
**Solución**: Verifica que el archivo `.env.local` existe y tiene las claves correctas

### Error: "Invalid API Key provided"
**Solución**:
- Verifica que copiaste la clave completa
- Asegúrate de que sean las claves de **test mode** (empiezan con `pk_test_` y `sk_test_`)

### El checkout no redirige a Stripe
**Solución**:
- Abre la consola del navegador (F12)
- Busca errores en la pestaña "Console"
- Verifica que las variables de entorno estén cargadas

### El pago se procesa pero no se actualiza la orden
**Solución**:
- Verifica que Supabase esté configurado correctamente
- Revisa los logs del servidor para ver errores

---

## 📞 Soporte

- Documentación de Stripe: https://stripe.com/docs
- Soporte de Stripe: https://support.stripe.com
- Testing con Stripe: https://stripe.com/docs/testing

---

## 🎉 ¡Listo!

Una vez configures tus claves de Stripe, tu ecommerce estará listo para procesar pagos de prueba.

Para pasar a producción, necesitarás:
1. Activar tu cuenta de Stripe (proporcionar información del negocio)
2. Cambiar las claves de `test` por las claves de `live`
3. Usar tarjetas reales en lugar de tarjetas de prueba
