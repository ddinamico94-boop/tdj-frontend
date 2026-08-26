import ResourceListPage from '@/admin/components/ResourceListPage';
import type { FieldConfig } from '@/admin/components/FormField';
import { novedadesResource, genId } from '@/services/adminService';
import type { Novedad } from '@/types';

const fields: FieldConfig<Novedad>[] = [
  { name: 'titulo', label: 'Título', type: 'text', required: true, fullWidth: true },
  { name: 'descripcion', label: 'Descripción', type: 'richtext', fullWidth: true },
  { name: 'fecha', label: 'Fecha', type: 'date', required: true },
  { name: 'imagenUrl', label: 'Imagen', type: 'image' },
  { name: 'link', label: 'Link relacionado', type: 'text' },
  { name: 'archivoUrl', label: 'Archivo adjunto', type: 'file' },
  { name: 'destacada', label: 'Destacada', type: 'checkbox' },
  { name: 'publicada', label: 'Publicada', type: 'checkbox' },
];

export default function NovedadesAdmin() {
  return (
    <ResourceListPage<Novedad>
      title="Novedades"
      description="Anuncios y novedades de la cátedra."
      resource={novedadesResource}
      fields={fields}
      itemLabel={(n) => n.titulo}
      searchFn={(n, q) => n.titulo.toLowerCase().includes(q)}
      columns={[
        { header: 'Título', render: (n) => <span className="font-medium">{n.titulo}</span> },
        { header: 'Fecha', render: (n) => <span className="font-mono text-xs">{n.fecha}</span> },
        { header: 'Destacada', render: (n) => (n.destacada ? '★' : '—') },
        {
          header: 'Estado',
          render: (n) => (
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${n.publicada ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {n.publicada ? 'Publicada' : 'Borrador'}
            </span>
          ),
        },
      ]}
      emptyItem={() => ({
        id: genId('nov'),
        titulo: '',
        descripcion: '',
        fecha: new Date().toISOString().slice(0, 10),
        destacada: false,
        publicada: true,
      })}
    />
  );
}
