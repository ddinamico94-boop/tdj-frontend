import { Link } from 'react-router-dom';
import type { ItemMenu, SiteConfig } from '@/types';

interface Props {
  menu: ItemMenu[];
  site: SiteConfig;
}

export default function Footer({ menu, site }: Props) {
  return (
    <footer className="border-t border-line px-5 py-8 mt-10">
      <div className="max-w-[1120px] mx-auto flex flex-col gap-4">
        <div className="flex items-center gap-2.5 font-bold text-[15px]">
          <span className="w-[30px] h-[30px] rounded-[9px] bg-brand-gradient shrink-0" />
          <span>{site.nombre}</span>
        </div>
        <p className="text-[13px] text-ink-soft max-w-[480px]">{site.footerTexto}</p>
        <div className="flex flex-wrap gap-4 text-[13px] text-ink-soft">
          {menu.map((item) => (
            <Link key={item.id} to={item.to} className="hover:text-ink">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex justify-between flex-wrap gap-2 text-xs text-gray-400 pt-4 border-t border-line">
          <span>© 2026 {site.nombre}. Todos los derechos reservados.</span>
          <span className="italic">Redes sociales — configurables desde el panel</span>
        </div>
      </div>
    </footer>
  );
}
