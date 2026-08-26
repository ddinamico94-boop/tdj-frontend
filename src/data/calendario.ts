import type { EventoCalendario } from '@/types';

// PLACEHOLDER — fechas de ejemplo. NO son las fechas reales de parciales,
// recuperatorios ni clases de la cátedra (punto 32 del brief: no inventar
// datos de la Facultad). Reemplazar desde el panel administrativo con las
// fechas oficiales apenas estén confirmadas.
export const calendario: EventoCalendario[] = [
  {
    id: 'ev-1',
    titulo: 'Primer parcial (fecha de ejemplo)',
    descripcion: 'Fecha de ejemplo — reemplazar por la fecha real del primer parcial.',
    fecha: '2026-10-05',
    tipo: 'parcial',
    publicado: true,
  },
  {
    id: 'ev-2',
    titulo: 'Segundo parcial (fecha de ejemplo)',
    descripcion: 'Fecha de ejemplo — reemplazar por la fecha real del segundo parcial.',
    fecha: '2026-11-16',
    tipo: 'parcial',
    publicado: true,
  },
  {
    id: 'ev-3',
    titulo: 'Recuperatorio (fecha de ejemplo)',
    descripcion: 'Fecha de ejemplo — reemplazar por la fecha real del recuperatorio.',
    fecha: '2026-11-30',
    tipo: 'recuperatorio',
    publicado: true,
  },
];
