'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface UserProfile {
  displayName: string;
  email: string;
  phoneNumber: string;
  photoURL: string;
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
}

export default function PerfilPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    displayName: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      const userProfile = {
        displayName: user.displayName || user.email?.split('@')[0] || 'Usuario',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        photoURL: user.photoURL || '',
      };
      setProfile(userProfile);
      setFormData({
        displayName: userProfile.displayName,
        phoneNumber: userProfile.phoneNumber,
      });
      // Obtener órdenes del usuario
      fetchOrders();
    }
  }, [user, authLoading, router]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);

      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch('/api/user/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // TODO: Implementar actualización de perfil en Firebase
      // Por ahora solo simulamos el guardado
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('Perfil actualizado correctamente');
      setIsEditing(false);

      if (profile) {
        setProfile({
          ...profile,
          displayName: formData.displayName,
          phoneNumber: formData.phoneNumber,
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTotalSpent = () => {
    return orders.reduce((total, order) => {
      // Solo contar órdenes completadas o enviadas
      if (order.status === 'delivered' || order.status === 'shipped' || order.status === 'processing') {
        return total + order.total;
      }
      return total;
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (authLoading || !user || !profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-24">
      <h1 className="text-3xl font-bold text-primary mb-8">Mi Perfil</h1>

      {error && (
        <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-lg p-4 text-green-600">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
            <div className="flex flex-col items-center">
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={profile.displayName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-accent-light"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-3xl border-4 border-accent-light">
                  {getInitials(profile.displayName)}
                </div>
              )}
              <h2 className="mt-4 text-xl font-bold text-primary text-center">
                {profile.displayName}
              </h2>
              <p className="text-sm text-gray-600 text-center">{profile.email}</p>
            </div>
          </div>

          <nav className="bg-white rounded-xl shadow-md border border-accent-light/30 p-4">
            <Link
              href="/perfil"
              className="flex items-center gap-3 px-4 py-3 bg-accent-light/20 text-primary rounded-lg font-medium"
            >
              <span className="material-icons">person</span>
              Información Personal
            </Link>
            <Link
              href="/perfil/ordenes"
              className="flex items-center gap-3 px-4 py-3 text-primary hover:bg-accent-light/20 rounded-lg transition-colors"
            >
              <span className="material-icons">receipt_long</span>
              Mis Órdenes
            </Link>
            <Link
              href="/perfil/direcciones"
              className="flex items-center gap-3 px-4 py-3 text-primary hover:bg-accent-light/20 rounded-lg transition-colors"
            >
              <span className="material-icons">location_on</span>
              Mis Direcciones
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary">
                Información Personal
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors"
                >
                  Editar
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        displayName: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
                  />
                ) : (
                  <p className="text-primary font-semibold">{profile.displayName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <p className="text-primary font-semibold">{profile.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  El email no puede ser modificado
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
                    placeholder="Ingresa tu teléfono"
                  />
                ) : (
                  <p className="text-primary font-semibold">
                    {profile.phoneNumber || 'No registrado'}
                  </p>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        displayName: profile.displayName,
                        phoneNumber: profile.phoneNumber,
                      });
                      setError('');
                      setSuccess('');
                    }}
                    className="flex-1 px-4 py-2 border-2 border-accent-light rounded-lg hover:border-secondary transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Estadísticas */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-4 text-center">
              <div className="text-3xl font-bold text-secondary">
                {loadingOrders ? '...' : orders.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Órdenes</div>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-4 text-center">
              <div className="text-3xl font-bold text-secondary">
                {loadingOrders ? '...' : formatCurrency(getTotalSpent())}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Gastado</div>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-4 text-center">
              <div className="text-3xl font-bold text-secondary">0</div>
              <div className="text-sm text-gray-600 mt-1">Direcciones</div>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}
