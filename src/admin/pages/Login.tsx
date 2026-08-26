import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, DEMO_CREDENTIALS } from '@/context/AuthContext';

export default function Login() {
  const { login, isRemote } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: { pathname: string } } };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      navigate(location.state?.from?.pathname ?? '/admin', { replace: true });
    } else {
      setError(result.error ?? 'No se pudo iniciar sesión.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-[380px] bg-white rounded-2xl p-7">
        <div className="w-10 h-10 rounded-[10px] bg-brand-gradient mb-4" />
        <h1 className="text-xl font-display font-semibold mb-1">Panel administrativo</h1>
        <p className="text-ink-soft text-sm mb-6">Teoría del Derecho y la Justicia B</p>

        <label className="block text-xs font-semibold text-ink-soft mb-1.5">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3.5 py-2.5 rounded-xl border border-line text-sm outline-none focus:border-cyan"
          placeholder="admin@catedra.edu.ar"
          required
        />

        <label className="block text-xs font-semibold text-ink-soft mb-1.5">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-2 px-3.5 py-2.5 rounded-xl border border-line text-sm outline-none focus:border-cyan"
          placeholder="••••••••"
          required
        />

        {error && <p className="text-red-600 text-xs mb-3">{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-grad w-full justify-center mt-4 disabled:opacity-60">
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        {isRemote ? (
          <p className="text-[11px] text-ink-soft mt-5 leading-relaxed">
            Conectado al backend real. Usá tu email y contraseña de administrador (el usuario sembrado por
            defecto es <b className="font-mono">{DEMO_CREDENTIALS.email}</b>).
          </p>
        ) : (
          <p className="text-[11px] text-ink-soft mt-5 leading-relaxed">
            Modo demo (sin backend conectado) — usá <b className="font-mono">{DEMO_CREDENTIALS.email}</b> /{' '}
            <b className="font-mono">{DEMO_CREDENTIALS.password}</b>. Definí <code>VITE_API_URL</code> para
            conectar el login real con roles y permisos.
          </p>
        )}
      </form>
    </div>
  );
}
