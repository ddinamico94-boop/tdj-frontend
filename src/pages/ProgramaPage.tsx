import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentService } from '@/services/contentService';
import type { Programa, Unidad } from '@/types';
import { Breadcrumb, SectionHead } from '@/components/Common';

export default function ProgramaPage() {
  const [programa, setPrograma] = useState<Programa | null>(null);
  const [unidades, setUnidades] = useState<Unidad[]>([]);

  useEffect(() => {
    contentService.getPrograma().then(setPrograma);
    contentService.getUnidades().then(setUnidades);
  }, []);

  if (!programa) return null;

  return (
    <div>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Programa' }]} />
      <h1 className="text-[26px] font-display font-semibold mb-3">{programa.titulo}</h1>
      <div className="prose-content max-w-[640px] mb-4" dangerouslySetInnerHTML={{ __html: programa.presentacion }} />

      {programa.pdfUrl && (
        <a
          href={programa.pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="btn btn-grad inline-flex mb-6"
        >
          📄 Descargar programa (PDF)
        </a>
      )}

      <SectionHead title="Objetivos" />
      <div className="grid md:grid-cols-3 gap-3.5 mb-8">
        {programa.objetivos.map((o, i) => (
          <div key={i} className="card text-sm">
            {o}
          </div>
        ))}
      </div>

      <SectionHead title="Contenidos por unidad" />
      <div className="grid md:grid-cols-3 gap-3.5">
        {unidades.map((u) => (
          <Link key={u.id} to={`/unidades/${u.id}`} className="card flex flex-col gap-2">
            <span className="font-mono text-xs font-semibold bg-brand-gradient bg-clip-text text-transparent">
              {u.numero}
            </span>
            <span className="text-[15px] font-semibold">{u.titulo}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
