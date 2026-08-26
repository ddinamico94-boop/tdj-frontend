import { useEffect, useState } from 'react';
import { contentService } from '@/services/contentService';
import type { EventoCalendario, TipoEvento } from '@/types';
import { Breadcrumb, SectionHead, Empty } from '@/components/Common';

const TIPO_LABEL: Record<TipoEvento, string> = {
  parcial: 'Parcial',
  recuperatorio: 'Recuperatorio',
  clase: 'Clase',
  entrega: 'Entrega',
  feriado: 'Feriado',
  otro: 'Otro',
};

function formatFecha(iso: string) {
  const date = new Date(iso + 'T00:00:00');
  return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

export default function CalendarioPage() {
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);

  useEffect(() => {
    contentService.getCalendario().then(setEventos);
  }, []);

  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Calendario' }]} />
      <SectionHead title="Calendario académico" />
      <p className="text-ink-soft text-[13.5px] -mt-2 mb-5 max-w-[600px]">
        Fechas de parciales, recuperatorios y otros eventos de la cátedra. Cargadas y actualizadas desde el panel
        administrativo.
      </p>

      {eventos.length === 0 && <Empty title="Todavía no hay fechas cargadas" />}

      <div className="space-y-3">
        {eventos.map((e) => {
          const esProximo = e.fecha >= hoy;
          return (
            <div
              key={e.id}
              className={`card flex items-start gap-4 ${esProximo ? '' : 'opacity-60'}`}
            >
              <div className="shrink-0 w-16 text-center">
                <div className="text-2xl font-display font-semibold leading-none">
                  {new Date(e.fecha + 'T00:00:00').getDate()}
                </div>
                <div className="text-[11px] uppercase text-ink-soft font-semibold mt-1">
                  {new Intl.DateTimeFormat('es-AR', { month: 'short' }).format(new Date(e.fecha + 'T00:00:00'))}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="badge">{TIPO_LABEL[e.tipo]}</span>
                  {esProximo && <span className="text-[11px] font-semibold text-cyan">Próximo</span>}
                </div>
                <h3 className="text-[15px] font-semibold mb-1">{e.titulo}</h3>
                {e.descripcion && <p className="text-[13px] text-ink-soft leading-relaxed mb-1">{e.descripcion}</p>}
                <span className="text-xs text-ink-soft">
                  {formatFecha(e.fecha)}
                  {e.fechaFin ? ` – ${formatFecha(e.fechaFin)}` : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
