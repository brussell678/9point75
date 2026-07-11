type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
};

/**
 * Shared dark hero band for interior pages so the whole site carries the
 * same ink-and-crimson identity the home page establishes.
 */
export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="page-hero page-hero--dark">
      <div className="shell">
        <p className="hero__eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description ? <p className="hero__description">{description}</p> : null}
        {children}
      </div>
    </section>
  );
}
