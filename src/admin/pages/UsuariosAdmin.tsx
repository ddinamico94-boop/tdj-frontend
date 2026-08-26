import { useEffect, useState } from 'react';
import ResourceListPage from '@/admin/components/ResourceListPage';
import type { FieldConfig } from '@/admin/components/FormField';
import { adminUsersResource, genId } from '@/services/adminService';
import { apiClient } from '@/services/apiClient';
import { useAuth } from '@/context/AuthContext';
import type { AdminUser } from '@/types';

const localFields: FieldConfig<AdminUser>[] = [
  { name: 'nombre', label: 'Nombre', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'text', required: true },
  {
    name: 'rol',
    label: 'Rol',
    type: 'select',
    options: [
      { value: 'superadmin', label: 'Superadmin' },
      { value: 'admin', label: 'Admin' },
      { value: 'editor', label: 'Editor' },
    ],
  },
  { name: 'activo', label: 'Activo', type: 'checkbox' },
];

export default function UsuariosAdmin() {
  const { isRemote } = useAuth();
  if (isRemote) return <UsuariosAdminRemote />;

  return (
    <ResourceListPage<AdminUser>
      title="Administradores"
      description="Modo demo local — para gestionar contraseñas y permisos reales por rol, conectá el backend (VITE_API_URL)."
      resource={adminUsersResource}
      fields={localFields}
      itemLabel={(u) => u.nombre}
      columns={[
        { header: 'Nombre', render: (u) => <span className="font-medium">{u.nombre}</span> },
        { header: 'Email', render: (u) => u.email },
        { header: 'Rol', render: (u) => <span className="badge">{u.rol}</span> },
        { header: 'Estado', render: (u) => (u.activo ? 'Activo' : 'Inactivo') },
      ]}
      emptyItem={() => ({ id: genId('user'), nombre: '', email: '', rol: 'editor', activo: true })}
    />
  );
}

// Modo conectado al backend: contraseñas reales (hasheadas del lado del
// servidor), permisos por rol (crear/editar: admin o superadmin; eliminar
// y resetear contraseña ajena: solo superadmin — ver tdj-backend/src/routes/adminUsers.routes.ts).
interface RemoteUser {
  id: string;
  nombre: string;
  email: string;
  rol: 'superadmin' | 'admin' | 'editor';
  activo: boolean;
}

