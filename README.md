# Teoría del Derecho y la Justicia B — Plataforma académica

Fase 1: frontend público completo, con datos de ejemplo (placeholder) separados
de los componentes, listo para conectar un panel administrativo (Fase 2) y
luego un backend real (Fase 4).

## Stack

- React 19 + Vite + TypeScript
- Tailwind CSS (paleta e identidad visual definidas en `tailwind.config.js`)
- React Router

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

Abrí http://localhost:5173

## Arquitectura

```
src/
  components/   Componentes reutilizables (Navbar, Footer, cards, etc.)
  pages/        Páginas públicas (una por ruta)
  layouts/      Layout público (PublicLayout)
  admin/        Panel administrativo (Fase 2 — ver admin/README.md)
  services/     Capa de acceso a datos (contentService) — hoy lee de /data,
                mañana hace fetch() a la API real sin cambiar componentes
  hooks/        Lógica reutilizable (ej: useTriviaEngine)
  types/        Tipos TypeScript de todas las entidades del dominio
  data/         Datos de ejemplo/placeholder — NO contenido académico real
  styles/       CSS global + directivas de Tailwind
```

## Regla de contenido

Todo el contenido visible en `src/data/*.ts` es de ejemplo y está marcado
como placeholder. Nada de esto debe tomarse como contenido académico real
(nombres de unidades, bibliografía, preguntas de trivia, URLs de la
Facultad). Se reemplaza desde el panel administrativo en la Fase 2, o
directamente en base de datos en la Fase 4.

## Panel administrativo (Fase 2)

Accedé en `/admin` (te redirige a `/admin/login` si no iniciaste sesión).

Credenciales de demo:
- Email: `admin@catedra.edu.ar`
- Contraseña: `catedra2026`

Todo lo que se edita desde el panel se guarda en `localStorage` y se refleja
de inmediato en el sitio público, porque ambos leen a través de
`src/services/adminService.ts`. Incluye:

- CRUD completo de Unidades, Bibliografía, Material, Novedades, Sitios/enlaces,
  Banco de preguntas, Trivias (con selección manual de unidades participantes)
  y Menú.
- Formularios de configuración única: Programa, Footer y redes sociales,
  Configuración visual, SEO.
- Gestión de administradores (registros; el login real contra backend llega
  en la Fase 5).
- Editor de contenido enriquecido propio (negrita, cursiva, subrayado,
  títulos, subtítulos, listas con viñetas y numeradas, citas, tablas,
  links, imágenes inline, videos embebidos de YouTube/Vimeo, separadores,
  bloques destacados, alineación y tamaño de texto) sin dependencias
  externas.
- Carga de imágenes como base64 (suficiente para maquetar el flujo; se
  reemplaza por almacenamiento de archivos real en la Fase 6).

**Importante:** localStorage tiene un límite de ~5MB. Es perfecto para probar
el flujo completo, pero al subir muchas imágenes puede llenarse — la Fase 4
(backend + base de datos real) y la Fase 6 (carga de archivos real) resuelven
esto de raíz.

## Próximas fases

1. ~~Frontend público con datos de ejemplo~~ (Fase 1)
2. ~~Panel administrativo (CRUD completo sobre localStorage)~~ (Fase 2)
3. ~~Editor de contenido enriquecido completo~~ (Fase 3)
4. ~~Backend real: Node + Express + TypeScript + Prisma + PostgreSQL~~ (Fase 4 —
   proyecto `tdj-backend/` aparte, con su propio README.)
5. ~~Autenticación y roles de administradores~~ (Fase 5 — esta entrega: login
   real con JWT contra el backend, roles superadmin/admin/editor, cambio de
   contraseña propia en "Mi cuenta", y gestión de administradores con
   contraseñas reales cuando `VITE_API_URL` está configurada. Sin backend
   conectado, el panel sigue funcionando en modo demo local, sin romper nada
   de lo ya construido.)
