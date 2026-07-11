import type { Metadata } from "next";
import { SignInForm } from "@/components/sign-in-form";

export const metadata: Metadata = {
  title: "Sign In",
};

type SignInPageProps = {
  searchParams?: Promise<{ next?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const next = params?.next ?? "/admin";

  return (
    <section className="page-hero">
      <div className="shell sign-in-card">
        <p className="section-heading__eyebrow">Shop office</p>
        <h1>Owner sign-in</h1>
        <p>
          This area is for the shop owner. Sign in with your owner email and password to see quote
          requests and update the gallery.
        </p>
        <SignInForm next={next} />
      </div>
    </section>
  );
}
