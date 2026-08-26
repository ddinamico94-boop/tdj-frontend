import type { ReactNode } from 'react';
import RichTextEditor from './RichTextEditor';
import ImageUpload from './ImageUpload';
import FileUpload from './FileUpload';
import { useUnidadesOptions } from '@/admin/context/UnidadesOptionsContext';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'number'
  | 'checkbox'
  | 'select'
  | 'unidadMulti'
  | 'unidadSingle'
  | 'image'
  | 'file'
  | 'stringArray'
  | 'date';

export interface FieldConfig<T> {
  name: keyof T & string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  helper?: string;
  fullWidth?: boolean;
  /** Solo para type: 'file' — restringe qué archivos acepta el input (ej: '.pdf'). */
  accept?: string;
}

interface Props<T> {
  field: FieldConfig<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (value: any) => void;
}

export function FormField<T>({ field, value, onChange }: Props<T>) {
  const unidades = useUnidadesOptions();

  const wrapper = (children: ReactNode) => (
    <div className={field.fullWidth ? 'md:col-span-2' : ''}>
      <label className="block text-xs font-semibold text-ink-soft mb-1.5">
        {field.label}
        {field.required && <span className="text-pink"> *</span>}
      </label>
      {children}
      {field.helper && <p className="text-[11px] text-ink-soft mt-1">{field.helper}</p>}
    </div>
  );

  switch (field.type) {
    case 'text':
      return wrapper(
        <input
          type="text"
          value={value ?? ''}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm outline-none focus:border-cyan"
        />
      );
    case 'date':
      return wrapper(
        <input
          type="date"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm outline-none focus:border-cyan"
        />
      );
    case 'number':
      return wrapper(
        <input
          type="number"
          value={value ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm outline-none focus:border-cyan"
        />
      );
    case 'textarea':
      return wrapper(
        <textarea
          value={value ?? ''}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm outline-none focus:border-cyan resize-y"
        />
      );
    case 'richtext':
      return wrapper(<RichTextEditor value={value ?? ''} onChange={onChange} placeholder={field.placeholder} />);
    case 'checkbox':
      return (
        <label className="flex items-center gap-2 text-sm font-medium py-2.5">
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-cyan" />
          {field.label}
        </label>
      );
    case 'select':
      return wrapper(
        <select
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm outline-none focus:border-cyan bg-white"
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    case 'image':
      return wrapper(<ImageUpload value={value} onChange={onChange} />);
    case 'file':
      return wrapper(<FileUpload value={value} onChange={onChange} accept={field.accept} />);
    case 'unidadSingle':
      return wrapper(
        <select
          value={value ?? ''}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm outline-none focus:border-cyan bg-white"
        >
          <option value="">— Seleccionar unidad —</option>
          {unidades.map((u) => (
            <option key={u.id} value={u.id}>
              {u.numero} · {u.titulo}
            </option>
          ))}
        </select>
      );
    case 'unidadMulti': {
      const selected: number[] = value ?? [];
      function toggle(id: number) {
        onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
      }
      return wrapper(
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-64 overflow-y-auto p-3 border border-line rounded-xl">
          {unidades.map((u) => (
            <label key={u.id} className="flex items-center gap-2 text-[13px] font-medium">
              <input type="checkbox" checked={selected.includes(u.id)} onChange={() => toggle(u.id)} className="w-4 h-4 accent-cyan" />
              {u.numero}
            </label>
          ))}
        </div>
      );
    }
    case 'stringArray': {
      const list: string[] = value ?? [];
      return wrapper(
        <div className="space-y-2">
          {list.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const next = [...list];
                  next[i] = e.target.value;
                  onChange(next);
                }}
                className="flex-1 px-3.5 py-2 rounded-xl border border-line text-sm outline-none focus:border-cyan"
              />
              <button
                type="button"
                onClick={() => onChange(list.filter((_, idx) => idx !== i))}
                className="text-red-500 text-xs font-semibold px-2"
              >
                Quitar
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange([...list, ''])}
            className="text-xs font-semibold text-cyan"
          >
            + Agregar
          </button>
        </div>
      );
    }
    default:
      return null;
  }
}
