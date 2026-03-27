import Image from "next/image";
import Link from "next/link";
import { navigationLinks } from "@/content/site-content";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link href="/" className="brand" aria-label="9point75 Woodworks home">
          <span className="brand__logo-wrap">
            <Image
              src="/brand/9point75_logo.jpg"
              alt="9point75 Woodworks logo"
              width={500}
              height={500}
              className="brand__logo"
              priority
            />
          </span>
          <span className="brand__text">
            <strong>9point75 Woodworks</strong>
            <span>Jacksonville, North Carolina</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {navigationLinks.map((link) => (
            <Link key={link.href} href={link.href} className="site-nav__link">
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="button button--primary site-nav__cta">
            Request a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
