import { useMemo, useRef, useState } from 'react';
import type { Pregunta, Trivia, ResultadoTrivia } from '@/types';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function useTriviaEngine(trivia: Trivia, pool: Pregunta[]) {
  const preguntas = useMemo(() => {
    const base = trivia.ordenAleatorio ? shuffle(pool) : pool;
    return base.slice(0, trivia.cantidadPreguntas);
  }, [trivia, pool]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctas, setCorrectas] = useState(0);
  const [incorrectas, setIncorrectas] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const startedAt = useRef(Date.now());

  const current = preguntas[index];
  const total = preguntas.length;

  function answer(optionIndex: number) {
    if (answered || !current) return;
    setAnswered(true);
    setSelected(optionIndex);
    if (optionIndex === current.correcta) {
      setScore((s) => s + 10);
      setCorrectas((c) => c + 1);
    } else {
      setIncorrectas((c) => c + 1);
    }
  }

  function next() {
    if (index + 1 >= total) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setAnswered(false);
    setSelected(null);
  }

  function resultado(): ResultadoTrivia {
    const tiempoUtilizadoSeg = Math.round((Date.now() - startedAt.current) / 1000);
    return {
      triviaId: trivia.id,
      puntuacion: score,
      totalPreguntas: total,
      correctas,
      incorrectas,
      porcentaje: total ? Math.round((correctas / total) * 100) : 0,
      tiempoUtilizadoSeg,
    };
  }

  return { preguntas, current, index, total, selected, answered, answer, next, finished, resultado };
}
