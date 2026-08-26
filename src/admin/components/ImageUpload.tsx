import { useState, type ChangeEvent } from 'react';
import { uploadOrEncode } from '@/services/fileUpload';

interface Props {
  value?: string;
  onChange: (url: string | undefined) => void;
}

// Carga de imagen: sube de verdad al backend cuando está conectado (Fase 6),
// o cae a base64 en modo demo local (Fases 2-3) — ver services/fileUpload.ts.
export default function ImageUpload({ value, onChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError(null);
    setLoading(true);
    try {
      const url = await uploadOrEncode(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la imagen.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt="" className="w-16 h-16 rounded-lg object-cover border border-line" />
        ) : (
          <div className="w-16 h-16 rounded-lg border border-dashed border-line flex items-center justify-center text-ink-soft text-xs">
            {loading ? '...' : 'Sin logo'}
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-cyan cursor-pointer">
            {loading ? 'Subiendo...' : value ? 'Cambiar imagen' : 'Subir imagen'}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={loading} />
          </label>
          {value && !loading && (
            <button type="button" onClick={() => onChange(undefined)} className="text-xs text-red-500 text-left">
              Quitar
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-[11px] text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}
