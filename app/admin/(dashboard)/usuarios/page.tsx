'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatDateTime } from '@/lib/utils/date';

interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  phoneNumber: string;
  createdAt: string;
  disabled: boolean;
  emailVerified: boolean;
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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
    fetchUsers();
  }, [search, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();

      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      params.append('limit', '100');

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users || []);
      } else {
        setError(data.error || 'Error al cargar usuarios');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      disabled: user.disabled,
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      setUpdating(true);
      setError('');

      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();

      if (response.ok) {
        setShowEditModal(false);
        setSelectedUser(null);
        fetchUsers();
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

  const columns = [
    {
      header: 'Usuario',
      accessorKey: 'displayName' as keyof User,
      cell: (row: User) => (
        <div className="flex items-center gap-3">
          {row.photoURL ? (
            <img
              src={row.photoURL}
              alt={row.displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-semibold">
              {getInitials(row.displayName)}
            </div>
          )}
          <div>
            <p className="font-semibold text-primary">{row.displayName}</p>
            <p className="text-sm text-gray-600">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Teléfono',
      accessorKey: 'phoneNumber' as keyof User,
      cell: (row: User) => (
        <span className="text-sm text-gray-600">
          {row.phoneNumber || 'No registrado'}
        </span>
      ),
    },
    {
      header: 'Fecha Registro',
      accessorKey: 'createdAt' as keyof User,
      cell: (row: User) => (
        <span className="text-sm text-gray-600" suppressHydrationWarning>
          {mounted ? formatDateTime(row.createdAt) : '...'}
        </span>
      ),
    },
    {
      header: 'Email Verificado',
      accessorKey: 'emailVerified' as keyof User,
      cell: (row: User) => (
        <StatusBadge
          status={row.emailVerified ? 'delivered' : 'pending'}
          label={row.emailVerified ? 'Sí' : 'No'}
        />
      ),
    },
    {
      header: 'Estado',
      accessorKey: 'disabled' as keyof User,
      cell: (row: User) => (
        <StatusBadge
          status={row.disabled ? 'cancelled' : 'delivered'}
          label={row.disabled ? 'Inactivo' : 'Activo'}
        />
      ),
    },
    {
      header: 'Acciones',
      accessorKey: 'id' as keyof User,
      cell: (row: User) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditClick(row)}
            className="text-sm text-secondary hover:text-secondary-dark font-medium"
          >
            Editar
          </button>
          <Link
            href={`/admin/usuarios/${row.id}`}
            className="text-sm text-primary hover:text-primary-dark font-medium"
          >
            Ver Detalle
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Usuarios</h1>
          <p className="text-gray-600 mt-1">
            Gestiona todos los usuarios registrados
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-secondary">{users.length}</div>
          <div className="text-sm text-gray-600">Total de usuarios</div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Buscar por email o nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
            >
              <option value="">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-md border border-accent-light/30 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando usuarios...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <div className="text-red-600 mb-2">⚠️ {error}</div>
            <button
              onClick={fetchUsers}
              className="text-sm text-secondary hover:text-secondary-dark font-medium"
            >
              Reintentar
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">No hay usuarios</p>
            <p className="text-sm mt-2">
              Cuando los usuarios se registren, aparecerán aquí
            </p>
          </div>
        ) : (
          <DataTable data={users} columns={columns} searchKey="displayName" />
        )}
      </div>

      {/* Resumen de estados */}
      {!loading && !error && users.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {users.filter((u) => !u.disabled).length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Activos</div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {users.filter((u) => u.disabled).length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Inactivos</div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {users.filter((u) => u.emailVerified).length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Email Verificado</div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {users.filter((u) => !u.emailVerified).length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Email No Verificado</div>
          </div>
        </div>
      )}

      {/* Modal Editar Usuario */}
      {showEditModal && selectedUser && (
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
                  value={selectedUser.email}
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
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
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
