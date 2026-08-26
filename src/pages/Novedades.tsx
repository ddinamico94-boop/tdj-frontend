import { useEffect, useState } from 'react';
import { contentService } from '@/services/contentService';
import type { Novedad } from '@/types';
import { Breadcrumb, SectionHead } from '@/components/Common';

export default function Novedades() {
  const [novedades, setNovedades] = useState<Novedad[]>([]);

  useEffect(() => {
    contentService.getNovedades().then(setNovedades);
  }, []);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Novedades' }]} />
      <SectionHead title="Novedades" />
      <div className="grid md:grid-cols-3 gap-3.5">
        {novedades.map((n) => (
          <div key={n.id} className="card">
            {n.destacada && <span className="badge">Destacada</span>}
            <h3 className="text-[15px] font-semibold mt-2.5 mb-1.5">{n.titulo}</h3>
            <div className="prose-content text-[13px] mb-2" dangerouslySetInnerHTML={{ __html: n.descripcion }} />
            {n.archivoUrl && (
              <a href={n.archivoUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-cyan block mb-2">
                📎 Descargar adjunto
              </a>
            )}
            <span className="font-mono text-[11px] text-gray-400">{n.fecha}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
