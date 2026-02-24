import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  limit,
} from 'firebase/firestore';
import { db } from './config';
import type { UserProfile, SavedAddress } from '@/types';
import type { Product } from '@/lib/data/products';

// ============================================================================
// USER PROFILES
// ============================================================================

export const createUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  const userRef = doc(db, 'users', userId);

  // Check if profile already exists
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return; // Profile already exists, don't overwrite
  }

  await setDoc(userRef, {
    ...data,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return null;

  return { id: userSnap.id, ...userSnap.data() } as UserProfile;
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...data,
    updated_at: new Date().toISOString(),
  });
};

// ============================================================================
// ADDRESSES
// ============================================================================

export const createAddress = async (userId: string, data: Omit<SavedAddress, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
  const addressesRef = collection(db, 'addresses');
  const newAddressRef = doc(addressesRef);

  await setDoc(newAddressRef, {
    ...data,
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  return newAddressRef.id;
};

export const getUserAddresses = async (userId: string): Promise<SavedAddress[]> => {
  const addressesRef = collection(db, 'addresses');
  const q = query(addressesRef, where('user_id', '==', userId), orderBy('created_at', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as SavedAddress[];
};

export const getAddress = async (addressId: string): Promise<SavedAddress | null> => {
  const addressRef = doc(db, 'addresses', addressId);
  const addressSnap = await getDoc(addressRef);

  if (!addressSnap.exists()) return null;

  return { id: addressSnap.id, ...addressSnap.data() } as SavedAddress;
};

export const updateAddress = async (addressId: string, data: Partial<SavedAddress>) => {
  const addressRef = doc(db, 'addresses', addressId);
  await updateDoc(addressRef, {
    ...data,
    updated_at: new Date().toISOString(),
  });
};

export const deleteAddress = async (addressId: string) => {
  const addressRef = doc(db, 'addresses', addressId);
  await deleteDoc(addressRef);
};

export const setDefaultAddress = async (userId: string, addressId: string) => {
  // First, unset all other addresses as default
  const addresses = await getUserAddresses(userId);
  for (const address of addresses) {
    if (address.is_default) {
      await updateAddress(address.id, { is_default: false });
    }
  }

  // Set the selected address as default
  await updateAddress(addressId, { is_default: true });
};

// ============================================================================
// ORDERS
// ============================================================================

export const createOrder = async (data: any) => {
  const ordersRef = collection(db, 'orders');
  const newOrderRef = doc(ordersRef);

  await setDoc(newOrderRef, {
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  return newOrderRef.id;
};

export const getUserOrders = async (userId: string): Promise<any[]> => {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('user_id', '==', userId), orderBy('created_at', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getOrdersByEmail = async (email: string): Promise<any[]> => {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('customer_email', '==', email), orderBy('created_at', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getOrder = async (orderId: string): Promise<any | null> => {
  const orderRef = doc(db, 'orders', orderId);
  const orderSnap = await getDoc(orderRef);

  if (!orderSnap.exists()) return null;

  return { id: orderSnap.id, ...orderSnap.data() };
};

export const updateOrder = async (orderId: string, data: any) => {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, {
    ...data,
    updated_at: new Date().toISOString(),
  });
};

// ============================================================================
// PRODUCTS
// ============================================================================

export const createProduct = async (productId: string, data: Product) => {
  const productRef = doc(db, 'products', productId);
  await setDoc(productRef, {
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
};

export const getAllProducts = async (): Promise<Product[]> => {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, orderBy('created_at', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
};

export const getProductById = async (productId: string): Promise<Product | null> => {
  const productRef = doc(db, 'products', productId);
  const productSnap = await getDoc(productRef);

  if (!productSnap.exists()) return null;

  return { id: productSnap.id, ...productSnap.data() } as Product;
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, where('category', '==', category), orderBy('created_at', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
};

export const getProductsByBrand = async (brand: string): Promise<Product[]> => {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, where('brand', '==', brand), orderBy('created_at', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
};

export const getBestSellers = async (limitCount: number = 4): Promise<Product[]> => {
  const productsRef = collection(db, 'products');
  const q = query(
    productsRef,
    where('badgeType', '==', 'bestseller'),
    orderBy('created_at', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
};

export const getRelatedProducts = async (currentProductId: string, limitCount: number = 4): Promise<Product[]> => {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, orderBy('created_at', 'desc'), limit(limitCount + 1));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .filter(doc => doc.id !== currentProductId)
    .slice(0, limitCount)
    .map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
};
