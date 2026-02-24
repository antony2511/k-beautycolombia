'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { signOut } from '@/lib/firebase/auth'

export default function UserNav() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="text-primary hover:text-secondary focus:outline-none transition-colors"
        aria-label="Iniciar sesión"
      >
        <span className="material-icons">person</span>
      </Link>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-primary hover:text-secondary focus:outline-none transition-colors"
        aria-label="Mi cuenta"
      >
        <span className="material-icons">account_circle</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-primary/10 py-2 z-50">
          <div className="px-4 py-3 border-b border-primary/10">
            <p className="text-sm font-medium text-primary truncate">
              {user.email}
            </p>
          </div>

          <Link
            href="/perfil"
            className="block px-4 py-2 text-sm text-primary hover:bg-background-cream transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center gap-2">
              <span className="material-icons text-base">person</span>
              Mi Perfil
            </div>
          </Link>

          <Link
            href="/perfil/ordenes"
            className="block px-4 py-2 text-sm text-primary hover:bg-background-cream transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center gap-2">
              <span className="material-icons text-base">receipt_long</span>
              Mis Órdenes
            </div>
          </Link>

          <Link
            href="/perfil/direcciones"
            className="block px-4 py-2 text-sm text-primary hover:bg-background-cream transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center gap-2">
              <span className="material-icons text-base">location_on</span>
              Mis Direcciones
            </div>
          </Link>

          <div className="border-t border-primary/10 my-2"></div>

          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="material-icons text-base">logout</span>
              Cerrar Sesión
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
