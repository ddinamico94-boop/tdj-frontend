import type { ItemMenu, SiteConfig, ConfiguracionVisual, ConfiguracionSEO } from '@/types';

// PLACEHOLDER — todo este archivo es editable desde el panel administrativo
// (secciones Menú, Footer, Redes sociales, Configuración visual y SEO del brief).

export const menu: ItemMenu[] = [
  { id: 'inicio', label: 'Inicio', to: '/', orden: 0, visible: true },
  { id: 'unidades', label: 'Unidades', to: '/unidades', orden: 1, visible: true },
  { id: 'programa', label: 'Programa', to: '/programa', orden: 2, visible: true },
  { id: 'calendario', label: 'Calendario', to: '/calendario', orden: 3, visible: true },
  { id: 'bibliografia', label: 'Bibliografía', to: '/bibliografia', orden: 4, visible: true },
  { id: 'material', label: 'Material', to: '/material', orden: 5, visible: true },
  { id: 'trivia', label: 'Trivia', to: '/trivia', orden: 6, visible: true },
  { id: 'novedades', label: 'Novedades', to: '/novedades', orden: 7, visible: true },
  { id: 'sitios', label: 'Sitios importantes', to: '/sitios', orden: 8, visible: true },
];

export const siteConfig: SiteConfig = {
  nombre: 'Teoría del Derecho y la Justicia B',
  bienvenida:
    'Todo el contenido de la cátedra — unidades, bibliografía, material de estudio y trivias — en un solo lugar.',
  footerTexto: 'Plataforma académica de la cátedra. Contenido gestionado desde el panel administrativo.',
  redesSociales: [
    { id: 'instagram', plataforma: 'instagram', url: '#', activo: false },
    { id: 'whatsapp', plataforma: 'whatsapp', url: '#', activo: false },
  ],
};

export const configuracionVisual: ConfiguracionVisual = {
  colorPrimario: '#1CDFE8',
  colorSecundario: '#FF8AD1',
  tipografia: 'Space Grotesk / Inter',
};

export const configuracionSEO: ConfiguracionSEO = {
  nombreSitio: 'Teoría del Derecho y la Justicia B',
  tituloSEO: 'Teoría del Derecho y la Justicia B — Plataforma académica',
  descripcion: 'Unidades, programa, bibliografía, material de estudio y trivias de la cátedra.',
};
