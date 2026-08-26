import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { contentService } from '@/services/contentService';
import type { Unidad, MaterialEstudio, RecursoBibliografico } from '@/types';
import { Breadcrumb, SectionHead, Empty } from '@/components/Common';

export default function UnidadDetalle() {
  const { id } = useParams();
  const unidadId = Number(id);
  const [unidad, setUnidad] = useState<Unidad | undefined>();
  const [materiales, setMateriales] = useState<MaterialEstudio[]>([]);
  const [bibliografia, setBibliografia] = useState<RecursoBibliografico[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    Promise.all([
      contentService.getUnidad(unidadId),
      contentService.getMateriales(),
      contentService.getBibliografia(),
    ]).then(([u, mats, bibs]) => {
      setUnidad(u);
      setMateriales(mats.filter((m) => m.unidadesIds.includes(unidadId)));
      setBibliografia(bibs.filter((b) => b.unidadId === unidadId));
      setLoaded(true);
    });
  }, [unidadId]);

  if (loaded && !unidad) return <Empty title="Unidad no encontrada" />;
  if (!unidad) return null;

  return (
    <div>
      <Breadcrumb
        items={[{ label: 'Inicio', to: '/' }, { label: 'Unidades', to: '/unidades' }, { label: unidad.titulo }]}
      />
      <span className="font-mono text-sm bg-brand-gradient bg-clip-text text-transparent">{unidad.numero}</span>
      <h1 className="text-[26px] font-display font-semibold mt-1.5 mb-2.5">{unidad.titulo}</h1>
      <p className="text-ink-soft max-w-[640px] leading-relaxed">{unidad.descripcion}</p>

      {unidad.introduccion && (
        <div className="prose-content max-w-[720px] mt-4" dangerouslySetInnerHTML={{ __html: unidad.introduccion }} />
      )}

      <div className="mt-7">
        <SectionHead title="Temas" />
        <div className="grid md:grid-cols-3 gap-3.5 mb-8">
          {unidad.temas.map((t, i) => (
            <div key={i} className="card text-sm font-medium">
              {t}
            </div>
          ))}
        </div>
      </div>

      {materiales.length > 0 && (
        <div className="mb-8">
          <SectionHead title="Material relacionado" />
          <div className="grid md:grid-cols-3 gap-3.5">
            {materiales.map((m) => (
              <div key={m.id} className="card">
                <span className="badge">{m.tipo}</span>
                <h3 className="text-sm font-semibold mt-2 mb-1">{m.titulo}</h3>
                <p className="text-xs text-ink-soft m-0 mb-2">{m.descripcion}</p>
                {m.archivoUrl && (
                  <a href={m.archivoUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-cyan">
                    ⬇ Descargar
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {bibliografia.length > 0 && (
        <div>
          <SectionHead title="Bibliografía relacionada" />
          <div className="grid md:grid-cols-3 gap-3.5">
            {bibliografia.map((b) => (
              <div key={b.id} className="card">
                <h3 className="text-sm font-semibold mb-1">{b.titulo}</h3>
                <span className="text-xs text-ink-soft block mb-2">
                  {b.autor} · {b.anio}
                </span>
                {b.pdfUrl && (
                  <a href={b.pdfUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-cyan">
                    📄 Descargar PDF
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
