'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, CheckoutFormData } from '@/lib/validations/checkout';

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isLoading: boolean;
  onValidationChange: (isValid: boolean) => void;
}

const CheckoutForm = React.forwardRef<HTMLFormElement, CheckoutFormProps>(
  ({ onSubmit, isLoading, onValidationChange }, ref) => {
    const {
      register,
      handleSubmit,
      formState: { errors, isValid },
    } = useForm<CheckoutFormData>({
      resolver: zodResolver(checkoutSchema),
      mode: 'onChange',
    });

    // Notify parent of validation state changes
    React.useEffect(() => {
      onValidationChange(isValid);
    }, [isValid, onValidationChange]);

    return (
      <form ref={ref} onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Información de Contacto */}
      <section className="bg-white/30 rounded-xl p-6 border border-accent/20">
        <h3 className="text-xl font-medium text-primary mb-6 flex items-center gap-2">
          <span className="material-icons text-secondary">person</span>
          Información de Contacto
        </h3>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-primary mb-2"
            >
              Nombre Completo *
            </label>
            <input
              {...register('fullName')}
              type="text"
              id="fullName"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white/50 text-primary placeholder-accent focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
              placeholder="Juan Pérez González"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary mb-2"
              >
                Correo Electrónico *
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white/50 text-primary placeholder-accent focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
                placeholder="correo@ejemplo.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-primary mb-2"
              >
                Teléfono *
              </label>
              <input
                {...register('phone')}
                type="tel"
                id="phone"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white/50 text-primary placeholder-accent focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
                placeholder="3001234567"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Documento de Identidad */}
      <section className="bg-white/30 rounded-xl p-6 border border-accent/20">
        <h3 className="text-xl font-medium text-primary mb-6 flex items-center gap-2">
          <span className="material-icons text-secondary">badge</span>
          Documento de Identidad
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="documentType"
              className="block text-sm font-medium text-primary mb-2"
            >
              Tipo de Documento *
            </label>
            <select
              {...register('documentType')}
              id="documentType"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white/50 text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
            >
              <option value="">Seleccionar...</option>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="NIT">NIT</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
            {errors.documentType && (
              <p className="mt-1 text-sm text-red-500">
                {errors.documentType.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="documentNumber"
              className="block text-sm font-medium text-primary mb-2"
            >
              Número de Documento *
            </label>
            <input
              {...register('documentNumber')}
              type="text"
              id="documentNumber"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white/50 text-primary placeholder-accent focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
              placeholder="1234567890"
            />
            {errors.documentNumber && (
              <p className="mt-1 text-sm text-red-500">
                {errors.documentNumber.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Dirección de Envío */}
      <section className="bg-white/30 rounded-xl p-6 border border-accent/20">
        <h3 className="text-xl font-medium text-primary mb-6 flex items-center gap-2">
          <span className="material-icons text-secondary">location_on</span>
          Dirección de Envío
        </h3>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-primary mb-2"
            >
              Dirección Completa *
            </label>
            <input
              {...register('address')}
              type="text"
              id="address"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white/50 text-primary placeholder-accent focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
              placeholder="Calle 123 # 45-67, Apto 101"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-primary mb-2"
              >
                Ciudad *
              </label>
              <input
                {...register('city')}
                type="text"
                id="city"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white/50 text-primary placeholder-accent focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
                placeholder="Bogotá"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-primary mb-2"
              >
                Departamento *
              </label>
              <input
                {...register('department')}
                type="text"
                id="department"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white/50 text-primary placeholder-accent focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
                placeholder="Cundinamarca"
              />
              {errors.department && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.department.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium text-primary mb-2"
              >
                Código Postal
              </label>
              <input
                {...register('postalCode')}
                type="text"
                id="postalCode"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white/50 text-primary placeholder-accent focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
                placeholder="110111"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Instrucciones de Entrega */}
      <section className="bg-white/30 rounded-xl p-6 border border-accent/20">
        <h3 className="text-xl font-medium text-primary mb-6 flex items-center gap-2">
          <span className="material-icons text-secondary">note</span>
          Instrucciones de Entrega (Opcional)
        </h3>

        <div>
          <textarea
            {...register('deliveryInstructions')}
            id="deliveryInstructions"
            disabled={isLoading}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white/50 text-primary placeholder-accent focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50 resize-none"
            placeholder="Ej: Tocar el timbre, entregar en portería, etc."
          />
        </div>
      </section>
    </form>
  );
});

CheckoutForm.displayName = 'CheckoutForm';

export default CheckoutForm;
