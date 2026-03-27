import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { ContentEditor } from "@/components/content-editor";
import { GalleryManager } from "@/components/gallery-manager";
import { adminFeatures } from "@/content/site-content";
import { getSiteContentMap } from "@/lib/cms";
import { getMissingEnvVars } from "@/lib/env";
import type { QuoteRequestRecord } from "@/lib/leads";
import { signOutOwner } from "@/app/sign-in/actions";
import { isAuthorizedAdmin } from "@/lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin",
};

async function getQuoteRequests() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<QuoteRequestRecord[]>();

  if (error || !data) {
    return [];
  }

  return data;
}

export default async function AdminPage() {
  const missingEnvVars = getMissingEnvVars();

  if (missingEnvVars.length > 0) {
    return (
      <section className="page-hero">
        <div className="shell admin-route">
          <div className="admin-route__intro">
            <p className="section-heading__eyebrow">Admin route</p>
            <h1>Owner dashboard setup required</h1>
            <p>Add the missing environment variables before enabling sign-in and live lead management.</p>
          </div>

          <div className="trust-card">
            <ul className="check-list">
              {missingEnvVars.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    redirect("/sign-in");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAuthorizedAdmin(user?.email)) {
    redirect("/sign-in");
  }

  const leads = await getQuoteRequests();
  const contentMap = await getSiteContentMap();
  const configured = true;

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
          <div className="button-row">
            <Link href="/contact" className="button button--secondary">
              Review Public Form
            </Link>
            <form action={signOutOwner}>
              <button type="submit" className="button button--primary">
                Sign Out
              </button>
            </form>
          </div>
        </div>

        <div className="trust-card">
          <p className="section-heading__eyebrow">Current status</p>
          <p>
            {configured
              ? "Supabase environment variables are available."
              : "Supabase environment variables still need to be added to Vercel and local development."}
          </p>
          <ul className="check-list">
            {adminFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          {missingEnvVars.length > 0 ? (
            <ul className="check-list">
              {missingEnvVars.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="shell admin-route admin-route--stacked">
        <AdminDashboard leads={leads} attachmentsEnabled={configured} />
      </div>

      <div className="shell admin-grid">
        <ContentEditor
          sectionKey="hero"
          title="Homepage hero"
          heading={contentMap.hero?.heading || ""}
          body={contentMap.hero?.body || ""}
          payload={contentMap.hero?.payload || {}}
        />
        <ContentEditor
          sectionKey="about_intro"
          title="About intro"
          heading={contentMap.about_intro?.heading || ""}
          body={contentMap.about_intro?.body || ""}
          payload={contentMap.about_intro?.payload || {}}
        />
        <ContentEditor
          sectionKey="about_story"
          title="About story"
          heading={contentMap.about_story?.heading || ""}
          body={contentMap.about_story?.body || ""}
          payload={contentMap.about_story?.payload || {}}
        />
        <ContentEditor
          sectionKey="about_philosophy"
          title="About philosophy"
          heading={contentMap.about_philosophy?.heading || ""}
          body={contentMap.about_philosophy?.body || ""}
          payload={contentMap.about_philosophy?.payload || {}}
        />
        <GalleryManager />
      </div>
    </section>
  );
}
