import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { GalleryManager } from "@/components/gallery-manager";
import { adminFeatures } from "@/content/site-content";
import { getGalleryAdminItems } from "@/lib/cms";
import { getMissingEnvVars } from "@/lib/env";
import type { AdminQuoteRequestRecord, QuoteRequestRecord } from "@/lib/leads";
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

  const allPaths = data.flatMap((lead) => lead.attachment_paths);
  const signedUrlMap = new Map<string, string>();

  if (allPaths.length > 0) {
    const { data: signedUrls } = await supabase.storage
      .from("quote-request-files")
      .createSignedUrls(allPaths, 60 * 60);

    signedUrls?.forEach((item, index) => {
      const path = allPaths[index];
      if (path && item?.signedUrl) {
        signedUrlMap.set(path, item.signedUrl);
      }
    });
  }

  return data.map<AdminQuoteRequestRecord>((lead) => ({
    ...lead,
    attachments: lead.attachment_paths
      .map((path) => {
        const url = signedUrlMap.get(path);
        if (!url) {
          return null;
        }

        const name = path.split("/").pop() || "attachment";
        const lowerName = name.toLowerCase();
        const isImage = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"].some((extension) =>
          lowerName.endsWith(extension),
        );

        return {
          path,
          url,
          name,
          isImage,
        };
      })
      .filter((attachment) => attachment !== null),
  }));
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
  const galleryItems = await getGalleryAdminItems();
  const configured = true;

  return (
    <section className="page-hero">
      <div className="shell admin-route">
        <div className="admin-route__intro">
          <p className="section-heading__eyebrow">Admin route</p>
          <h1>Owner dashboard</h1>
          <p>
            Signed in with Supabase authentication. Use this space to track leads and keep the gallery current.
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

      <div className="shell admin-grid admin-grid--single">
        <GalleryManager items={galleryItems} />
      </div>
    </section>
  );
}
