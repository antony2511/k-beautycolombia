'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatDateTime } from '@/lib/utils/date';
import { formatCurrency } from '@/lib/utils/currency';

interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  phoneNumber: string;
  createdAt: string;
  disabled: boolean;
  emailVerified: boolean;
  lastLoginAt?: string;
}

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  averageOrder: number;
  productsOrdered: number;
}

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [userId, setUserId] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    displayName: '',
    phoneNumber: '',
    disabled: false,
  });
  const [updating, setUpdating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    params.then((p) => {
      setUserId(p.id);
      fetchUser(p.id);
    });
  }, []);

  const fetchUser = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/admin/users/${id}`);
      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setStats(data.stats);
        setEditFormData({
          displayName: data.user.displayName,
          phoneNumber: data.user.phoneNumber,
          disabled: data.user.disabled,
        });
      } else {
        setError(data.error || 'Error al cargar usuario');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!userId) return;

    try {
      setUpdating(true);
      setError('');

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setShowEditModal(false);
      } else {
        setError(data.error || 'Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setUpdating(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name || name.trim() === '') return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent"></div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
        <Link
          href="/admin/usuarios"
          className="inline-block px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark"
        >
          Volver a Usuarios
        </Link>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-20 h-20 rounded-full object-cover border-4 border-accent-light"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-2xl border-4 border-accent-light">
              {getInitials(user.displayName)}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-primary">{user.displayName}</h1>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge
                status={user.disabled ? 'cancelled' : 'delivered'}
                label={user.disabled ? 'Inactivo' : 'Activo'}
              />
              <StatusBadge
                status={user.emailVerified ? 'delivered' : 'pending'}
                label={user.emailVerified ? 'Email Verificado' : 'Email No Verificado'}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark"
          >
            Editar
          </button>
          <Link
            href="/admin/usuarios"
            className="px-4 py-2 border-2 border-accent-light rounded-lg hover:border-secondary"
          >
            Volver
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Estadísticas */}
          <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Estadísticas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-accent-light/20 rounded-lg">
                <div className="text-3xl font-bold text-primary">
                  {stats?.totalOrders || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Órdenes</div>
              </div>
              <div className="text-center p-4 bg-accent-light/20 rounded-lg">
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(stats?.totalSpent || 0)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Gastado</div>
              </div>
              <div className="text-center p-4 bg-accent-light/20 rounded-lg">
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(stats?.averageOrder || 0)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Promedio Orden</div>
              </div>
              <div className="text-center p-4 bg-accent-light/20 rounded-lg">
                <div className="text-3xl font-bold text-primary">
                  {stats?.productsOrdered || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Productos</div>
              </div>
            </div>
          </div>

          {/* Información Personal */}
          <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
            <h2 className="text-xl font-bold text-primary mb-4">
              Información Personal
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="font-semibold text-primary">{user.displayName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-primary">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-semibold text-primary">
                    {user.phoneNumber || 'No registrado'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha de Registro</p>
                  <p className="font-semibold text-primary" suppressHydrationWarning>
                    {mounted ? formatDateTime(user.createdAt) : '...'}
                  </p>
                </div>
              </div>
              {user.lastLoginAt && (
                <div>
                  <p className="text-sm text-gray-600">Último Acceso</p>
                  <p className="font-semibold text-primary" suppressHydrationWarning>
                    {mounted ? formatDateTime(user.lastLoginAt) : '...'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Historial de Órdenes */}
          <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
            <h2 className="text-xl font-bold text-primary mb-4">
              Historial de Órdenes
            </h2>
            <div className="text-center py-8 text-gray-500">
              <p>No hay órdenes para mostrar</p>
              <p className="text-sm mt-2">
                Las órdenes del usuario aparecerán aquí cuando realice compras
              </p>
            </div>
          </div>
        </div>

        {/* Columna Lateral */}
        <div className="space-y-6">
          {/* Acciones */}
          <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Acciones</h2>
            <div className="space-y-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="w-full px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors"
              >
                Editar Información
              </button>
              <button
                onClick={() =>
                  setEditFormData((prev) => ({ ...prev, disabled: !user.disabled }))
                }
                className={`w-full px-4 py-2 rounded-lg transition-colors ${
                  user.disabled
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {user.disabled ? 'Activar Cuenta' : 'Desactivar Cuenta'}
              </button>
            </div>
          </div>

          {/* Estado de la Cuenta */}
          <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
            <h2 className="text-xl font-bold text-primary mb-4">
              Estado de la Cuenta
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estado</span>
                <StatusBadge
                  status={user.disabled ? 'cancelled' : 'delivered'}
                  label={user.disabled ? 'Inactivo' : 'Activo'}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Email Verificado</span>
                <StatusBadge
                  status={user.emailVerified ? 'delivered' : 'pending'}
                  label={user.emailVerified ? 'Sí' : 'No'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Editar Usuario */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-primary mb-4">Editar Usuario</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editFormData.displayName}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      displayName: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={editFormData.phoneNumber}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (No editable)
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 border-2 border-accent-light rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editFormData.disabled}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        disabled: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 text-secondary border-2 border-accent-light rounded focus:ring-2 focus:ring-secondary"
                  />
                  <span className="text-gray-700">Desactivar cuenta</span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-7">
                  El usuario no podrá iniciar sesión
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border-2 border-accent-light rounded-lg hover:border-secondary transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateUser}
                disabled={updating}
                className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors disabled:opacity-50"
              >
                {updating ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
