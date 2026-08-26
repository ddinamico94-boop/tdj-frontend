import { useEffect, useState } from 'react';
import { contentService } from '@/services/contentService';
import type { MaterialEstudio, Unidad } from '@/types';
import { Breadcrumb, SectionHead } from '@/components/Common';

export default function Material() {
  const [materiales, setMateriales] = useState<MaterialEstudio[]>([]);
  const [unidades, setUnidades] = useState<Unidad[]>([]);

  useEffect(() => {
    contentService.getMateriales().then(setMateriales);
    contentService.getUnidades().then(setUnidades);
  }, []);

  const nombreUnidades = (ids: number[]) =>
    ids.map((id) => unidades.find((u) => u.id === id)?.titulo).filter(Boolean).join(', ');

  return (
    <div>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Material de estudio' }]} />
      <SectionHead title="Material de estudio" />
      <div className="grid md:grid-cols-3 gap-3.5">
        {materiales.map((m) => (
          <div key={m.id} className="card">
            <span className="badge">{m.tipo}</span>
            <h3 className="text-[14.5px] font-semibold mt-2.5 mb-1">{m.titulo}</h3>
            <span className="text-xs text-ink-soft block mb-1.5">{nombreUnidades(m.unidadesIds)}</span>
            <p className="text-xs text-ink-soft m-0 mb-2">{m.descripcion}</p>
            {m.archivoUrl && (
              <a href={m.archivoUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-cyan">
                ⬇ Descargar {m.tipo}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
