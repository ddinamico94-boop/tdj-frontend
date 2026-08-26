// Capa de acceso a datos para el sitio PÚBLICO. Lee todo a través de
// adminService, que decide solo si habla con la API real o con
// localStorage (ver services/adminService.ts) — por eso cualquier cambio
// hecho desde el panel administrativo se refleja acá sin tocar este archivo.

import {
  unidadesResource,
  programaResource,
  bibliografiaResource,
  materialesResource,
  enlacesResource,
  novedadesResource,
  triviasResource,
  menuResource,
  siteConfigResource,
  preguntasParaTrivia,
  calendarioResource,
} from './adminService';
import type { Unidad, Trivia } from '@/types';

export const contentService = {
  async getUnidades() {
    const all = await unidadesResource.getAll();
    return all.filter((u) => u.publicada).sort((a, b) => a.orden - b.orden);
  },
  async getUnidad(id: number): Promise<Unidad | undefined> {
    return unidadesResource.getById(id);
  },
  getPrograma: () => programaResource.get(),
  getBibliografia: () => bibliografiaResource.getAll(),
  getMateriales: () => materialesResource.getAll(),
  async getSitiosImportantes() {
    const all = await enlacesResource.getAll();
    return all.filter((s) => s.activo).sort((a, b) => a.orden - b.orden);
  },
  async getNovedades() {
    const all = await novedadesResource.getAll();
    return all.filter((n) => n.publicada);
  },
  async getMenu() {
    const all = await menuResource.getAll();
    return all.filter((m) => m.visible).sort((a, b) => a.orden - b.orden);
  },
  getSiteConfig: () => siteConfigResource.get(),
  async getTrivias() {
    const all = await triviasResource.getAll();
    return all.filter((t) => t.publicada);
  },
  getPreguntasParaTrivia: (trivia: Trivia) => preguntasParaTrivia(trivia),
  async getCalendario() {
    const all = await calendarioResource.getAll();
    return all.filter((e) => e.publicado).sort((a, b) => a.fecha.localeCompare(b.fecha));
  },
};
