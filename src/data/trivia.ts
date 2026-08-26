import type { Pregunta, Trivia, Dificultad } from '@/types';
import { unidades } from './unidades';

const dificultades: Dificultad[] = ['facil', 'medio', 'dificil'];

// PLACEHOLDER — banco de preguntas de ejemplo. NO es contenido académico real:
// reemplazar desde el panel administrativo (sección "Preguntas").
// Cada pregunta queda asociada a una unidad (regla del punto 17 del brief),
// de forma que una trivia solo puede usar preguntas de las unidades seleccionadas.
export const preguntas: Pregunta[] = unidades.flatMap((u) =>
  Array.from({ length: 4 }, (_, q) => ({
    id: `${u.id}-${q + 1}`,
    unidadId: u.id,
    dificultad: dificultades[q % dificultades.length],
    pregunta: `Pregunta de ejemplo ${q + 1} — ${u.titulo}. (placeholder, reemplazar desde el banco de preguntas)`,
    opciones: ['Opción de ejemplo A', 'Opción de ejemplo B', 'Opción de ejemplo C', 'Opción de ejemplo D'],
    correcta: (q + 1) % 4,
    explicacion: 'Explicación de ejemplo de por qué esta es la respuesta correcta. Editable desde el panel.',
  }))
);

// Selección manual de unidades por trivia (punto 16 del brief): el admin
// elige libremente cualquier combinación de las 14 unidades por trivia.
export const trivias: Trivia[] = [
  {
    id: 'general',
    nombre: 'Trivia General',
    descripcion: 'Incluye las 14 unidades de la materia.',
    unidadesIds: unidades.map((u) => u.id),
    cantidadPreguntas: 10,
    dificultad: 'mixta',
    tiempoPorPreguntaSeg: 20,
    ordenAleatorio: true,
    mostrarExplicacion: true,
    mostrarRespuestaCorrecta: true,
    publicada: true,
  },
  {
    id: 'parcial1',
    nombre: 'Trivia Primer Parcial',
    descripcion: 'Unidades 1 a 3.',
    unidadesIds: [1, 2, 3],
    cantidadPreguntas: 8,
    dificultad: 'mixta',
    tiempoPorPreguntaSeg: 20,
    ordenAleatorio: true,
    mostrarExplicacion: true,
    mostrarRespuestaCorrecta: true,
    publicada: true,
  },
  {
    id: 'u7',
    nombre: 'Trivia Unidad 7',
    descripcion: 'Solamente Unidad 7.',
    unidadesIds: [7],
    cantidadPreguntas: 4,
    dificultad: 'mixta',
    tiempoPorPreguntaSeg: 20,
    ordenAleatorio: true,
    mostrarExplicacion: true,
    mostrarRespuestaCorrecta: true,
    publicada: true,
  },
];

/** Devuelve el pool de preguntas válido para una trivia, respetando la
 * regla de que solo pueden participar preguntas de las unidades seleccionadas. */
export function preguntasParaTrivia(trivia: Trivia): Pregunta[] {
  return preguntas.filter((p) => trivia.unidadesIds.includes(p.unidadId));
}
