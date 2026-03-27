import Link from "next/link";
import { adminFeatures } from "@/content/site-content";
import { hasSupabaseEnv } from "@/lib/supabase/browser";

export function AdminPreview() {
  const configured = hasSupabaseEnv();

  return (
    <section className="admin-preview">
      <div className="admin-preview__card">
        <p className="section-heading__eyebrow">Protected admin</p>
        <h2>Owner dashboard foundation</h2>
        <p>
          This project is set up for a static public site plus a protected admin area for one business owner.
        </p>

        <ul className="check-list">
          {adminFeatures.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>

        <div className="admin-preview__status">
          <span className={configured ? "status-pill status-pill--ready" : "status-pill"}>
            {configured ? "Supabase env detected" : "Supabase env still needed"}
          </span>
          <Link href="/admin" className="button button--secondary">
            View Admin Route
          </Link>
        </div>
      </div>
    </section>
  );
}
