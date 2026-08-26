import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="py-16 text-center text-ink-soft">
      <b className="block text-ink text-base mb-1.5">Página no encontrada</b>
      Volvé al{' '}
      <Link to="/" className="text-cyan font-semibold">
        inicio
      </Link>
      .
    </div>
  );
}
