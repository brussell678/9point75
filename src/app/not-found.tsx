import Link from "next/link";
import { PageHero } from "@/components/page-hero";

export default function NotFound() {
  return (
    <>
      <PageHero
        eyebrow="404 — page not found"
        title="This one came up a quarter inch short."
        description="The page you're looking for doesn't exist — it may have been moved, renamed, or never built in the first place. The rest of the shop is right where it should be."
      />

      <section className="section">
        <div className="shell link-grid">
          <Link href="/" className="info-card info-card--linked">
            <p className="section-heading__eyebrow">Start over</p>
            <h3>Back to the home page</h3>
            <span className="info-card__arrow" aria-hidden="true">
              Home →
            </span>
          </Link>
          <Link href="/gallery" className="info-card info-card--linked">
            <p className="section-heading__eyebrow">Portfolio</p>
            <h3>See the work</h3>
            <span className="info-card__arrow" aria-hidden="true">
              Gallery →
            </span>
          </Link>
          <Link href="/about" className="info-card info-card--linked">
            <p className="section-heading__eyebrow">The shop</p>
            <h3>Meet the maker</h3>
            <span className="info-card__arrow" aria-hidden="true">
              About →
            </span>
          </Link>
          <Link href="/contact" className="info-card info-card--linked">
            <p className="section-heading__eyebrow">Start a project</p>
            <h3>Request a quote</h3>
            <span className="info-card__arrow" aria-hidden="true">
              Contact →
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
