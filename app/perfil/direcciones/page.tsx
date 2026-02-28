'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Address {
  id: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
}

export default function MisDireccionesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    isDefault: false,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      fetchAddresses();
    }
  }, [user, authLoading, router]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      // TODO: Implementar endpoint para obtener direcciones del usuario
      // const response = await fetch('/api/user/addresses');
      // const data = await response.json();
      // setAddresses(data.addresses);

      // Por ahora retornamos array vacío
      setAddresses([]);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setError('Error al cargar las direcciones');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setFormData({
      fullName: user?.displayName || '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: user?.phoneNumber || '',
      isDefault: addresses.length === 0,
    });
    setShowAddModal(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowAddModal(true);
  };

  const handleSaveAddress = async () => {
    try {
      // TODO: Implementar guardado de dirección
      console.log('Saving address:', formData);
      setShowAddModal(false);
      // Recargar direcciones
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      setError('Error al guardar la dirección');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta dirección?')) return;

    try {
      // TODO: Implementar eliminación de dirección
      console.log('Deleting address:', id);
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      setError('Error al eliminar la dirección');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      // TODO: Implementar cambio de dirección predeterminada
      console.log('Setting default address:', id);
      fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      setError('Error al cambiar la dirección predeterminada');
    }
  };

  if (authLoading || !user) {
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
      <div className="container mx-auto px-4 py-8 max-w-6xl pt-24">
      <div className="mb-8">
        <Link
          href="/perfil"
          className="inline-flex items-center gap-2 text-secondary hover:text-secondary-dark transition-colors mb-4"
        >
          <span className="material-icons">arrow_back</span>
          Volver a Mi Perfil
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">Mis Direcciones</h1>
            <p className="text-gray-600 mt-2">
              Gestiona tus direcciones de envío
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors flex items-center gap-2"
          >
            <span className="material-icons">add</span>
            Agregar Dirección
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center pb-12 pt-24">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent"></div>
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-12 text-center">
          <span className="material-icons text-6xl text-accent mb-4">
            location_on
          </span>
          <h2 className="text-2xl font-bold text-primary mb-2">
            No tienes direcciones guardadas
          </h2>
          <p className="text-gray-600 mb-6">
            Agrega una dirección de envío para agilizar tus compras
          </p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors"
          >
            <span className="material-icons">add</span>
            Agregar Dirección
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6 relative"
            >
              {address.isDefault && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Predeterminada
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-bold text-primary mb-2">
                  {address.fullName}
                </h3>
                <p className="text-gray-600 text-sm">{address.address}</p>
                <p className="text-gray-600 text-sm">
                  {address.city}, {address.state} {address.zipCode}
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Tel: {address.phone}
                </p>
              </div>

              <div className="flex gap-2">
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="flex-1 px-4 py-2 border-2 border-accent-light rounded-lg hover:border-secondary transition-colors text-sm"
                  >
                    Predeterminada
                  </button>
                )}
                <button
                  onClick={() => handleEditAddress(address)}
                  className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="px-4 py-2 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                >
                  <span className="material-icons text-base">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Agregar/Editar Dirección */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-primary mb-6">
              {editingAddress ? 'Editar Dirección' : 'Agregar Dirección'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, address: e.target.value }))
                  }
                  className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
                  placeholder="Calle, número, apartamento"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, city: e.target.value }))
                    }
                    className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departamento *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, state: e.target.value }))
                    }
                    className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, zipCode: e.target.value }))
                    }
                    className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isDefault: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 text-secondary border-2 border-accent-light rounded focus:ring-2 focus:ring-secondary"
                  />
                  <span className="text-gray-700">
                    Establecer como dirección predeterminada
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2 border-2 border-accent-light rounded-lg hover:border-secondary transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveAddress}
                className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors"
              >
                {editingAddress ? 'Guardar Cambios' : 'Agregar Dirección'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
      <Footer />
    </>
  );
}
