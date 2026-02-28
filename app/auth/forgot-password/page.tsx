'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/auth'
import { sendPasswordReset } from '@/lib/firebase/auth'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      await sendPasswordReset(data.email)
      setSuccess(true)
    } catch (error: any) {
      setError(error.message || 'Error al enviar email de recuperación')
    } finally {
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
              <span className="material-icons text-6xl text-secondary">mark_email_read</span>
            </div>
            <h1 className="text-3xl font-medium text-primary italic mb-4">
              Revisa tu Email
            </h1>
            <p className="text-accent mb-8">
              Te hemos enviado un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada.
            </p>
            <Link
              href="/auth/login"
              className="inline-block bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Volver al Login
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
              Recuperar Contraseña
            </h1>
            <p className="text-accent">
              Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Enviando...' : 'Enviar Enlace'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-sm text-secondary hover:underline"
            >
              Volver al Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
