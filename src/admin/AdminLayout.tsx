import { NavLink, Outlet, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UnidadesOptionsProvider } from '@/admin/context/UnidadesOptionsContext';

const NAV_GROUPS: { label: string; items: { to: string; label: string }[] }[] = [
  {
    label: 'Contenido académico',
    items: [
      { to: '/admin/unidades', label: 'Unidades' },
      { to: '/admin/programa', label: 'Programa' },
      { to: '/admin/calendario', label: 'Calendario' },
      { to: '/admin/bibliografia', label: 'Bibliografía' },
      { to: '/admin/material', label: 'Material de estudio' },
    ],
  },
  {
    label: 'Comunicación',
    items: [
      { to: '/admin/novedades', label: 'Novedades' },
      { to: '/admin/enlaces', label: 'Sitios / enlaces' },
    ],
  },
  {
    label: 'Estructura del sitio',
    items: [
      { to: '/admin/menu', label: 'Menú' },
      { to: '/admin/footer', label: 'Footer y redes' },
      { to: '/admin/visual', label: 'Configuración visual' },
      { to: '/admin/seo', label: 'SEO' },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { to: '/admin/cuenta', label: 'Mi cuenta' },
      { to: '/admin/usuarios', label: 'Administradores' },
    ],
  },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-bg">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-[250px] bg-ink text-white flex flex-col transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-2.5 font-semibold text-sm">
            <span className="w-8 h-8 rounded-[9px] bg-brand-gradient shrink-0" />
            Panel · TDJ B
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-4">
              <div className="text-[10.5px] uppercase tracking-wide text-white/40 font-semibold px-2.5 mb-1.5">
                {group.label}
              </div>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-2.5 py-2 rounded-lg text-[13.5px] font-medium mb-0.5 ${
                      isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link to="/" className="block text-[12.5px] text-white/60 hover:text-white mb-2">
            ← Ver sitio público
          </Link>
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] text-white/70 truncate">{user?.nombre}</span>
            <button onClick={logout} className="text-[12.5px] font-semibold text-pink hover:underline shrink-0 ml-2">
              Salir
            </button>
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setOpen(false)} />}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <header className="md:hidden sticky top-0 z-20 bg-white border-b border-line px-4 py-3 flex items-center justify-between">
          <span className="font-semibold text-sm">Panel · TDJ B</span>
          <button className="border border-line rounded-lg px-2.5 py-1.5" onClick={() => setOpen(true)}>
            ☰
          </button>
        </header>
        <main className="p-5 md:p-8 max-w-[1000px] mx-auto">
          <UnidadesOptionsProvider>
            <Outlet />
          </UnidadesOptionsProvider>
        </main>
      </div>
    </div>
  );
}