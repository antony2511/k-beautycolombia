'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'
import { registerWithEmail, signInWithGoogle } from '@/lib/firebase/auth'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      await registerWithEmail(data.email, data.password, data.name, data.phone)
      // Enviar email de bienvenida (fire-and-forget)
      fetch('/api/auth/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, name: data.name }),
      }).catch(() => {});
      setSuccess(true)
    } catch (error: any) {
      setError(error.message || 'Error al registrarse')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await signInWithGoogle()
      router.push('/perfil')
      router.refresh()
    } catch (error: any) {
      setError(error.message || 'Error al registrarse con Google')
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <Navbar />
        <main className="flex-grow max-w-md mx-auto px-6 pb-12 pt-24 w-full min-h-screen flex items-center">
          <div className="w-full text-center">
            <div className="mb-6">
              <span className="material-icons text-6xl text-secondary">check_circle</span>
            </div>
            <h1 className="text-3xl font-medium text-primary italic mb-4">
              ¡Cuenta Creada Exitosamente!
            </h1>
            <p className="text-accent mb-8">
              Tu cuenta ha sido creada. Ya puedes iniciar sesión con tus credenciales.
            </p>
            <Link
              href="/auth/login"
              className="inline-block bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <main className="flex-grow max-w-md mx-auto px-6 pb-12 pt-24 w-full min-h-screen flex items-center">
        <div className="w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-medium text-primary italic mb-2">
              Crear Cuenta
            </h1>
            <p className="text-accent">
              ¿Ya tienes cuenta?{' '}
              <Link
                href="/auth/login"
                className="text-secondary hover:underline font-medium"
              >
                Inicia sesión
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-primary mb-2"
              >
                Nombre Completo
              </label>
              <input
                {...register('name')}
                type="text"
                id="name"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white/50 text-primary placeholder-accent focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
                placeholder="Juan Pérez"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary mb-2"
              >
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white/50 text-primary placeholder-accent focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
                placeholder="tu@email.com"
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
                Teléfono (Opcional)
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

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-primary mb-2"
              >
                Contraseña
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
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background-cream text-accent">O continúa con</span>
            </div>
          </div>

          {/* Google Signup */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-50 text-primary font-medium py-3 px-6 rounded-lg border border-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar con Google
          </button>
        </div>
      </main>

      <Footer />
    </>
  )
}
