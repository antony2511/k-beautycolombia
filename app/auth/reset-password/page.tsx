'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth'
import { confirmPasswordReset } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [oobCode, setOobCode] = useState<string | null>(null)

  useEffect(() => {
    const code = searchParams.get('oobCode')
    setOobCode(code)
    if (!code) {
      setError('Código de reseteo inválido o expirado')
    }
  }, [searchParams])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!oobCode) {
      setError('Código de reseteo no encontrado')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await confirmPasswordReset(auth, oobCode, data.password)
      alert('¡Contraseña actualizada exitosamente!')
      router.push('/auth/login')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Error al actualizar contraseña')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-medium text-primary italic mb-2">
          Nueva Contraseña
        </h1>
        <p className="text-accent">
          Ingresa tu nueva contraseña
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Reset Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-primary mb-2"
          >
            Nueva Contraseña
          </label>
          <input
            {...register('password')}
            type="password"
            id="password"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white/50 text-primary placeholder-accent focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-primary mb-2"
          >
            Confirmar Contraseña
          </label>
          <input
            {...register('confirmPassword')}
            type="password"
            id="confirmPassword"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white/50 text-primary placeholder-accent focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow max-w-md mx-auto px-6 pb-12 pt-24 w-full min-h-screen flex items-center">
        <Suspense fallback={<div className="text-center text-primary">Cargando...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
