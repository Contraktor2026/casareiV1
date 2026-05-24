type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="space-y-2">
      {eyebrow ? (
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-casarei-primary-dark">{eyebrow}</p>
      ) : null}
      <h1 className="font-serif text-3xl font-medium leading-tight text-casarei-primary-deep">{title}</h1>
      {description ? <p className="text-sm leading-6 text-casarei-text">{description}</p> : null}
    </header>
  );
}
