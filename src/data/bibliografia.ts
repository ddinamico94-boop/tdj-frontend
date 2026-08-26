import type { RecursoBibliografico } from '@/types';
import { unidades } from './unidades';

// PLACEHOLDER — reemplazar desde el panel administrativo.
export const bibliografia: RecursoBibliografico[] = [
  ...unidades.slice(0, 6).map((u, i): RecursoBibliografico => ({
    id: `ob-${i}`,
    tipo: 'obligatoria',
    autor: `Autor de ejemplo ${i + 1}`,
    titulo: `Título bibliográfico de ejemplo ${i + 1}`,
    editorial: 'Editorial de ejemplo',
    anio: '2020',
    descripcion: 'Descripción de ejemplo del material bibliográfico obligatorio.',
    unidadId: u.id,
    orden: i,
  })),
  ...unidades.slice(0, 4).map((u, i): RecursoBibliografico => ({
    id: `co-${i}`,
    tipo: 'complementaria',
    autor: `Autor de ejemplo ${i + 1}`,
    titulo: `Título bibliográfico complementario de ejemplo ${i + 1}`,
    editorial: 'Editorial de ejemplo',
    anio: '2019',
    descripcion: 'Descripción de ejemplo del material bibliográfico complementario.',
    unidadId: u.id,
    orden: i,
  })),
];
