import { useEffect, useState } from 'react';
import { siteConfigResource, genId } from '@/services/adminService';
import type { RedSocial, SiteConfig } from '@/types';
import { FormField } from '@/admin/components/FormField';

const PLATAFORMAS: RedSocial['plataforma'][] = ['instagram', 'facebook', 'youtube', 'whatsapp', 'x', 'otra'];

export default function FooterAdmin() {
  const [value, setValue] = useState<SiteConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    siteConfigResource.get().then(setValue);
  }, []);

  async function save() {
    if (!value) return;
    setSaving(true);
    setError(null);
    try {
      await siteConfigResource.set(value);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar.');
    } finally {
      setSaving(false);
    }
  }

  function updateRed(id: string, patch: Partial<RedSocial>) {
    if (!value) return;
    setValue({
      ...value,
      redesSociales: value.redesSociales.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    });
  }

  function addRed() {
    if (!value) return;
    setValue({
      ...value,
      redesSociales: [...value.redesSociales, { id: genId('red'), plataforma: 'instagram', url: '', activo: false }],
    });
  }

  function removeRed(id: string) {
    if (!value) return;
    setValue({ ...value, redesSociales: value.redesSociales.filter((r) => r.id !== id) });
  }

  if (!value) return <p className="text-ink-soft text-sm">Cargando...</p>;

  return (
    <div>
      <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
        <div>
          <h1 className="text-xl font-display font-semibold">Footer y redes sociales</h1>
          <p className="text-ink-soft text-sm mt-1 max-w-[520px]">
            Texto del footer y configuración de redes sociales (activar/desactivar y URL).
          </p>
        </div>
        <button onClick={save} disabled={saving} className="btn btn-grad shrink-0 disabled:opacity-60">
          {saving ? 'Guardando...' : saved ? 'Guardado ✓' : 'Guardar cambios'}
        </button>
      </div>

      {error && <p className="text-red-600 text-xs mt-3">{error}</p>}

      <div className="mt-5 grid md:grid-cols-2 gap-4 bg-white border border-line rounded-2xl p-6 mb-5">
        <FormField field={{ name: 'nombre', label: 'Nombre del sitio', type: 'text' }} value={value.nombre} onChange={(v) => setValue({ ...value, nombre: v })} />
        <FormField field={{ name: 'bienvenida', label: 'Texto de bienvenida (Home)', type: 'textarea', fullWidth: true }} value={value.bienvenida} onChange={(v) => setValue({ ...value, bienvenida: v })} />
        <FormField field={{ name: 'footerTexto', label: 'Texto del footer', type: 'textarea', fullWidth: true }} value={value.footerTexto} onChange={(v) => setValue({ ...value, footerTexto: v })} />
      </div>

      <div className="bg-white border border-line rounded-2xl p-6">
        <h2 className="text-sm font-semibold mb-3">Redes sociales</h2>
        <div className="space-y-3">
          {value.redesSociales.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-2.5 border border-line rounded-xl p-3">
              <select
                value={r.plataforma}
                onChange={(e) => updateRed(r.id, { plataforma: e.target.value as RedSocial['plataforma'] })}
                className="px-2.5 py-2 rounded-lg border border-line text-sm bg-white"
              >
                {PLATAFORMAS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input
                value={r.url}
                onChange={(e) => updateRed(r.id, { url: e.target.value })}
                placeholder="URL"
                className="flex-1 min-w-[160px] px-2.5 py-2 rounded-lg border border-line text-sm"
              />
              <label className="flex items-center gap-1.5 text-xs font-medium">
                <input type="checkbox" checked={r.activo} onChange={(e) => updateRed(r.id, { activo: e.target.checked })} className="accent-cyan" />
                Activo
              </label>
              <button onClick={() => removeRed(r.id)} className="text-red-500 text-xs font-semibold">
                Quitar
              </button>
            </div>
          ))}
        </div>
        <button onClick={addRed} className="text-xs font-semibold text-cyan mt-3">
          + Agregar red social
        </button>
      </div>
    </div>
  );
}
