import admin from 'firebase-admin';
import type { Firestore } from 'firebase-admin/firestore';

let isInitialized = false;
let firestoreInstance: Firestore | null = null;

// Inicializar Firebase Admin solo una vez
if (!admin.apps.length) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    console.log('🔧 Attempting to initialize Firebase Admin...');
    console.log('🔧 Project ID:', projectId ? 'Present' : 'Missing');
    console.log('🔧 Client Email:', clientEmail ? 'Present' : 'Missing');
    console.log('🔧 Private Key:', privateKey ? 'Present (length: ' + privateKey?.length + ')' : 'Missing');

    if (!projectId || !clientEmail || !privateKey) {
      console.error('❌ Firebase Admin credentials missing');
      throw new Error('Missing Firebase credentials');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    console.log('✅ Firebase Admin app initialized');

    // Inicializar Firestore explícitamente
    try {
      firestoreInstance = admin.firestore();

      // Configurar settings de Firestore
      firestoreInstance.settings({
        ignoreUndefinedProperties: true,
      });

      isInitialized = true;
      console.log('✅ Firestore initialized successfully');
    } catch (firestoreError) {
      console.error('❌ Error initializing Firestore:', firestoreError);
      firestoreInstance = null;
      isInitialized = false;
    }
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error);
    isInitialized = false;
    firestoreInstance = null;
  }
} else {
  // Si ya existe una app, obtener Firestore
  try {
    firestoreInstance = admin.firestore();
    isInitialized = true;
    console.log('✅ Using existing Firebase Admin instance');
  } catch (error) {
    console.error('❌ Error getting existing Firestore:', error);
    firestoreInstance = null;
    isInitialized = false;
  }
}

// Exportar instancias
export const db = firestoreInstance;
export const auth = isInitialized ? admin.auth() : null;
export const isFirebaseInitialized = () => isInitialized && firestoreInstance !== null;
export default admin;
