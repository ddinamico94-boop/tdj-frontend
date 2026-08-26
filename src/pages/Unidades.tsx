import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentService } from '@/services/contentService';
import type { Unidad } from '@/types';
import { Breadcrumb, SectionHead } from '@/components/Common';

export default function Unidades() {
  const [unidades, setUnidades] = useState<Unidad[]>([]);

  useEffect(() => {
    contentService.getUnidades().then(setUnidades);
  }, []);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Unidades' }]} />
      <SectionHead title="Unidades de la materia" />
      <p className="text-ink-soft text-[13.5px] -mt-2 mb-5 max-w-[600px]">
        Las 14 unidades y sus nombres son completamente editables desde el panel administrativo.
      </p>
      <div className="grid md:grid-cols-3 gap-3.5">
        {unidades.map((u) => (
          <Link key={u.id} to={`/unidades/${u.id}`} className="card flex flex-col gap-2.5">
            <span className="font-mono text-xs font-semibold bg-brand-gradient bg-clip-text text-transparent w-fit">
              {u.numero}
            </span>
            <span className="text-[16px] font-semibold">{u.titulo}</span>
            <span className="text-[13px] text-ink-soft leading-relaxed">{u.descripcion}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
