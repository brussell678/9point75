import Image from "next/image";
import Link from "next/link";
import { contactDetails, navigationLinks, socialLinks } from "@/content/site-content";
import { servicePageLinks } from "@/lib/seo";

function SocialIcon({ label }: { label: string }) {
  if (label === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="social-link__icon">
        <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="social-link__icon">
      <path
        d="M13.5 21v-7h2.9l.5-3h-3.4V9.2c0-.9.3-1.5 1.6-1.5H17V5.1c-.3 0-1.2-.1-2.4-.1-2.4 0-4 1.5-4 4.3V11H8v3h2.6v7h2.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div className="footer-block">
          <div className="footer-brand">
            <Image
              src="/brand/9point75_logo.jpg"
              alt="9point75 Woodworks logo"
              width={500}
              height={500}
              className="footer-brand__logo"
            />
            <div>
              <p className="footer-eyebrow">9point75 Woodworks</p>
              <p className="footer-copy">
                Custom cabinetry, furniture, and specialty builds with a calm, client-first process.
              </p>
            </div>
          </div>
        </div>

        <div className="footer-block">
          <p className="footer-eyebrow">Navigate</p>
          <div className="footer-links">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="footer-block">
          <p className="footer-eyebrow">Services</p>
          <div className="footer-links">
            {servicePageLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
            <Link href="/contact">Request a Quote</Link>
          </div>
        </div>

        <div className="footer-block">
          <p className="footer-eyebrow">Contact</p>
          <div className="footer-links">
            <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
            <span>{contactDetails.location}</span>
            <span>{contactDetails.availability}</span>
          </div>
        </div>

        <div className="footer-block">
          <p className="footer-eyebrow">Social</p>
          <div className="footer-links">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="social-link"
                target="_blank"
                rel="noreferrer"
              >
                <SocialIcon label={link.label} />
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
