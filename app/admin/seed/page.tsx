'use client';

import { useState } from 'react';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSeed = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/seed/products', {
        method: 'POST',
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-cream p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8">
          Seed de Productos
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <p className="text-accent mb-4">
            Haz clic en el botón para crear los productos iniciales en Firestore.
          </p>

          <button
            onClick={handleSeed}
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando productos...' : 'Crear Productos en Firestore'}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-primary mb-4">
              Resultado
            </h2>

            {result.error ? (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <p className="text-red-700">{result.error}</p>
              </div>
            ) : (
              <div>
                <p className="text-green-600 font-medium mb-4">
                  ✅ {result.message} - Total: {result.total}
                </p>

                <div className="space-y-2">
                  {result.results?.map((item: any, index: number) => (
                    <div
                      key={index}
                      className={`p-3 rounded ${
                        item.status === 'success'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      <span className="font-medium">{item.name}</span>
                      {item.status === 'error' && (
                        <span className="ml-2 text-sm">- {item.error}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
