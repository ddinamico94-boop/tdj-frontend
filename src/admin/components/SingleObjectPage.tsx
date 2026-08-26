import { useEffect, useState } from 'react';
import { FormField, type FieldConfig } from './FormField';

interface ObjectResource<T> {
  get(): Promise<T>;
  set(value: T): Promise<void>;
}

interface Props<T> {
  title: string;
  description?: string;
  resource: ObjectResource<T>;
  fields: FieldConfig<T>[];
}

export default function SingleObjectPage<T extends object>({ title, description, resource, fields }: Props<T>) {
  const [value, setValue] = useState<T | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    resource.get().then(setValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    if (!value) return;
    setSaving(true);
    setError(null);
    try {
      await resource.set(value);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
        <div>
          <h1 className="text-xl font-display font-semibold">{title}</h1>
          {description && <p className="text-ink-soft text-sm mt-1 max-w-[520px]">{description}</p>}
        </div>
        <button onClick={save} disabled={saving || !value} className="btn btn-grad shrink-0 disabled:opacity-60">
          {saving ? 'Guardando...' : saved ? 'Guardado ✓' : 'Guardar cambios'}
        </button>
      </div>

      {error && <p className="text-red-600 text-xs mt-3">{error}</p>}

      {!value ? (
        <p className="text-ink-soft text-sm mt-6">Cargando...</p>
      ) : (
        <div className="mt-5 grid md:grid-cols-2 gap-4 bg-white border border-line rounded-2xl p-6">
          {fields.map((f) => (
            <FormField
              key={f.name}
              field={f}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              value={(value as any)[f.name]}
              onChange={(v) => setValue({ ...value, [f.name]: v })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
