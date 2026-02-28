'use client';

import { useState, useEffect } from 'react';

interface EmailSettingsForm {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  smtpFrom: string;
  smtpFromName: string;
  isActive: boolean;
}

const defaultForm: EmailSettingsForm = {
  smtpHost: '',
  smtpPort: '587',
  smtpUser: '',
  smtpPass: '',
  smtpFrom: '',
  smtpFromName: 'K-Beauty Colombia',
  isActive: false,
};

export default function ConfiguracionPage() {
  const [form, setForm] = useState<EmailSettingsForm>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings/email')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          setForm({
            smtpHost: data.settings.smtpHost || '',
            smtpPort: String(data.settings.smtpPort || 587),
            smtpUser: data.settings.smtpUser || '',
            smtpPass: data.settings.smtpPass || '',
            smtpFrom: data.settings.smtpFrom || '',
            smtpFromName: data.settings.smtpFromName || 'K-Beauty Colombia',
            isActive: data.settings.isActive ?? false,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function setField(key: keyof EmailSettingsForm, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/settings/email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Configuración guardada correctamente' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al guardar' });
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    if (!testEmail) return;
    setTesting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/settings/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: `Correo de prueba enviado a ${testEmail}` });
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al enviar correo de prueba' });
      }
    } finally {
      setTesting(false);
    }
  }

  if (loading) {
    return <div className="py-20 text-center text-gray-400">Cargando configuración...</div>;
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-sm text-gray-500 mt-1">Configura el servidor SMTP para el envío automático de correos</p>
      </div>

      {message && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          <span className="material-icons text-sm">
            {message.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {/* Estado */}
        <div className="px-6 py-5 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">Envío de correos activo</p>
            <p className="text-sm text-gray-500">Al activar, se enviarán emails automáticos a nuevos suscriptores</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setField('isActive', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-300 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
          </label>
        </div>

        {/* Servidor SMTP */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Servidor SMTP</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
              <input
                type="text"
                value={form.smtpHost}
                onChange={(e) => setField('smtpHost', e.target.value)}
                placeholder="smtp.gmail.com"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Puerto</label>
              <input
                type="number"
                value={form.smtpPort}
                onChange={(e) => setField('smtpPort', e.target.value)}
                placeholder="587"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input
              type="email"
              value={form.smtpUser}
              onChange={(e) => setField('smtpUser', e.target.value)}
              placeholder="correo@tudominio.com"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={form.smtpPass}
              onChange={(e) => setField('smtpPass', e.target.value)}
              placeholder="Contraseña o App Password"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            />
          </div>
        </div>

        {/* Remitente */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Remitente</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del remitente</label>
            <input
              type="text"
              value={form.smtpFromName}
              onChange={(e) => setField('smtpFromName', e.target.value)}
              placeholder="K-Beauty Colombia"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email del remitente</label>
            <input
              type="email"
              value={form.smtpFrom}
              onChange={(e) => setField('smtpFrom', e.target.value)}
              placeholder="hola@tudominio.com"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            />
          </div>
        </div>

        {/* Botón guardar */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            <span className="material-icons text-sm">{saving ? 'hourglass_empty' : 'save'}</span>
            {saving ? 'Guardando...' : 'Guardar configuración'}
          </button>
        </div>
      </form>

      {/* Correo de prueba */}
      <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
        <p className="font-semibold text-gray-900 mb-1">Enviar correo de prueba</p>
        <p className="text-sm text-gray-500 mb-4">Verifica que la configuración SMTP funcione correctamente</p>
        <div className="flex gap-3">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="tu@correo.com"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
          />
          <button
            onClick={handleTest}
            disabled={testing || !testEmail}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <span className="material-icons text-sm">{testing ? 'hourglass_empty' : 'send'}</span>
            {testing ? 'Enviando...' : 'Probar'}
          </button>
        </div>
      </div>

      {/* Info proveedores */}
      <div className="bg-blue-50 rounded-xl p-5 text-sm text-blue-800">
        <p className="font-semibold mb-2 flex items-center gap-1">
          <span className="material-icons text-sm">info</span>
          Proveedores recomendados
        </p>
        <ul className="space-y-1 text-blue-700">
          <li><strong>Gmail:</strong> smtp.gmail.com · Puerto 587 · Usa una "App Password"</li>
          <li><strong>Outlook:</strong> smtp-mail.outlook.com · Puerto 587</li>
          <li><strong>Brevo (Sendinblue):</strong> smtp-relay.brevo.com · Puerto 587 · Gratis hasta 300/día</li>
        </ul>
      </div>
    </div>
  );
}
