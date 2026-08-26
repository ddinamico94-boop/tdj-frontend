// Cliente HTTP hacia tdj-backend. Se activa definiendo VITE_API_URL
// (ver .env.example). Mientras tanto, AuthContext sigue en modo demo local
// y el resto del panel (CRUD de contenido) sigue en localStorage — ver
// nota en adminService.ts sobre la migración pendiente de esa parte.

const BASE_URL = import.meta.env.VITE_API_URL as string | undefined;
const TOKEN_KEY = 'tdj:token';

function authHeader(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!BASE_URL) {
    throw new Error('VITE_API_URL no está configurada. Ver src/services/apiClient.ts y .env.example.');
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Error ${res.status} al llamar a ${path}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(path: string, data: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  isConfigured: () => Boolean(BASE_URL),

  /** Sube un archivo real al backend (Fase 6) y devuelve su URL pública.
   * No usa `request()` porque el Content-Type de multipart lo arma el
   * propio navegador (con el boundary), no hay que fijarlo a mano. */
  async uploadFile(file: File): Promise<{ url: string; filename: string; mimetype: string; size: number }> {
    if (!BASE_URL) {
      throw new Error('VITE_API_URL no está configurada.');
    }
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BASE_URL}/uploads`, { method: 'POST', headers: { ...authHeader() }, body: formData });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? `Error ${res.status} al subir el archivo.`);
    }
    return res.json();
  },
};
