import { useEffect, useState } from 'react';
import { contentService } from '@/services/contentService';
import type { EnlaceEditable } from '@/types';
import { Breadcrumb, SectionHead } from '@/components/Common';

export default function Sitios() {
  const [sitios, setSitios] = useState<EnlaceEditable[]>([]);

  useEffect(() => {
    contentService.getSitiosImportantes().then(setSitios);
  }, []);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Sitios importantes' }]} />
      <SectionHead title="Sitios importantes" />
      <div className="grid md:grid-cols-2 gap-3.5">
        {sitios.map((s) => (
          <a
            key={s.id}
            href={s.url}
            target={s.abrirEnNuevaPestana ? '_blank' : undefined}
            rel="noreferrer"
            className="flex items-center gap-3.5 bg-white border border-line rounded-2xl px-4 py-3.5"
          >
            <div className="w-11 h-11 rounded-[11px] bg-brand-gradient flex items-center justify-center font-bold text-[15px] text-ink shrink-0">
              {s.icono}
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
