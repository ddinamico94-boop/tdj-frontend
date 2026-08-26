import { useState, type FormEvent } from 'react';
import { apiClient } from '@/services/apiClient';
import { useAuth } from '@/context/AuthContext';

export default function MiCuenta() {
  const { user, isRemote } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 8 caracteres.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'La confirmación no coincide con la nueva contraseña.' });
      return;
    }
    setLoading(true);
    try {
      await apiClient.put('/auth/me/password', { currentPassword, newPassword });
      setMessage({ type: 'ok', text: 'Contraseña actualizada correctamente.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'No se pudo actualizar.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-display font-semibold mb-1">Mi cuenta</h1>
      <p className="text-ink-soft text-sm mb-6">
        {user?.nombre} · {user?.email} · <span className="badge">{user?.rol}</span>
      </p>

      {!isRemote ? (
        <div className="bg-white border border-line rounded-2xl p-6 text-sm text-ink-soft">
          El cambio de contraseña real requiere estar conectado al backend (definir <code>VITE_API_URL</code>).
          En modo demo local no hay contraseña que cambiar.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-line rounded-2xl p-6 max-w-md space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-soft mb-1.5">Contraseña actual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm outline-none focus:border-cyan"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-soft mb-1.5">Nueva contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm outline-none focus:border-cyan"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-soft mb-1.5">Confirmar nueva contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm outline-none focus:border-cyan"
            />
          </div>
          {message && (
            <p className={`text-xs ${message.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>
          )}
          <button type="submit" disabled={loading} className="btn btn-grad disabled:opacity-60">
            {loading ? 'Guardando...' : 'Actualizar contraseña'}
          </button>
        </form>
      )}
    </div>
  );
}
