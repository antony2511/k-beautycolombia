'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'exists'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'newsletter' }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('¡Listo! Revisa tu correo para obtener tu descuento 🎉');
        setEmail('');
      } else if (data.alreadyExists) {
        setStatus('exists');
        setMessage('Este correo ya está registrado en el Glow Club.');
      } else {
        setStatus('error');
        setMessage('Algo salió mal. Inténtalo de nuevo.');
      }
    } catch {
      setStatus('error');
      setMessage('Error de conexión. Inténtalo de nuevo.');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 py-4 animate-fade-in">
        <span className="material-icons text-4xl text-secondary">check_circle</span>
        <p className="text-primary font-semibold text-lg">{message}</p>
        <p className="text-sm text-accent">Te hemos enviado un email con tu código de descuento.</p>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          className="input-field flex-1"
          placeholder="Tu correo electrónico"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
          required
          disabled={status === 'loading'}
        />
        <button type="submit" className="btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Enviando...' : 'Suscribirme'}
        </button>
      </form>

      {(status === 'error' || status === 'exists') && (
        <p className="mt-3 text-sm text-center text-primary/70">{message}</p>
      )}
    </div>
  );
}
