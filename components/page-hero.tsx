import { Breadcrumbs } from "./site-shell";

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
}: {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
}) {
  return (
    <header className="page-hero">
      <div className="site-container page-hero-inner">
        <Breadcrumbs items={breadcrumbs} />
        <p className="eyebrow eyebrow-light">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </header>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <span aria-hidden="true">○</span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  );
}

