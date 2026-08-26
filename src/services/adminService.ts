// adminService centraliza el CRUD de cada entidad del dominio, en modo dual:
//
// - Con VITE_API_URL configurada (backend real conectado): cada operación
//   hace fetch contra tdj-backend.
// - Sin VITE_API_URL: cae al comportamiento de las Fases 2-3 (localStorage),
//   para que el panel siga siendo usable sin backend.
//
// Todas las operaciones son asíncronas en ambos modos, así los componentes
// no necesitan saber cuál de los dos está activo.

import { getList, setList, getObject, setObject, genId } from './storage';
import { apiClient } from './apiClient';
import { unidades as seedUnidades } from '@/data/unidades';
import { programa as seedPrograma } from '@/data/programa';
import { bibliografia as seedBibliografia } from '@/data/bibliografia';
import { materiales as seedMateriales } from '@/data/material';
import { sitiosImportantes as seedEnlaces } from '@/data/enlaces';
import { novedades as seedNovedades } from '@/data/novedades';
import { preguntas as seedPreguntas, trivias as seedTrivias } from '@/data/trivia';
import { menu as seedMenu, siteConfig as seedSiteConfig, configuracionVisual as seedConfigVisual, configuracionSEO as seedConfigSEO } from '@/data/site';
import { calendario as seedCalendario } from '@/data/calendario';
import type {
  Unidad,
  Programa,
  RecursoBibliografico,
  MaterialEstudio,
  EnlaceEditable,
  Novedad,
  Pregunta,
  Trivia,
  ItemMenu,
  SiteConfig,
  ConfiguracionVisual,
  ConfiguracionSEO,
  AdminUser,
  EventoCalendario,
} from '@/types';

const KEYS = {
  unidades: 'unidades',
  programa: 'programa',
  bibliografia: 'bibliografia',
  materiales: 'materiales',
  enlaces: 'enlaces',
  novedades: 'novedades',
  preguntas: 'preguntas',
  trivias: 'trivias',
  menu: 'menu',
  siteConfig: 'siteConfig',
  configVisual: 'configVisual',
  configSEO: 'configSEO',
  adminUsers: 'adminUsers',
  calendario: 'calendario',
} as const;

const seedAdminUsers: AdminUser[] = [
  { id: 'admin-1', nombre: 'Administrador', email: 'admin@catedra.edu.ar', rol: 'superadmin', activo: true },
];

const REMOTE = apiClient.isConfigured();

interface ListResource<T> {
  getAll(): Promise<T[]>;
  getById(id: string | number): Promise<T | undefined>;
  create(item: T): Promise<T>;
  update(id: string | number, patch: Partial<T>): Promise<T | undefined>;
  remove(id: string | number): Promise<void>;
}

interface ObjectResource<T> {
  get(): Promise<T>;
  update(patch: Partial<T>): Promise<T>;
  set(value: T): Promise<void>;
}

/** Fábrica de CRUD para entidades tipo lista. Si se pasa `endpoint` y hay
 * backend conectado, usa la API real; si no, usa localStorage. */
function makeListResource<T extends { id: string | number }>(
  key: string,
  seed: T[],
  endpoint?: string
): ListResource<T> {
  if (REMOTE && endpoint) {
    return {
      getAll: () => apiClient.get<T[]>(endpoint),
      getById: async (id) => {
        try {
          return await apiClient.get<T>(`${endpoint}/${id}`);
        } catch {
          return undefined;
        }
      },
      create: (item) => {
        // El id generado del lado del cliente (Date.now(), genId()) es solo
        // para el modo local — el backend asigna su propio id (autoincrement
        // o cuid) al crear, así que no lo mandamos.
        const { id: _clientId, ...rest } = item as T & { id?: unknown };
        return apiClient.post<T>(endpoint, rest);
      },
      update: (id, patch) => apiClient.put<T>(`${endpoint}/${id}`, patch),
      remove: (id) => apiClient.delete(`${endpoint}/${id}`),
    };
  }

  return {
    async getAll() {
      return getList<T>(key, seed);
    },
    async getById(id) {
      return (await getList<T>(key, seed)).find((item) => item.id === id);
    },
    async create(item) {
      const all = await getList<T>(key, seed);
      setList(key, [...all, item]);
      return item;
    },
    async update(id, patch) {
      const all = await getList<T>(key, seed);
      let updated: T | undefined;
      const next = all.map((item) => {
        if (item.id === id) {
          updated = { ...item, ...patch };
          return updated;
        }
        return item;
      });
      setList(key, next);
      return updated;
    },
    async remove(id) {
      const all = await getList<T>(key, seed);
      setList(
        key,
        all.filter((item) => item.id !== id)
      );
    },
  };
}

