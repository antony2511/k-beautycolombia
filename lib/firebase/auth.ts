import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { auth } from './config';
import { createUserProfile } from './firestore';

// Register with email and password
export const registerWithEmail = async (
  email: string,
  password: string,
  name: string,
  phone?: string
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update display name
  await updateProfile(user, { displayName: name });

  // Create user profile in Firestore
  await createUserProfile(user.uid, {
    name,
    email,
    phone: phone || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  return user;
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Sign in with Google
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;

  // Create user profile if it doesn't exist
  await createUserProfile(user.uid, {
    name: user.displayName || '',
    email: user.email || '',
    phone: '',
    avatar_url: user.photoURL || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  return user;
};

// Sign out
export const signOut = async () => {
  await firebaseSignOut(auth);
};

// Send password reset email
export const sendPasswordReset = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

// Update user password
export const updateUserPassword = async (newPassword: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');
  await updatePassword(user, newPassword);
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
