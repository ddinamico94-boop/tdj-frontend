import { useEffect, useState } from 'react';
import ResourceListPage from '@/admin/components/ResourceListPage';
import type { FieldConfig } from '@/admin/components/FormField';
import { triviasResource, preguntasResource, genId } from '@/services/adminService';
import type { Trivia, Pregunta } from '@/types';

const fields: FieldConfig<Trivia>[] = [
  { name: 'nombre', label: 'Nombre de la trivia', type: 'text', required: true, fullWidth: true },
  { name: 'descripcion', label: 'Descripción', type: 'textarea', fullWidth: true },
  {
    name: 'unidadesIds',
    label: 'Unidades participantes (selección manual)',
    type: 'unidadMulti',
    fullWidth: true,
    helper: 'Elegí cualquier combinación de las 14 unidades. Solo se usarán preguntas de estas unidades.',
  },
  { name: 'cantidadPreguntas', label: 'Cantidad de preguntas', type: 'number' },
  { name: 'tiempoPorPreguntaSeg', label: 'Tiempo por pregunta (seg)', type: 'number' },
  {
    name: 'dificultad',
    label: 'Dificultad',
    type: 'select',
    options: [
      { value: 'mixta', label: 'Mixta' },
      { value: 'facil', label: 'Fácil' },
      { value: 'medio', label: 'Medio' },
      { value: 'dificil', label: 'Difícil' },
    ],
  },
  { name: 'ordenAleatorio', label: 'Orden aleatorio', type: 'checkbox' },
  { name: 'mostrarExplicacion', label: 'Mostrar explicación', type: 'checkbox' },
  { name: 'mostrarRespuestaCorrecta', label: 'Mostrar respuesta correcta', type: 'checkbox' },
  { name: 'publicada', label: 'Publicada', type: 'checkbox' },
];

export default function TriviasAdmin() {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);

  useEffect(() => {
    preguntasResource.getAll().then(setPreguntas);
  }, []);

  const preguntasDisponibles = (t: Trivia) => preguntas.filter((p) => t.unidadesIds.includes(p.unidadId)).length;

  return (
    <ResourceListPage<Trivia>
      title="Trivias"
      description="Cada trivia se arma eligiendo manualmente qué unidades participan — desde una sola unidad hasta las 14, en cualquier combinación."
      resource={triviasResource}
      fields={fields}
      itemLabel={(t) => t.nombre}
      searchFn={(t, q) => t.nombre.toLowerCase().includes(q)}
      columns={[
        { header: 'Nombre', render: (t) => <span className="font-medium">{t.nombre}</span> },
        { header: 'Unidades', render: (t) => t.unidadesIds.length },
        { header: 'Preguntas disponibles', render: (t) => preguntasDisponibles(t) },
        {
          header: 'Estado',
          render: (t) => (
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${t.publicada ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {t.publicada ? 'Publicada' : 'Oculta'}
            </span>
          ),
        },
      ]}
      emptyItem={() => ({
        id: genId('trivia'),
        nombre: '',
        descripcion: '',
        unidadesIds: [],
        cantidadPreguntas: 10,
        dificultad: 'mixta',
        tiempoPorPreguntaSeg: 20,
        ordenAleatorio: true,
        mostrarExplicacion: true,
        mostrarRespuestaCorrecta: true,
        publicada: true,
      })}
    />
  );
}
