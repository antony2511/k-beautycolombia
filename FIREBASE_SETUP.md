# Configuración de Firebase

## 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Ingresa el nombre del proyecto: `k-beauty-colombia`
4. Sigue los pasos del asistente

## 2. Configurar Firebase Authentication

1. En el menú lateral, ve a **Build** → **Authentication**
2. Haz clic en "Get started"
3. Habilita los siguientes proveedores:
   - **Email/Password**: Activar
   - **Google**: Activar (necesitarás configurar OAuth)

### Configurar Google OAuth

1. En el proveedor de Google, haz clic en "Configurar"
2. Ingresa tu email de soporte del proyecto
3. Guarda los cambios
4. Firebase te dará un Client ID y Client Secret automáticamente

## 3. Configurar Firestore Database

1. En el menú lateral, ve a **Build** → **Firestore Database**
2. Haz clic en "Create database"
3. Selecciona ubicación: `us-central` (o la más cercana)
4. Modo: **Producción** (empezar seguro)
5. Clic en "Enable"

### Reglas de Seguridad de Firestore

Copia y pega estas reglas en **Firestore Database** → **Rules**:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Addresses collection
    match /addresses/{addressId} {
      allow read: if request.auth != null && resource.data.user_id == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.user_id == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.user_id == request.auth.uid;
    }

    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth != null &&
                     (resource.data.user_id == request.auth.uid ||
                      resource.data.customer_email == request.auth.token.email);
      allow create: if request.auth != null || true; // Permitir guest checkout
      allow update: if request.auth != null && resource.data.user_id == request.auth.uid;
    }
  }
}
```

## 4. Obtener Credenciales de Firebase

1. En el menú lateral, ve a **Project settings** (ícono de engranaje)
2. En la sección **Your apps**, haz clic en el ícono **Web** (`</>`)
3. Registra tu app con un nombre: `K-Beauty Web`
4. **NO** marcar "Firebase Hosting" por ahora
5. Copia las credenciales que aparecen (firebaseConfig)

## 5. Configurar Variables de Entorno

1. Crea un archivo `.env.local` en la raíz del proyecto
2. Copia el contenido de `.env.local.example`
3. Reemplaza los valores con tus credenciales de Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=k-beauty-colombia.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=k-beauty-colombia
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=k-beauty-colombia.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abc123
```

## 6. Configurar Email Templates (Opcional)

Para personalizar los emails de Firebase (reset password, verificación):

1. Ve a **Authentication** → **Templates**
2. Personaliza cada template con tu branding
3. Cambia el dominio de acción si tienes uno personalizado

## 7. Probar el Sistema

1. Ejecuta `npm run dev`
2. Ve a `/auth/register`
3. Crea una cuenta de prueba
4. Verifica que se cree el documento en Firestore (`users` collection)
5. Prueba login, logout, forgot password

## Estructura de Datos en Firestore

### Collection: `users`
```javascript
{
  id: "uid_del_usuario",
  name: "Juan Pérez",
  email: "juan@email.com",
  phone: "3001234567",
  avatar_url: "https://...",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z"
}
```

### Collection: `addresses`
```javascript
{
  id: "auto_generated_id",
  user_id: "uid_del_usuario",
  name: "Juan Pérez",
  phone: "3001234567",
  address: "Calle 123 #45-67",
  city: "Bogotá",
  department: "Cundinamarca",
  zip_code: "110111",
  is_default: true,
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z"
}
```

### Collection: `orders`
```javascript
{
  id: "auto_generated_id",
  user_id: "uid_del_usuario", // null si es guest checkout
  customer_email: "juan@email.com",
  customer_name: "Juan Pérez",
  customer_phone: "3001234567",
  shipping_address: "Calle 123 #45-67, Bogotá",
  items: [...],
  total: 150000,
  payment_intent_id: "pi_...",
  payment_status: "paid",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z"
}
```

## Troubleshooting

### Error: "Firebase: Error (auth/unauthorized-domain)"
- Ve a **Authentication** → **Settings** → **Authorized domains**
- Agrega `localhost` y tu dominio de producción

### Error: "Missing or insufficient permissions"
- Verifica las reglas de Firestore
- Asegúrate de que el usuario esté autenticado

### Google Sign-In no funciona
- Verifica que Google esté habilitado en Authentication
- Revisa que el dominio esté autorizado
- Verifica las credenciales de OAuth en Google Cloud Console
