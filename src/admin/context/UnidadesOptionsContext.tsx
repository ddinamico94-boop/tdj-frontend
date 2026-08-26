import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { unidadesResource } from '@/services/adminService';
import type { Unidad } from '@/types';

// Antes de esta migración, FormField pedía unidadesResource.getAll() de
// forma síncrona en cada render (funcionaba porque localStorage es
// síncrono). Ahora que adminService es asíncrono en ambos modos (local y
// remoto), la lista de unidades se carga una vez acá y se comparte por
// contexto con todo el panel — evita pedirla de nuevo en cada campo/fila.

const UnidadesOptionsContext = createContext<Unidad[]>([]);

export function UnidadesOptionsProvider({ children }: { children: ReactNode }) {
  const [unidades, setUnidades] = useState<Unidad[]>([]);

  useEffect(() => {
    unidadesResource.getAll().then((list) => {
      setUnidades([...list].sort((a, b) => a.orden - b.orden));
    });
  }, []);

  return <UnidadesOptionsContext.Provider value={unidades}>{children}</UnidadesOptionsContext.Provider>;
}

export function useUnidadesOptions() {
  return useContext(UnidadesOptionsContext);
}
