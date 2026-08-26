import { Link } from 'react-router-dom';

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <div className="text-[13px] text-ink-soft mb-3.5">
      {items.map((it, i) => (
        <span key={i}>
          {it.to ? (
            <Link to={it.to} className="hover:text-ink">
              {it.label}
            </Link>
          ) : (
            <span>{it.label}</span>
          )}
          {i < items.length - 1 && ' / '}
        </span>
      ))}
    </div>
  );
}

export function SectionHead({ title, seeAllTo }: { title: string; seeAllTo?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4.5">
      <h2 className="text-[21px] font-display font-semibold">{title}</h2>
      {seeAllTo && (
        <Link to={seeAllTo} className="text-[13px] font-semibold text-ink-soft hover:text-ink">
          Ver todas →
        </Link>
      )}
    </div>
  );
}

export function Empty({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="col-span-full py-16 text-center text-ink-soft">
      <b className="block text-ink text-base mb-1.5">{title}</b>
      {hint && <span>{hint}</span>}
    </div>
  );
}
