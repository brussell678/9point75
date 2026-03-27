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
        <p className="section-heading__eyebrow">Owner access</p>
        <h1>Owner sign in</h1>
        <p>
          Use the email and password created in Supabase Auth for the business owner account. Access is limited to the configured admin email.
        </p>
        <SignInForm next={next} />
      </div>
    </section>
  );
}
