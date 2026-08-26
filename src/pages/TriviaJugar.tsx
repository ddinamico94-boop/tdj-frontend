import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { contentService } from '@/services/contentService';
import type { Trivia, Pregunta } from '@/types';
import { useTriviaEngine } from '@/hooks/useTriviaEngine';
import { Empty } from '@/components/Common';

export default function TriviaJugar() {
  const { id } = useParams();
  const [trivia, setTrivia] = useState<Trivia | null | undefined>(undefined);
  const [pool, setPool] = useState<Pregunta[]>([]);
  const [playKey, setPlayKey] = useState(0); // fuerza reinicio del engine al "jugar de nuevo"

  useEffect(() => {
    contentService.getTrivias().then((all) => {
      const t = all.find((x) => x.id === id) ?? null;
      setTrivia(t);
      if (t) contentService.getPreguntasParaTrivia(t).then(setPool);
    });
  }, [id]);

  if (trivia === undefined) return null;
  if (trivia === null) return <Empty title="Trivia no encontrada" hint="Volvé al listado de trivias." />;
  if (pool.length === 0) return null;

  return <TriviaGame key={playKey} trivia={trivia} pool={pool} onReplay={() => setPlayKey((k) => k + 1)} />;
}

function TriviaGame({ trivia, pool, onReplay }: { trivia: Trivia; pool: Pregunta[]; onReplay: () => void }) {
  const engine = useTriviaEngine(trivia, pool);

  if (engine.finished) {
    const r = engine.resultado();
    let mensaje =
      r.porcentaje >= 80
        ? '¡Excelente! Dominás el tema.'
        : r.porcentaje >= 50
        ? 'Bien, pero podés repasar un poco más.'
        : 'Te conviene repasar esta unidad.';
    return (
      <div className="max-w-[420px] mx-auto text-center">
        <div
          className="w-[140px] h-[140px] rounded-full mx-auto mb-5 flex items-center justify-center"
          style={{ background: `conic-gradient(#1CDFE8 ${r.porcentaje}%, #E7E9EE 0)` }}
        >
          <div className="w-[112px] h-[112px] rounded-full bg-white flex flex-col items-center justify-center">
            <b className="text-[26px] font-display">{r.porcentaje}%</b>
            <span className="text-[11px] text-ink-soft">acierto</span>
          </div>
        </div>
        <h2 className="text-[20px] font-semibold mb-1.5">{mensaje}</h2>
        <p className="text-ink-soft text-[13.5px] mb-5">{trivia.nombre}</p>
        <div className="text-left">
          <Stat label="Puntuación" value={`${r.puntuacion} pts`} />
          <Stat label="Preguntas totales" value={r.totalPreguntas} />
          <Stat label="Correctas" value={r.correctas} color="text-green-600" />
          <Stat label="Incorrectas" value={r.incorrectas} color="text-red-600" />
          <Stat label="Tiempo utilizado" value={`${r.tiempoUtilizadoSeg}s`} />
        </div>
        <div className="flex gap-2.5 mt-6">
          <Link to="/trivia" className="btn btn-outline flex-1 justify-center">
            Volver
          </Link>
          <button className="btn btn-grad flex-1 justify-center" onClick={onReplay}>
            Jugar de nuevo
          </button>
        </div>
      </div>
    );
  }

  const q = engine.current;
  if (!q) return null;
  const pct = Math.round((engine.index / engine.total) * 100);

  return (
    <div>
      <div className="h-1.5 bg-line rounded-full overflow-hidden mb-5.5">
        <div className="h-full bg-brand-gradient transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="font-mono text-xs text-ink-soft">
          Pregunta {engine.index + 1} / {engine.total}
        </span>
        <span className="badge">{q.dificultad}</span>
      </div>
      <h2 className="text-[19px] leading-snug mb-5 font-display">{q.pregunta}</h2>
      <div>
        {q.opciones.map((op, i) => {
          let cls = 'block w-full text-left px-4 py-3.5 rounded-2xl border-[1.5px] font-medium text-[14.5px] mb-2.5 transition';
          if (engine.answered) {
            if (i === q.correcta) cls += ' border-green-500 bg-green-50';
            else if (i === engine.selected) cls += ' border-red-500 bg-red-50';
            else cls += ' border-line bg-white';
          } else {
            cls += ' border-line bg-white hover:border-cyan';
          }
          return (
            <button key={i} className={cls} disabled={engine.answered} onClick={() => engine.answer(i)}>
              {op}
            </button>
          );
        })}
      </div>
      {engine.answered && trivia.mostrarExplicacion && (
        <div className="card border-none bg-brand-gradient-soft mt-2">
          <p className="text-[13px] text-ink-soft mb-2.5">{q.explicacion}</p>
          <button className="btn btn-grad" onClick={engine.next}>
            {engine.index + 1 < engine.total ? 'Siguiente →' : 'Ver resultado →'}
          </button>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex justify-between py-3 border-b border-line text-sm">
      <span>{label}</span>
      <b className={color}>{value}</b>
    </div>
  );
}
