import type { Unidad } from '@/types';

// PLACEHOLDER — reemplazar desde el panel administrativo (Fase 2) o desde la API real (Fase 4).
// No se inventan títulos académicos reales: por defecto cada unidad se llama "Unidad N"
// tal como pide el brief, hasta que la cátedra cargue el nombre definitivo.
export const unidades: Unidad[] = Array.from({ length: 14 }, (_, i) => {
  const n = i + 1;
  return {
    id: n,
    numero: `U-${String(n).padStart(2, '0')}`,
    titulo: `Unidad ${n}`,
    descripcion: `Descripción de ejemplo de la Unidad ${n}. Este texto es un placeholder y debe reemplazarse desde el panel administrativo con el contenido real de la cátedra.`,
    introduccion: '',
    temas: ['Tema de ejemplo 1', 'Tema de ejemplo 2', 'Tema de ejemplo 3'],
    publicada: true,
    orden: n,
    materialesIds: [],
    bibliografiaIds: [],
    triviasIds: [],
  };
});
