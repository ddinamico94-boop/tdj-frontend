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

// Devuelve un Date válido a partir de "YYYY-MM-DD", o null si la fecha no
// existe o es inválida. Evita "RangeError: Invalid time value" que rompía
// el render y dejaba la página en blanco cuando algún evento venía sin
// fecha (o con formato incorrecto) desde el panel administrativo.
function parseFechaSegura(fecha: string | null | undefined): Date | null {
  if (!fecha) return null;
  const date = new Date(fecha + 'T00:00:00');
  if (isNaN(date.getTime())) return null;
  return date;
}

function formatFecha(iso: string | null | undefined): string {
  const date = parseFechaSegura(iso);
  if (!date) return 'Fecha a confirmar';
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
          const fechaValida = parseFechaSegura(e.fecha);
          const esProximo = !!e.fecha && e.fecha >= hoy;

          return (
            <div
              key={e.id}
              className={`card flex items-start gap-4 ${esProximo ? '' : 'opacity-60'}`}
            >
              <div className="shrink-0 w-16 text-center">
                <div className="text-2xl font-display font-semibold leading-none">
                  {fechaValida ? fechaValida.getDate() : '–'}
                </div>
                <div className="text-[11px] uppercase text-ink-soft font-semibold mt-1">
                  {fechaValida ? new Intl.DateTimeFormat('es-AR', { month: 'short' }).format(fechaValida) : ''}
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