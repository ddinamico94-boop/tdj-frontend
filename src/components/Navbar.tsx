import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import type { ItemMenu, SiteConfig } from '@/types';

interface Props {
  menu: ItemMenu[];
  site: SiteConfig;
}

export default function Navbar({ menu, site }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-bg/85 backdrop-blur border-b border-line">
      <div className="max-w-[1120px] mx-auto flex items-center justify-between px-5 py-3.5">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-[15px]">
          <span className="w-[30px] h-[30px] rounded-[9px] bg-brand-gradient shrink-0" />
          <span>
            {site.nombre}
            <small className="block font-medium text-ink-soft text-[11px]">Cátedra · Facultad de Derecho</small>
          </span>
        </Link>

        <nav className="hidden md:flex gap-0.5">
          {menu.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-[10px] text-sm font-medium text-ink-soft hover:text-ink hover:bg-brand-gradient-soft transition ${
                  isActive ? 'text-ink bg-brand-gradient-soft' : ''
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="md:hidden border border-line rounded-[10px] px-2.5 py-2"
          onClick={() => setOpen((o) => !o)}
          aria-label="Abrir menú"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="md:hidden flex flex-col px-5 pb-4 border-t border-line">
          {menu.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              onClick={() => setOpen(false)}
              className="py-2.5 text-[15px] font-medium border-b border-line"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
