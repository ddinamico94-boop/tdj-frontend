import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  unidadesResource,
  bibliografiaResource,
  materialesResource,
  novedadesResource,
  triviasResource,
  preguntasResource,
  enlacesResource,
} from '@/services/adminService';

const STAT_DEFS = [
  { label: 'Unidades', to: '/admin/unidades', resource: unidadesResource },
  { label: 'Bibliografía', to: '/admin/bibliografia', resource: bibliografiaResource },
  { label: 'Material', to: '/admin/material', resource: materialesResource },
  { label: 'Novedades', to: '/admin/novedades', resource: novedadesResource },
  { label: 'Trivias', to: '/admin/trivias', resource: triviasResource },
  { label: 'Preguntas', to: '/admin/preguntas', resource: preguntasResource },
  { label: 'Enlaces', to: '/admin/enlaces', resource: enlacesResource },
];

export default function Dashboard() {
  const [counts, setCounts] = useState<number[] | null>(null);

  useEffect(() => {
    Promise.all(STAT_DEFS.map((s) => s.resource.getAll().then((list) => list.length))).then(setCounts);
  }, []);

  return (
    <div>
      <h1 className="text-xl font-display font-semibold mb-1">Panel administrativo</h1>
      <p className="text-ink-soft text-sm mb-6">
        Todo lo que ves acá se refleja de inmediato en el sitio público — no hace falta tocar código.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {STAT_DEFS.map((s, i) => (
          <Link key={s.label} to={s.to} className="card">
            <b className="text-2xl font-display block mb-1">{counts ? counts[i] : '—'}</b>
            <span className="text-xs text-ink-soft">{s.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
