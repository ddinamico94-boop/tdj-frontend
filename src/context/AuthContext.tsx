import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { apiClient } from '@/services/apiClient';

// Autenticación dual (Fase 5):
// - Si VITE_API_URL está configurada, el login es real contra tdj-backend
//   (JWT + roles superadmin/admin/editor).
// - Si no, se mantiene el login demo local (útil para probar el frontend
//   sin tener el backend corriendo).

export type Rol = 'superadmin' | 'admin' | 'editor';

interface AuthUser {
  id?: string;
  email: string;
  nombre: string;
  rol: Rol;
}

interface AuthContextValue {
  user: AuthUser | null;
  isRemote: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const SESSION_KEY = 'tdj:session';
// Credenciales de demo — solo aplican cuando no hay backend conectado.
const DEMO_EMAIL = 'admin@catedra.edu.ar';
const DEMO_PASSWORD = 'catedra2026';

const AuthContext = createContext<AuthContextValue | null>(null);

function readSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readSession());
  const isRemote = apiClient.isConfigured();

  const login = useCallback(
    async (email: string, password: string) => {
      if (isRemote) {
        try {
          const { token, user: remoteUser } = await apiClient.post<{ token: string; user: AuthUser }>(
            '/auth/login',
            { email, password }
          );
          apiClient.setToken(token);
          localStorage.setItem(SESSION_KEY, JSON.stringify(remoteUser));
          setUser(remoteUser);
          return { ok: true };
        } catch (err) {
          return { ok: false, error: err instanceof Error ? err.message : 'No se pudo iniciar sesión.' };
        }
      }

      // Modo demo local
      if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
        const authUser: AuthUser = { email: DEMO_EMAIL, nombre: 'Administrador', rol: 'superadmin' };
        localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
        setUser(authUser);
        return { ok: true };
      }
      return { ok: false, error: 'Email o contraseña incorrectos.' };
    },
    [isRemote]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    apiClient.clearToken();
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, isRemote, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}

export const DEMO_CREDENTIALS = { email: DEMO_EMAIL, password: DEMO_PASSWORD };
