import Image from "next/image";
import Link from "next/link";
import { contactDetails, navigationLinks, socialLinks } from "@/content/site-content";

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
              <a key={link.label} href={link.href} aria-disabled={link.href === "#"}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
