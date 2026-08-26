import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentService } from '@/services/contentService';
import type { Trivia } from '@/types';
import { Breadcrumb, SectionHead } from '@/components/Common';

export default function TriviaHome() {
  const [trivias, setTrivias] = useState<Trivia[]>([]);

  useEffect(() => {
    contentService.getTrivias().then(setTrivias);
  }, []);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Trivia' }]} />
      <SectionHead title="Trivias disponibles" />
      <div className="grid md:grid-cols-3 gap-3.5">
        {trivias.map((t) => (
          <div key={t.id} className="rounded-[20px] p-5 bg-ink text-white relative overflow-hidden">
            <div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(circle at 90% 10%, rgba(255,138,209,.3), transparent 50%)' }}
            />
            <div className="relative">
              <h3 className="text-[16px] font-semibold mb-1.5">{t.nombre}</h3>
              <p className="text-[12.5px] text-gray-300 mb-3.5">{t.descripcion}</p>
              <div className="flex gap-2 text-[11px] text-gray-300 mb-4">
                <span className="font-mono">{t.cantidadPreguntas} preguntas</span>
                <span>·</span>
                <span className="font-mono">
                  {t.unidadesIds.length} unidad{t.unidadesIds.length > 1 ? 'es' : ''}
                </span>
              </div>
              <Link to={`/trivia/${t.id}`} className="btn btn-grad w-full justify-center">
                Comenzar →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
