import ResourceListPage from '@/admin/components/ResourceListPage';
import type { FieldConfig } from '@/admin/components/FormField';
import { unidadesResource, genId } from '@/services/adminService';
import type { Unidad } from '@/types';

const fields: FieldConfig<Unidad>[] = [
  { name: 'numero', label: 'Identificador (no cambia)', type: 'text', required: true },
  { name: 'titulo', label: 'Nombre visible de la unidad', type: 'text', required: true, fullWidth: true },
  { name: 'descripcion', label: 'Descripción corta', type: 'textarea', fullWidth: true },
  { name: 'introduccion', label: 'Introducción / contenido extenso', type: 'richtext', fullWidth: true },
  { name: 'temas', label: 'Temas', type: 'stringArray', fullWidth: true },
  { name: 'orden', label: 'Orden', type: 'number' },
  { name: 'publicada', label: 'Publicada (visible en el sitio)', type: 'checkbox' },
];

export default function UnidadesAdmin() {
  return (
    <ResourceListPage<Unidad>
      title="Unidades"
      description="Las 14 unidades existen siempre — el número (U-01, U-02...) es el identificador estable, pero el nombre visible y todo el contenido son completamente editables."
      resource={unidadesResource}
      fields={fields}
      itemLabel={(u) => u.titulo}
      searchFn={(u, q) => u.titulo.toLowerCase().includes(q) || u.numero.toLowerCase().includes(q)}
      columns={[
        { header: 'N°', render: (u) => <span className="font-mono text-xs font-semibold">{u.numero}</span> },
        { header: 'Título', render: (u) => <span className="font-medium">{u.titulo}</span> },
        {
          header: 'Estado',
          render: (u) => (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                u.publicada ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {u.publicada ? 'Publicada' : 'Oculta'}
            </span>
          ),
        },
      ]}
      emptyItem={(currentItems) => ({
        id: Date.now(),
        numero: `U-${genId('').replace('-', '').slice(0, 3)}`,
        titulo: 'Nueva unidad',
        descripcion: '',
        introduccion: '',
        temas: [],
        publicada: true,
        orden: currentItems.length + 1,
      })}
    />
  );
}
