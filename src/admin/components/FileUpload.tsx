import { useState, type ChangeEvent } from 'react';
import { uploadOrEncode } from '@/services/fileUpload';

interface Props {
  value?: string;
  onChange: (url: string | undefined) => void;
  accept?: string;
}

// Carga de archivos genéricos (PDF, video, audio) — mismo mecanismo que
// ImageUpload pero sin previsualización de imagen. Ver services/fileUpload.ts.
export default function FileUpload({ value, onChange, accept = '.pdf,video/*,audio/*' }: Props) {
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
      setError(err instanceof Error ? err.message : 'No se pudo subir el archivo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2.5">
        <label className="text-xs font-semibold text-cyan cursor-pointer border border-line rounded-lg px-3 py-2 hover:border-cyan">
          {loading ? 'Subiendo...' : value ? 'Cambiar archivo' : '📎 Subir archivo'}
          <input type="file" accept={accept} className="hidden" onChange={handleFile} disabled={loading} />
        </label>
        {value && !loading && (
          <>
            <a href={value} target="_blank" rel="noreferrer" className="text-xs text-ink-soft underline truncate max-w-[160px]">
              Ver archivo
            </a>
            <button type="button" onClick={() => onChange(undefined)} className="text-xs text-red-500">
              Quitar
            </button>
          </>
        )}
      </div>
      {error && <p className="text-[11px] text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}
