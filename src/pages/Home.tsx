import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentService } from '@/services/contentService';
import type { Novedad, EnlaceEditable, SiteConfig, ItemMenu, EventoCalendario } from '@/types';
import { SectionHead } from '@/components/Common';

// Devuelve un objeto Date válido a partir de "YYYY-MM-DD", o null si la fecha
// no existe o tiene un formato inválido. Evita que Intl.DateTimeFormat / Date
// exploten con "RangeError: Invalid time value" y dejen la página en blanco.
function parseFechaSegura(fecha: string | null | undefined): Date | null {
  if (!fecha) return null;
  const d = new Date(fecha + 'T00:00:00');
  if (isNaN(d.getTime())) return null;
  return d;
}

export default function Home() {
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [menu, setMenu] = useState<ItemMenu[]>([]);
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [sitios, setSitios] = useState<EnlaceEditable[]>([]);
  const [proximasFechas, setProximasFechas] = useState<EventoCalendario[]>([]);

  useEffect(() => {
    contentService.getSiteConfig().then(setSite);
    contentService.getMenu().then(setMenu);
    contentService.getNovedades().then(setNovedades);
    contentService.getSitiosImportantes().then(setSitios);
    contentService.getCalendario().then((eventos) => {
      const hoy = new Date().toISOString().slice(0, 10);
      setProximasFechas(
        eventos
          .filter((e) => !!e.fecha && e.fecha >= hoy)
          .slice(0, 3)
      );
    });
  }, []);

  if (!site) return null;

  return (
    <div>
      <section className="rounded-3xl p-8 md:p-11 bg-ink text-white relative overflow-hidden mb-8">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 15% 20%, rgba(28,223,232,.35), transparent 45%), radial-gradient(circle at 85% 80%, rgba(255,138,209,.35), transparent 45%)',
          }}
        />
        <div className="relative max-w-[640px]">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wide uppercase text-cyan bg-cyan/10 border border-cyan/30 px-3 py-1.5 rounded-full mb-4">
            Plataforma académica
          </span>
          <h1 className="text-[32px] md:text-[34px] leading-tight mb-3.5">{site.nombre}</h1>
          <p className="text-gray-300 text-[15.5px] leading-relaxed mb-6">{site.bienvenida}</p>
          <div className="flex flex-wrap gap-2.5">
            <Link to="/unidades" className="btn btn-grad">
              Ver unidades →
            </Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-10">
        {menu
          .filter((m) => m.to !== '/')
          .map((m) => (
            <Link key={m.id} to={m.to} className="card hover:-translate-y-0.5">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-brand-gradient-soft flex items-center justify-center mb-2.5">
                •
              </div>
              <b className="block text-sm mb-0.5">{m.label}</b>
              <span className="text-[12.5px] text-ink-soft">Ir a {m.label.toLowerCase()}</span>
            </Link>
          ))}
      </div>

      {proximasFechas.length > 0 && (
        <>
          <SectionHead title="Próximas fechas" seeAllTo="/calendario" />
          <div className="grid md:grid-cols-3 gap-3.5 mb-10">
            {proximasFechas.map((e) => {
              const fechaValida = parseFechaSegura(e.fecha);
              if (!fechaValida) return null;
              return (
                <Link key={e.id} to="/calendario" className="card flex items-center gap-3.5">
                  <div className="shrink-0 w-12 text-center">
                    <div className="text-xl font-display font-semibold leading-none">
                      {fechaValida.getDate()}
                    </div>
                    <div className="text-[10px] uppercase text-ink-soft font-semibold mt-0.5">
                      {new Intl.DateTimeFormat('es-AR', { month: 'short' }).format(fechaValida)}
                    </div>
                  </div>
                  <span className="text-[13.5px] font-medium">{e.titulo}</span>
                </Link>
              );
            })}
          </div>
        </>
      )}

      <SectionHead title="Últimas novedades" seeAllTo="/novedades" />
      <div className="grid md:grid-cols-3 gap-3.5 mb-10">
        {novedades.slice(0, 3).map((n) => (
          <div key={n.id} className="card">
            {n.destacada && <span className="badge">Destacada</span>}
            <h3 className="text-[15px] mt-2.5 mb-1.5 font-semibold">{n.titulo}</h3>
            <p className="text-[13px] text-ink-soft leading-relaxed mb-2">{n.descripcion}</p>
            <span className="font-mono text-[11px] text-gray-400">{n.fecha}</span>
          </div>
        ))}
      </div>

      <SectionHead title="Sitios importantes" seeAllTo="/sitios" />
      <div className="grid md:grid-cols-2 gap-3.5">
        {sitios.slice(0, 4).map((s) => (
          <a
            key={s.id}
            href={s.url}
            target={s.abrirEnNuevaPestana ? '_blank' : undefined}
            rel="noreferrer"
            className="flex items-center gap-3.5 bg-white border border-line rounded-2xl px-4 py-3.5"
          >
            <div className="w-11 h-11 rounded-[11px] bg-brand-gradient flex items-center justify-center font-bold text-[15px] text-ink shrink-0 overflow-hidden">
              {s.logoUrl ? (
                <img
                  src={s.logoUrl}
                  alt={s.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                s.icono
              )}
            </div>
            <div>
              <b className="text-[14.5px] block">{s.nombre}</b>
              <span className="text-[12.5px] text-ink-soft">{s.descripcion}</span>
            </div>
            <span className="ml-auto text-ink-soft text-lg">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}