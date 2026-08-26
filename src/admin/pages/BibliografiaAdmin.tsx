import ResourceListPage from '@/admin/components/ResourceListPage';
import type { FieldConfig } from '@/admin/components/FormField';
import { bibliografiaResource, genId } from '@/services/adminService';
import { useUnidadesOptions } from '@/admin/context/UnidadesOptionsContext';
import type { RecursoBibliografico } from '@/types';

const fields: FieldConfig<RecursoBibliografico>[] = [
  {
    name: 'tipo',
    label: 'Tipo',
    type: 'select',
    options: [
      { value: 'obligatoria', label: 'Obligatoria' },
      { value: 'complementaria', label: 'Complementaria' },
    ],
    required: true,
  },
  { name: 'unidadId', label: 'Unidad relacionada', type: 'unidadSingle' },
  { name: 'autor', label: 'Autor', type: 'text', required: true },
  { name: 'titulo', label: 'Título', type: 'text', required: true, fullWidth: true },
  { name: 'editorial', label: 'Editorial', type: 'text' },
  { name: 'anio', label: 'Año', type: 'text' },
  { name: 'descripcion', label: 'Descripción', type: 'textarea', fullWidth: true },
  { name: 'imagenUrl', label: 'Imagen de tapa', type: 'image' },
  { name: 'pdfUrl', label: 'Archivo PDF', type: 'file', accept: '.pdf,application/pdf' },
  { name: 'linkExterno', label: 'Link externo', type: 'text' },
  { name: 'orden', label: 'Orden', type: 'number' },
];

export default function BibliografiaAdmin() {
  const unidades = useUnidadesOptions();
  const unidadNombre = (id?: number) => unidades.find((u) => u.id === id)?.titulo ?? '—';

  return (
    <ResourceListPage<RecursoBibliografico>
      title="Bibliografía"
      description="Separada en obligatoria y complementaria. Cada recurso puede asociarse a una unidad."
      resource={bibliografiaResource}
      fields={fields}
      itemLabel={(b) => b.titulo}
      searchFn={(b, q) => (b.titulo + b.autor).toLowerCase().includes(q)}
      columns={[
        {
          header: 'Tipo',
          render: (b) => (
            <span className="badge">{b.tipo === 'obligatoria' ? 'Obligatoria' : 'Complementaria'}</span>
          ),
        },
        { header: 'Título', render: (b) => <span className="font-medium">{b.titulo}</span> },
        { header: 'Autor', render: (b) => b.autor },
        { header: 'Unidad', render: (b) => unidadNombre(b.unidadId) },
      ]}
      emptyItem={(currentItems) => ({
        id: genId('bib'),
        tipo: 'obligatoria',
        autor: '',
        titulo: '',
        editorial: '',
        anio: '',
        descripcion: '',
        orden: currentItems.length,
      })}
    />
  );
}
