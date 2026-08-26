import ResourceListPage from '@/admin/components/ResourceListPage';
import type { FieldConfig } from '@/admin/components/FormField';
import { calendarioResource, genId } from '@/services/adminService';
import type { EventoCalendario } from '@/types';

const fields: FieldConfig<EventoCalendario>[] = [
  { name: 'titulo', label: 'Título', type: 'text', required: true, fullWidth: true },
  {
    name: 'tipo',
    label: 'Tipo',
    type: 'select',
    options: [
      { value: 'parcial', label: 'Parcial' },
      { value: 'recuperatorio', label: 'Recuperatorio' },
      { value: 'clase', label: 'Clase' },
      { value: 'entrega', label: 'Entrega' },
      { value: 'feriado', label: 'Feriado' },
      { value: 'otro', label: 'Otro' },
    ],
  },
  { name: 'fecha', label: 'Fecha', type: 'date', required: true },
  { name: 'fechaFin', label: 'Fecha de fin (opcional, para eventos de varios días)', type: 'date' },
  { name: 'unidadId', label: 'Unidad relacionada (opcional)', type: 'unidadSingle' },
  { name: 'descripcion', label: 'Descripción', type: 'textarea', fullWidth: true },
  { name: 'publicado', label: 'Publicado (visible en el sitio)', type: 'checkbox' },
];

export default function CalendarioAdmin() {
  return (
    <ResourceListPage<EventoCalendario>
      title="Calendario académico"
      description="Fechas de parciales, recuperatorios, clases especiales y otros eventos de la cátedra."
      resource={calendarioResource}
      fields={fields}
      itemLabel={(e) => e.titulo}
      searchFn={(e, q) => e.titulo.toLowerCase().includes(q)}
      columns={[
        { header: 'Título', render: (e) => <span className="font-medium">{e.titulo}</span> },
        { header: 'Tipo', render: (e) => <span className="badge">{e.tipo}</span> },
        { header: 'Fecha', render: (e) => <span className="font-mono text-xs">{e.fecha}</span> },
        {
          header: 'Estado',
          render: (e) => (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                e.publicado ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {e.publicado ? 'Publicado' : 'Oculto'}
            </span>
          ),
        },
      ]}
      emptyItem={() => ({
        id: genId('ev'),
        titulo: '',
        descripcion: '',
        fecha: new Date().toISOString().slice(0, 10),
        tipo: 'otro',
        publicado: true,
      })}
    />
  );
}
