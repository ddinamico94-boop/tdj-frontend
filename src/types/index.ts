// Tipos del dominio académico. Estos tipos reflejan las entidades que,
// en la Fase de backend, corresponderán a tablas/documentos reales
// (ver sección "Base de datos" del brief del proyecto).

export interface Unidad {
  id: number;
  numero: string; // identificador estable, ej: "U-01" — no cambia aunque el título sí
  titulo: string; // editable desde el panel (ej: "Unidad 1" -> "Introducción al Derecho")
  descripcion: string;
  introduccion?: string;
  temas: string[];
  publicada: boolean;
  orden: number;
  materialesIds?: string[];
  bibliografiaIds?: string[];
  triviasIds?: string[];
}

export interface Programa {
  titulo: string;
  presentacion: string;
  objetivos: string[];
  pdfUrl?: string | null;
  linksRelacionados?: EnlaceEditable[];
}

export type TipoBibliografia = 'obligatoria' | 'complementaria';

export interface RecursoBibliografico {
  id: string;
  tipo: TipoBibliografia;
  autor: string;
  titulo: string;
  editorial?: string;
  anio?: string;
  descripcion?: string;
  unidadId?: number;
  tema?: string;
  imagenUrl?: string;
  pdfUrl?: string;
  linkExterno?: string;
  orden: number;
}

export type TipoMaterial = 'PDF' | 'Video' | 'Audio' | 'Documento' | 'Imagen' | 'Link';

export interface MaterialEstudio {
  id: string;
  titulo: string;
  tipo: TipoMaterial;
  descripcion?: string;
  unidadesIds: number[];
  archivoUrl?: string;
  orden: number;
}

export interface EnlaceEditable {
  id: string;
  nombre: string;
  descripcion?: string;
  url: string;
  logoUrl?: string;
  icono?: string;
  categoria?: string;
  orden: number;
  activo: boolean;
  abrirEnNuevaPestana: boolean;
}

export interface Novedad {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string; // ISO date
  imagenUrl?: string;
  archivoUrl?: string;
  link?: string;
  destacada: boolean;
  publicada: boolean;
}

export type Dificultad = 'facil' | 'medio' | 'dificil';

export interface Pregunta {
  id: string;
  pregunta: string;
  opciones: string[];
  correcta: number; // índice de la opción correcta
  explicacion?: string;
  unidadId: number;
  tema?: string;
  dificultad: Dificultad;
  imagenUrl?: string;
}

export interface Trivia {
  id: string;
  nombre: string;
  descripcion?: string;
  unidadesIds: number[]; // selección manual de unidades participantes
  cantidadPreguntas: number;
  dificultad?: Dificultad | 'mixta';
  tiempoPorPreguntaSeg: number;
  ordenAleatorio: boolean;
  mostrarExplicacion: boolean;
  mostrarRespuestaCorrecta: boolean;
  publicada: boolean;
}

export interface ResultadoTrivia {
  triviaId: string;
  puntuacion: number;
  totalPreguntas: number;
  correctas: number;
  incorrectas: number;
  porcentaje: number;
  tiempoUtilizadoSeg: number;
}

export interface ItemMenu {
  id: string;
  label: string;
  to: string;
  icono?: string;
  orden: number;
  visible: boolean;
}

export interface ConfiguracionVisual {
  logoUrl?: string;
  faviconUrl?: string;
  colorPrimario: string;
  colorSecundario: string;
  tipografia?: string;
}

export interface ConfiguracionSEO {
  nombreSitio: string;
  tituloSEO: string;
  descripcion: string;
  imagenCompartirUrl?: string;
  faviconUrl?: string;
  autor?: string;
}

export interface RedSocial {
  id: string;
  plataforma: 'instagram' | 'facebook' | 'youtube' | 'whatsapp' | 'x' | 'otra';
  url: string;
  activo: boolean;
}

export interface SiteConfig {
  nombre: string;
  bienvenida: string;
  footerTexto: string;
  redesSociales: RedSocial[];
}

export interface AdminUser {
  id: string;
  nombre: string;
  email: string;
  rol: 'superadmin' | 'admin' | 'editor';
  activo: boolean;
}

// ───────────────────────── Calendario académico ─────────────────────────
// Punto 33 del brief ("Futuras funciones"): calendario, horarios, fechas
// de parciales y recuperatorios.

export type TipoEvento = 'parcial' | 'recuperatorio' | 'clase' | 'entrega' | 'feriado' | 'otro';

export interface EventoCalendario {
  id: string;
  titulo: string;
  descripcion?: string;
  fecha: string; // ISO date (YYYY-MM-DD)
  fechaFin?: string; // opcional, para eventos de más de un día
  tipo: TipoEvento;
  unidadId?: number;
  publicado: boolean;
}
