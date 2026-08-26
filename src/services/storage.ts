// Capa de almacenamiento. Hoy persiste en localStorage (para que el panel
// administrativo sea completamente funcional sin backend). En la Fase 4,
// este archivo es el único que cambia: las mismas funciones pasan a hacer
// fetch()/POST contra la API en Render, y ni el panel ni el sitio público
// necesitan tocarse.

const PREFIX = 'tdj:';

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (err) {
    // localStorage tiene un límite (~5MB). Las imágenes en base64 pueden
    // agotarlo rápido — en Fase 6 esto se reemplaza por almacenamiento de
    // archivos real (S3/Cloudinary/disco persistente de Render).
    console.error('No se pudo guardar en localStorage:', err);
    throw new Error(
      'No se pudo guardar. El almacenamiento local está lleno (esto se resuelve en la Fase 6 con carga de archivos real).'
    );
  }
}

/** Devuelve la lista guardada, o la sembra con `seed` la primera vez. */
export function getList<T>(key: string, seed: T[]): T[] {
  const existing = read<T[]>(key);
  if (existing) return existing;
  write(key, seed);
  return seed;
}

export function setList<T>(key: string, list: T[]) {
  write(key, list);
}

/** Devuelve el objeto guardado, o lo sembra con `seed` la primera vez. */
export function getObject<T>(key: string, seed: T): T {
  const existing = read<T>(key);
  if (existing) return existing;
  write(key, seed);
  return seed;
}

export function setObject<T>(key: string, value: T) {
  write(key, value);
}

export function resetKey(key: string) {
  localStorage.removeItem(PREFIX + key);
}

export function genId(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
