import ResourceListPage from '@/admin/components/ResourceListPage';
import type { FieldConfig } from '@/admin/components/FormField';
import { enlacesResource, genId } from '@/services/adminService';
import type { EnlaceEditable } from '@/types';

const fields: FieldConfig<EnlaceEditable>[] = [
  { name: 'nombre', label: 'Nombre', type: 'text', required: true },
  { name: 'categoria', label: 'Categoría', type: 'text', placeholder: 'institucional, académico...' },
  { name: 'descripcion', label: 'Descripción', type: 'textarea', fullWidth: true },
  { name: 'url', label: 'URL', type: 'text', required: true, fullWidth: true, helper: 'Cargar la URL real de la Facultad.' },
  { name: 'logoUrl', label: 'Logo', type: 'image' },
  { name: 'orden', label: 'Orden', type: 'number' },
  { name: 'activo', label: 'Activo (visible en el sitio)', type: 'checkbox' },
  { name: 'abrirEnNuevaPestana', label: 'Abrir en nueva pestaña', type: 'checkbox' },
];

export default function EnlacesAdmin() {
  return (
    <ResourceListPage<EnlaceEditable>
      title="Sitios importantes / enlaces"
      description="Página oficial, aula virtual, sistema académico, biblioteca y cualquier otro enlace de la Facultad. No se inventan URLs: cargalas acá."
      resource={enlacesResource}
      fields={fields}
      itemLabel={(e) => e.nombre}
      searchFn={(e, q) => e.nombre.toLowerCase().includes(q)}
      columns={[
        {
          header: 'Logo',
          render: (e) =>
            e.logoUrl ? (
              <img src={e.logoUrl} className="w-8 h-8 rounded-md object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-md bg-brand-gradient" />
            ),
        },
        { header: 'Nombre', render: (e) => <span className="font-medium">{e.nombre}</span> },
        { header: 'URL', render: (e) => <span className="text-xs text-ink-soft truncate block max-w-[180px]">{e.url}</span> },
        {
          header: 'Estado',
          render: (e) => (
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${e.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {e.activo ? 'Activo' : 'Inactivo'}
            </span>
          ),
        },
      ]}
      emptyItem={(currentItems) => ({
        id: genId('enlace'),
        nombre: '',
        url: '',
        orden: currentItems.length,
        activo: true,
        abrirEnNuevaPestana: true,
      })}
    />
  );
}
