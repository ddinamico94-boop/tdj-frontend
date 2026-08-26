import { useEffect, useMemo, useState } from 'react';
import { contentService } from '@/services/contentService';
import type { RecursoBibliografico, TipoBibliografia, Unidad } from '@/types';
import { Breadcrumb, SectionHead, Empty } from '@/components/Common';

export default function Bibliografia() {
  const [recursos, setRecursos] = useState<RecursoBibliografico[]>([]);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [tab, setTab] = useState<TipoBibliografia>('obligatoria');
  const [query, setQuery] = useState('');

  useEffect(() => {
    contentService.getBibliografia().then(setRecursos);
    contentService.getUnidades().then(setUnidades);
  }, []);

  const unidadNombre = (id?: number) => unidades.find((u) => u.id === id)?.titulo ?? '';

  const filtrados = useMemo(() => {
    const q = query.toLowerCase();
    return recursos
      .filter((r) => r.tipo === tab)
      .filter((r) => (r.titulo + r.autor).toLowerCase().includes(q))
      .sort((a, b) => a.orden - b.orden);
  }, [recursos, tab, query]);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Bibliografía' }]} />
      <SectionHead title="Bibliografía" />
      <input
        className="w-full px-3.5 py-3 rounded-xl border border-line text-sm outline-none focus:border-cyan"
        placeholder="Buscar por autor o título..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="flex gap-1.5 my-4.5 border-b border-line">
        {(['obligatoria', 'complementaria'] as TipoBibliografia[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2.5 mr-4 text-[13.5px] font-semibold border-b-2 ${
              tab === t ? 'text-ink border-cyan' : 'text-ink-soft border-transparent'
            }`}
          >
            {t === 'obligatoria' ? 'Obligatoria' : 'Complementaria'}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-3.5">
        {filtrados.length === 0 && <Empty title="Sin resultados" hint="Probá con otra búsqueda." />}
        {filtrados.map((b) => (
          <div key={b.id} className="card">
            <span className="badge">{unidadNombre(b.unidadId)}</span>
            <h3 className="text-[14.5px] font-semibold mt-2.5 mb-1">{b.titulo}</h3>
            <span className="text-xs text-ink-soft block mb-1.5">
              {b.autor} · {b.editorial} · {b.anio}
            </span>
            <p className="text-xs text-ink-soft m-0 mb-2">{b.descripcion}</p>
            <div className="flex gap-3 flex-wrap">
              {b.pdfUrl && (
                <a href={b.pdfUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-cyan">
                  📄 Descargar PDF
                </a>
              )}
              {b.linkExterno && (
                <a href={b.linkExterno} target="_blank" rel="noreferrer" className="text-xs font-semibold text-pink">
                  🔗 Ver enlace
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