function UsuariosAdminRemote() {
  const { user: currentUser } = useAuth();
  const canManage = currentUser?.rol === 'superadmin' || currentUser?.rol === 'admin';
  const canDelete = currentUser?.rol === 'superadmin';

  const [users, setUsers] = useState<RemoteUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Partial<RemoteUser> & { password?: string }>({});
  const [showForm, setShowForm] = useState(false);
  const [resetTarget, setResetTarget] = useState<RemoteUser | null>(null);
  const [resetPassword, setResetPassword] = useState('');

  async function refresh() {
    setLoading(true);
    try {
      setUsers(await apiClient.get<RemoteUser[]>('/admin-users'));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function openNew() {
    setEditing({ rol: 'editor', activo: true });
    setShowForm(true);
  }

  function openEdit(u: RemoteUser) {
    setEditing(u);
    setShowForm(true);
  }

  async function save() {
    try {
      if (editing.id) {
        await apiClient.put(`/admin-users/${editing.id}`, {
          nombre: editing.nombre,
          email: editing.email,
          rol: editing.rol,
          activo: editing.activo,
        });
      } else {
        await apiClient.post('/admin-users', editing);
      }
      setShowForm(false);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar.');
    }
  }

  async function remove(u: RemoteUser) {
    if (!window.confirm(`¿Eliminar a "${u.nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await apiClient.delete(`/admin-users/${u.id}`);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar.');
    }
  }

  async function confirmReset() {
    if (!resetTarget || resetPassword.length < 8) return;
    try {
      await apiClient.post(`/admin-users/${resetTarget.id}/reset-password`, { newPassword: resetPassword });
      setResetTarget(null);
      setResetPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo resetear.');
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
        <div>
          <h1 className="text-xl font-display font-semibold">Administradores</h1>
          <p className="text-ink-soft text-sm mt-1 max-w-[520px]">
            Conectado al backend. Crear/editar: admin o superadmin. Eliminar y resetear contraseña ajena: solo
            superadmin.
          </p>
        </div>
        {canManage && (
          <button onClick={openNew} className="btn btn-grad shrink-0">
            + Nuevo
          </button>
        )}
      </div>

      {error && <p className="text-red-600 text-xs mt-3">{error}</p>}

      <div className="mt-4 bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg border-b border-line text-left">
              <th className="px-4 py-2.5 font-semibold text-xs text-ink-soft">Nombre</th>
              <th className="px-4 py-2.5 font-semibold text-xs text-ink-soft">Email</th>
              <th className="px-4 py-2.5 font-semibold text-xs text-ink-soft">Rol</th>
              <th className="px-4 py-2.5 font-semibold text-xs text-ink-soft">Estado</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-soft text-sm">
                  Cargando...
                </td>
              </tr>
            )}
            {!loading &&
              users.map((u) => (
                <tr key={u.id} className="border-b border-line last:border-0 hover:bg-bg/60">
                  <td className="px-4 py-3 font-medium">{u.nombre}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="badge">{u.rol}</span>
                  </td>
                  <td className="px-4 py-3">{u.activo ? 'Activo' : 'Inactivo'}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {canManage && (
                      <button onClick={() => openEdit(u)} className="text-cyan font-semibold text-xs mr-3">
                        Editar
                      </button>
                    )}
                    {currentUser?.rol === 'superadmin' && (
                      <button
                        onClick={() => setResetTarget(u)}
                        className="text-ink-soft font-semibold text-xs mr-3"
                      >
                        Resetear contraseña
                      </button>
                    )}
                    {canDelete && u.id !== currentUser?.id && (
                      <button onClick={() => remove(u)} className="text-red-500 font-semibold text-xs">
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-display font-semibold mb-4">{editing.id ? 'Editar' : 'Nuevo administrador'}</h2>
            <div className="space-y-3">
              <input
                placeholder="Nombre"
                value={editing.nombre ?? ''}
                onChange={(e) => setEditing({ ...editing, nombre: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm"
              />
              <input
                placeholder="Email"
                value={editing.email ?? ''}
                onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm"
              />
              {!editing.id && (
                <input
                  placeholder="Contraseña (mínimo 8 caracteres)"
                  type="password"
                  value={editing.password ?? ''}
                  onChange={(e) => setEditing({ ...editing, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm"
                />
              )}
              <select
                value={editing.rol ?? 'editor'}
                onChange={(e) => setEditing({ ...editing, rol: e.target.value as RemoteUser['rol'] })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm bg-white"
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={editing.activo ?? true}
                  onChange={(e) => setEditing({ ...editing, activo: e.target.checked })}
                  className="accent-cyan"
                />
                Activo
              </label>
            </div>
            <div className="flex gap-2.5 mt-6 justify-end">
              <button onClick={() => setShowForm(false)} className="btn btn-outline">
                Cancelar
              </button>
              <button onClick={save} className="btn btn-grad">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {resetTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-display font-semibold mb-1">Resetear contraseña</h2>
            <p className="text-ink-soft text-sm mb-4">{resetTarget.nombre}</p>
            <input
              type="password"
              placeholder="Nueva contraseña (mínimo 8 caracteres)"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm"
            />
            <div className="flex gap-2.5 mt-5 justify-end">
              <button
                onClick={() => {
                  setResetTarget(null);
                  setResetPassword('');
                }}
                className="btn btn-outline"
              >
                Cancelar
              </button>
              <button onClick={confirmReset} className="btn btn-grad">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