6. ~~Carga de archivos (imágenes, PDFs, videos) a almacenamiento real~~ (Fase 6 —
   con `VITE_API_URL` configurada, todas las imágenes y archivos del panel
   (logos de enlaces, portadas de bibliografía, PDFs, material, novedades,
   imágenes insertadas en el editor de contenido) se suben de verdad al
   backend y quedan en `/uploads`. Sin backend conectado, sigue el fallback
   a base64 de las fases anteriores.)
7. ~~Deploy: Render (backend) + Vercel (frontend)~~ (Fase 7 — ver `DEPLOY.md`
   en este proyecto y en `tdj-backend/DEPLOY.md` para la guía completa paso a
   paso, con orden recomendado, variables de entorno y checklist final.)

## Descarga de PDFs y renderizado del editor enriquecido

Se cerró un vacío importante: los campos de archivo (PDF del programa,
PDF de bibliografía, archivo de material, adjunto de novedades) ya se
podían **subir** desde el panel desde la Fase 6, pero el sitio público no
mostraba el link para que el alumno los vea o descargue. Ahora sí:

- **Programa**: botón "Descargar programa (PDF)" si hay `pdfUrl` cargado.
- **Bibliografía** (listado y dentro de cada Unidad): link "Descargar PDF".
- **Material de estudio** (listado y dentro de cada Unidad): link "Descargar".
- **Novedades**: link "Descargar adjunto" si hay `archivoUrl`.
- Los campos de PDF de Programa y Bibliografía ahora solo aceptan `.pdf`
  (Material y Novedades siguen aceptando también video/audio, como
  corresponde a esos tipos de contenido).

De paso se corrigió que el contenido creado con el **editor enriquecido**
(Unidad → Introducción, Programa → Presentación, Novedad → Descripción) no
se estaba renderizando como texto formateado en el sitio público — en el
caso de Unidad, directamente no se mostraba. Ahora se renderiza con estilos
propios (`.prose-content` en `src/styles/index.css`) que soportan todo lo
que permite el editor: títulos, citas, tablas, imágenes, videos embebidos y
bloques destacados.

Con la migración del CRUD de contenido (más abajo), las 7 fases del roadmap
original están completas: frontend público, panel administrativo, editor
enriquecido, backend real, autenticación con roles, carga de archivos y
deploy — todo conectado de punta a punta cuando `VITE_API_URL` está
configurada, y con un modo demo local que sigue funcionando sin backend.

## Fase 8 — Calendario académico

Primera de las "futuras funciones" del brief original (punto 33). Nueva
entidad `EventoCalendario` (título, descripción, fecha, fecha de fin
opcional, tipo — parcial/recuperatorio/clase/entrega/feriado/otro, unidad
relacionada opcional, publicado). Sigue el mismo patrón dual que el resto
del contenido: CRUD completo en `/admin/calendario`, página pública en
`/calendario`, y un adelanto de "Próximas fechas" en el Home. Datos de
ejemplo con fechas claramente marcadas como placeholder — no son las fechas
reales de parciales de la cátedra.

## Migración del CRUD de contenido a la API real — completa

Todo el panel (Unidades, Programa, Bibliografía, Material, Trivias,
Preguntas, Novedades, Menú, Enlaces, Footer/Redes, Configuración visual,
SEO) ahora es **asíncrono en ambos modos**:

- Con `VITE_API_URL` configurada: cada operación (listar, crear, editar,
  eliminar) habla con `tdj-backend` en tiempo real. El contenido queda
  compartido entre todos los administradores, sea cual sea su navegador.
- Sin `VITE_API_URL`: sigue funcionando exactamente igual que en las Fases
  2-3, con `localStorage` — útil para mostrar el proyecto sin depender del
  backend.

La decisión de cuál modo usar se toma una sola vez, en `src/services/adminService.ts`,
según si `VITE_API_URL` está definida — ningún componente del panel necesita
saber cuál de los dos está activo.

**Antes de esta migración**, `FormField` (usado por todos los formularios)
pedía la lista de unidades de forma síncrona en cada render — eso funcionaba
porque `localStorage` es síncrono. Ahora que todo es asíncrono, la lista de
unidades se carga una sola vez y se comparte por contexto
(`src/admin/context/UnidadesOptionsContext.tsx`), montado en `AdminLayout`.
