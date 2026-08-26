import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { FormField, type FieldConfig } from './FormField';

interface ListResource<T> {
  getAll(): Promise<T[]>;
  create(item: T): Promise<T>;
  update(id: string | number, patch: Partial<T>): Promise<T | undefined>;
  remove(id: string | number): Promise<void>;
}

interface Column<T> {
  header: string;
  render: (item: T) => ReactNode;
}

interface Props<T extends { id: string | number }> {
  title: string;
  description?: string;
  resource: ListResource<T>;
  fields: FieldConfig<T>[];
  columns: Column<T>[];
  /** Recibe la lista actual (para calcular, por ejemplo, el próximo "orden"). */
  emptyItem: (currentItems: T[]) => T;
  searchFn?: (item: T, query: string) => boolean;
  itemLabel?: (item: T) => string;
}

export default function ResourceListPage<T extends { id: string | number }>({
  title,
  description,
  resource,
  fields,
  columns,
  emptyItem,
  searchFn,
  itemLabel,
}: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<T | null>(null);
  const [query, setQuery] = useState('');

  async function refresh() {
    setLoading(true);
    try {
      setItems(await resource.getAll());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar la lista.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openNew() {
    setEditing(emptyItem(items));
  }

  function openEdit(item: T) {
    setEditing({ ...item });
  }

  function closeForm() {
    setEditing(null);
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      const exists = items.some((i) => i.id === editing.id);
      if (exists) await resource.update(editing.id, editing);
      else await resource.create(editing);
      await refresh();
      closeForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar.');
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: T) {
    const label = itemLabel ? itemLabel(item) : String(item.id);
    if (!window.confirm(`¿Eliminar "${label}"? Esta acción no se puede deshacer.`)) return;
    try {
      await resource.remove(item.id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar.');
    }
  }

  const filtered = useMemo(() => {
    if (!query || !searchFn) return items;
    return items.filter((i) => searchFn(i, query.toLowerCase()));
  }, [items, query, searchFn]);

  return (
    <div>
      <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
        <div>
          <h1 className="text-xl font-display font-semibold">{title}</h1>
          {description && <p className="text-ink-soft text-sm mt-1 max-w-[520px]">{description}</p>}
        </div>
        <button onClick={openNew} className="btn btn-grad shrink-0">
          + Nuevo
        </button>
      </div>

      {error && <p className="text-red-600 text-xs mt-3">{error}</p>}

      {searchFn && (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar..."
          className="w-full mt-4 mb-2 px-3.5 py-2.5 rounded-xl border border-line text-sm outline-none focus:border-cyan"
        />
      )}

      <div className="mt-4 bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg border-b border-line text-left">
              {columns.map((c) => (
                <th key={c.header} className="px-4 py-2.5 font-semibold text-xs text-ink-soft">
                  {c.header}
                </th>
              ))}
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-ink-soft text-sm">
                  Cargando...
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-ink-soft text-sm">
                  Sin elementos todavía.
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-0 hover:bg-bg/60">
                  {columns.map((c) => (
                    <td key={c.header} className="px-4 py-3 align-top">
                      {c.render(item)}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(item)} className="text-cyan font-semibold text-xs mr-3">
                      Editar
                    </button>
                    <button onClick={() => remove(item)} className="text-red-500 font-semibold text-xs">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start md:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 my-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold">
                {items.some((i) => i.id === editing.id) ? 'Editar' : 'Nuevo'}
              </h2>
              <button onClick={closeForm} className="text-ink-soft text-xl leading-none">
                ×
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {fields.map((f) => (
                <FormField
                  key={f.name}
                  field={f}
                  value={editing[f.name]}
                  onChange={(v) => setEditing({ ...editing, [f.name]: v })}
                />
              ))}
            </div>
            <div className="flex gap-2.5 mt-6 justify-end">
              <button onClick={closeForm} className="btn btn-outline" disabled={saving}>
                Cancelar
              </button>
              <button onClick={save} className="btn btn-grad disabled:opacity-60" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
