import type { MaterialEstudio, TipoMaterial } from '@/types';
import { unidades } from './unidades';

const tipos: TipoMaterial[] = ['PDF', 'Video', 'Link', 'Audio'];

// PLACEHOLDER — reemplazar desde el panel administrativo.
export const materiales: MaterialEstudio[] = unidades.slice(0, 8).map((u, i) => ({
  id: `m-${i}`,
  titulo: `Material de ejemplo ${i + 1}`,
  tipo: tipos[i % tipos.length],
  descripcion: 'Descripción de ejemplo del material de estudio.',
  unidadesIds: [u.id],
  orden: i,
}));
