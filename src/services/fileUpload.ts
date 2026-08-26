import { apiClient } from './apiClient';

// Punto único de decisión para "subir un archivo" en todo el panel
// (ImageUpload, campos tipo "file" del formulario genérico, e imágenes
// insertadas desde el editor de contenido enriquecido).
//
// - Con VITE_API_URL configurada (Fase 6): sube de verdad al backend
//   (POST /api/uploads) y devuelve una URL real y persistente.
// - Sin backend conectado: cae al comportamiento de las Fases 2-3
//   (codificar en base64 y guardarlo en localStorage), para que el panel
//   siga siendo usable en modo demo. Se avisa si el archivo es grande.

const BASE64_WARN_SIZE = 1.5 * 1024 * 1024; // 1.5MB

export async function uploadOrEncode(file: File): Promise<string> {
  if (apiClient.isConfigured()) {
    const { url } = await apiClient.uploadFile(file);
    return url;
  }

  if (file.size > BASE64_WARN_SIZE) {
    const proceed = window.confirm(
      `"${file.name}" pesa ${(file.size / 1024 / 1024).toFixed(1)}MB. Sin backend conectado se guarda como texto en localStorage (límite ~5MB total) y puede llenarlo rápido. ¿Subir igual?`
    );
    if (!proceed) throw new Error('Carga cancelada.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(file);
  });
}
