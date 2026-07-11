"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigationLinks } from "@/content/site-content";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Lock body scroll while the mobile menu sheet is open
  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

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
            <span>Jacksonville, NC</span>
          </span>
        </Link>

        <button
          type="button"
          className="site-nav__toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span className="site-nav__toggle-bar" aria-hidden="true" />
          <span className="site-nav__toggle-bar" aria-hidden="true" />
          <span className="site-nav__toggle-bar" aria-hidden="true" />
          <span className="site-nav__label">{menuOpen ? "Close menu" : "Open menu"}</span>
        </button>

        <nav
          id="mobile-navigation"
          className={`site-nav ${menuOpen ? "site-nav--open" : ""}`}
          aria-label="Primary"
        >
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="site-nav__link"
              aria-current={pathname === link.href ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="button button--primary site-nav__cta"
            onClick={() => setMenuOpen(false)}
          >
            Request a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
