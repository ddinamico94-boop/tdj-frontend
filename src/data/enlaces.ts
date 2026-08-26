import type { EnlaceEditable } from '@/types';

// PLACEHOLDER — el administrador debe cargar las URLs reales de la Facultad.
// No se inventan URLs oficiales: se dejan en "#" hasta que se configuren desde el panel.
export const sitiosImportantes: EnlaceEditable[] = [
  {
    id: 'sitio-facultad',
    nombre: 'Página oficial de la Facultad',
    descripcion: 'Sitio institucional de la Facultad de Derecho',
    url: '#',
    icono: 'FD',
    categoria: 'institucional',
    orden: 0,
    activo: true,
    abrirEnNuevaPestana: true,
  },
  {
    id: 'sitio-aula-virtual',
    nombre: 'Aula Virtual',
    descripcion: 'Acceder al aula virtual de la cátedra',
    url: '#',
    icono: 'AV',
    categoria: 'academico',
    orden: 1,
    activo: true,
    abrirEnNuevaPestana: true,
  },
  {
    id: 'sitio-sistema-academico',
    nombre: 'Sistema Académico',
    descripcion: 'Gestión de inscripciones y notas',
    url: '#',
    icono: 'SA',
    categoria: 'academico',
    orden: 2,
    activo: true,
    abrirEnNuevaPestana: true,
  },
  {
    id: 'sitio-biblioteca',
    nombre: 'Biblioteca',
    descripcion: 'Catálogo y recursos de biblioteca',
    url: '#',
    icono: 'BI',
    categoria: 'academico',
    orden: 3,
    activo: true,
    abrirEnNuevaPestana: true,
  },
];