function makeObjectResource<T extends object>(key: string, seed: T, endpoint?: string): ObjectResource<T> {
  if (REMOTE && endpoint) {
    return {
      get: () => apiClient.get<T>(endpoint),
      async update(patch) {
        const current = await apiClient.get<T>(endpoint);
        return apiClient.put<T>(endpoint, { ...current, ...patch });
      },
      async set(value) {
        await apiClient.put(endpoint, value);
      },
    };
  }

  return {
    async get() {
      return getObject<T>(key, seed);
    },
    async update(patch) {
      const current = await getObject<T>(key, seed);
      const next = { ...current, ...patch };
      setObject(key, next);
      return next;
    },
    async set(value) {
      setObject(key, value);
    },
  };
}

export const unidadesResource = makeListResource<Unidad>(KEYS.unidades, seedUnidades, '/unidades');
export const bibliografiaResource = makeListResource<RecursoBibliografico>(KEYS.bibliografia, seedBibliografia, '/bibliografia');
export const materialesResource = makeListResource<MaterialEstudio>(KEYS.materiales, seedMateriales, '/materiales');
export const enlacesResource = makeListResource<EnlaceEditable>(KEYS.enlaces, seedEnlaces, '/enlaces');
export const novedadesResource = makeListResource<Novedad>(KEYS.novedades, seedNovedades, '/novedades');
export const preguntasResource = makeListResource<Pregunta>(KEYS.preguntas, seedPreguntas, '/preguntas');
export const triviasResource = makeListResource<Trivia>(KEYS.trivias, seedTrivias, '/trivias');
export const menuResource = makeListResource<ItemMenu>(KEYS.menu, seedMenu, '/menu');
export const calendarioResource = makeListResource<EventoCalendario>(KEYS.calendario, seedCalendario, '/calendario');
// adminUsers NO se enruta a la API acá: la gestión de administradores
// conectada usa endpoints con permisos por rol propios (ver UsuariosAdmin.tsx
// y tdj-backend/src/routes/adminUsers.routes.ts) — esta versión solo cubre
// el modo demo local.
export const adminUsersResource = makeListResource<AdminUser>(KEYS.adminUsers, seedAdminUsers);

export const programaResource = makeObjectResource<Programa>(KEYS.programa, seedPrograma, '/programa');
export const siteConfigResource = makeObjectResource<SiteConfig>(KEYS.siteConfig, seedSiteConfig, '/site-config');
export const configVisualResource = makeObjectResource<ConfiguracionVisual>(KEYS.configVisual, seedConfigVisual, '/config-visual');
export const configSEOResource = makeObjectResource<ConfiguracionSEO>(KEYS.configSEO, seedConfigSEO, '/config-seo');

export { genId };
export const isRemoteContent = REMOTE;

/** Trivia especial: preguntas filtradas por las unidades de esa trivia.
 * En modo remoto usa el endpoint dedicado del backend (más eficiente);
 * en modo local filtra el banco completo de preguntas. */
export async function preguntasParaTrivia(trivia: Trivia): Promise<Pregunta[]> {
  if (REMOTE) {
    return apiClient.get<Pregunta[]>(`/trivias/${trivia.id}/preguntas`);
  }
  const todas = await preguntasResource.getAll();
  return todas.filter((p) => trivia.unidadesIds.includes(p.unidadId));
}
