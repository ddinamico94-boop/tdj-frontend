import type { Novedad } from '@/types';

// PLACEHOLDER — reemplazar desde el panel administrativo.
export const novedades: Novedad[] = [
  {
    id: '1',
    titulo: 'Novedad de ejemplo 1',
    descripcion: 'Descripción de ejemplo de una novedad publicada por la cátedra.',
    fecha: '2026-08-10',
    destacada: true,
    publicada: true,
  },
  {
    id: '2',
    titulo: 'Novedad de ejemplo 2',
    descripcion: 'Descripción de ejemplo de otra novedad de la cátedra.',
    fecha: '2026-08-05',
    destacada: false,
    publicada: true,
  },
  {
    id: '3',
    titulo: 'Novedad de ejemplo 3',
    descripcion: 'Descripción de ejemplo de una tercera novedad.',
    fecha: '2026-07-28',
    destacada: false,
    publicada: true,
  },
];
