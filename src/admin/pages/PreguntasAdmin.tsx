import ResourceListPage from '@/admin/components/ResourceListPage';
import type { FieldConfig } from '@/admin/components/FormField';
import { preguntasResource, genId } from '@/services/adminService';
import { useUnidadesOptions } from '@/admin/context/UnidadesOptionsContext';
import type { Pregunta } from '@/types';

const fields: FieldConfig<Pregunta>[] = [
  { name: 'unidadId', label: 'Unidad', type: 'unidadSingle', required: true },
  {
    name: 'dificultad',
    label: 'Dificultad',
    type: 'select',
    options: [
      { value: 'facil', label: 'Fácil' },
      { value: 'medio', label: 'Medio' },
      { value: 'dificil', label: 'Difícil' },
    ],
  },
  { name: 'pregunta', label: 'Pregunta', type: 'textarea', required: true, fullWidth: true },
  { name: 'opciones', label: 'Opciones (4)', type: 'stringArray', fullWidth: true },
  {
    name: 'correcta',
    label: 'Índice de la opción correcta (0 a 3)',
    type: 'number',
    helper: '0 = primera opción, 1 = segunda, etc.',
  },
  { name: 'explicacion', label: 'Explicación', type: 'textarea', fullWidth: true },
  { name: 'imagenUrl', label: 'Imagen (opcional)', type: 'image' },
];

export default function PreguntasAdmin() {
  const unidades = useUnidadesOptions();
  const unidadNombre = (id: number) => unidades.find((u) => u.id === id)?.titulo ?? '—';

  return (
    <ResourceListPage<Pregunta>
      title="Banco de preguntas"
      description="Cada pregunta pertenece a una única unidad. Las trivias sólo pueden usar preguntas de las unidades que el administrador seleccione para ellas."
      resource={preguntasResource}
      fields={fields}
      itemLabel={(p) => p.pregunta}
      searchFn={(p, q) => p.pregunta.toLowerCase().includes(q)}
      columns={[
        { header: 'Pregunta', render: (p) => <span className="line-clamp-2 max-w-[240px] block">{p.pregunta}</span> },
        { header: 'Unidad', render: (p) => unidadNombre(p.unidadId) },
        { header: 'Dificultad', render: (p) => <span className="badge">{p.dificultad}</span> },
      ]}
      emptyItem={() => ({
        id: genId('preg'),
        pregunta: '',
        opciones: ['', '', '', ''],
        correcta: 0,
        explicacion: '',
        unidadId: unidades[0]?.id ?? 1,
        dificultad: 'medio',
      })}
    />
  );
}
