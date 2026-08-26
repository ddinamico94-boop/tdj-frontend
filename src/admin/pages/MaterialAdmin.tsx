import ResourceListPage from '@/admin/components/ResourceListPage';
import type { FieldConfig } from '@/admin/components/FormField';
import { materialesResource, genId } from '@/services/adminService';
import type { MaterialEstudio } from '@/types';

const fields: FieldConfig<MaterialEstudio>[] = [
  { name: 'titulo', label: 'Título', type: 'text', required: true, fullWidth: true },
  {
    name: 'tipo',
    label: 'Tipo',
    type: 'select',
    options: ['PDF', 'Video', 'Audio', 'Documento', 'Imagen', 'Link'].map((v) => ({ value: v, label: v })),
  },
  { name: 'descripcion', label: 'Descripción', type: 'textarea', fullWidth: true },
  { name: 'archivoUrl', label: 'Archivo (PDF, video o audio)', type: 'file', fullWidth: true },
  { name: 'unidadesIds', label: 'Unidades asociadas', type: 'unidadMulti', fullWidth: true },
  { name: 'orden', label: 'Orden', type: 'number' },
];

export default function MaterialAdmin() {
  return (
    <ResourceListPage<MaterialEstudio>
      title="Material de estudio"
      description="Apuntes, resúmenes, PDFs, videos, audios y links, asociables a una o varias unidades."
      resource={materialesResource}
      fields={fields}
      itemLabel={(m) => m.titulo}
      searchFn={(m, q) => m.titulo.toLowerCase().includes(q)}
      columns={[
        { header: 'Título', render: (m) => <span className="font-medium">{m.titulo}</span> },
        { header: 'Tipo', render: (m) => <span className="badge">{m.tipo}</span> },
        { header: 'Unidades', render: (m) => m.unidadesIds.length },
      ]}
      emptyItem={(currentItems) => ({
        id: genId('mat'),
        titulo: '',
        tipo: 'PDF',
        descripcion: '',
        unidadesIds: [],
        orden: currentItems.length,
      })}
    />
  );
}
