import type { Metadata } from "next";
import Link from "next/link";
import { adminFeatures } from "@/content/site-content";
import { hasSupabaseEnv } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Admin",
};

export default function AdminPage() {
  const configured = hasSupabaseEnv();

  return (
    <section className="page-hero">
      <div className="shell admin-route">
        <div className="admin-route__intro">
          <p className="section-heading__eyebrow">Admin route</p>
          <h1>Protected owner dashboard scaffold</h1>
          <p>
            This route is reserved for the business owner. In the next round, we can wire Supabase auth,
            lead statuses, gallery management, and content editing on top of this foundation.
          </p>
        </div>

        <div className="trust-card">
          <p className="section-heading__eyebrow">Current status</p>
          <p>{configured ? "Supabase environment variables are available." : "Supabase environment variables still need to be added to Vercel and local development."}</p>
          <ul className="check-list">
            {adminFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <div className="button-row">
            <Link href="/sign-in" className="button button--primary">
              Owner Sign In
            </Link>
            <Link href="/contact" className="button button--secondary">
              Review Public Form
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
