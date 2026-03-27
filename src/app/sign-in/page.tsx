import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <section className="page-hero">
      <div className="shell sign-in-card">
        <p className="section-heading__eyebrow">Owner access</p>
        <h1>Sign-in UI placeholder</h1>
        <p>
          This route is reserved for the Supabase-authenticated owner login flow. It is intentionally visible now
          so the final product shape is easy to review before the backend wiring lands.
        </p>
      </div>
    </section>
  );
}
