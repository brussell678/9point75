import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminTabs } from "@/components/admin-tabs";
import { GalleryManager } from "@/components/gallery-manager";
import { getGalleryAdminItems } from "@/lib/cms";
import { getMissingEnvVars } from "@/lib/env";
import type { AdminQuoteRequestRecord, QuoteRequestRecord } from "@/lib/leads";
import { signOutOwner } from "@/app/sign-in/actions";
import { isAuthorizedAdmin } from "@/lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Shop Office",
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
      <section className="admin-shell">
        <div className="shell admin-route">
          <div className="admin-route__intro">
            <p className="section-heading__eyebrow">Shop office</p>
            <h1>The dashboard isn&apos;t connected yet</h1>
            <p>
              A few connection settings are missing on the server, so sign-in and quote tracking are
              turned off for the moment. This is a setup task for whoever manages the website — no
              action needed from the shop.
            </p>
          </div>

          <div className="admin-help">
            <p>
              <strong>For the site manager:</strong> add these environment variables in Vercel, then
              redeploy:
            </p>
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

  const [leads, galleryItems] = await Promise.all([getQuoteRequests(), getGalleryAdminItems()]);
  const newLeadCount = leads.filter((lead) => lead.status === "new").length;

  return (
    <section className="admin-shell">
      <div className="shell">
        <div className="admin-header">
          <div>
            <p className="section-heading__eyebrow">Shop office</p>
            <h1>Welcome back.</h1>
            <p className="admin-header__sub">
              {newLeadCount > 0
                ? `You have ${newLeadCount} new quote ${newLeadCount === 1 ? "request" : "requests"} waiting.`
                : "No new quote requests right now — the gallery could always use a fresh project photo."}
            </p>
          </div>
          <div className="admin-header__actions">
            <Link href="/" className="button button--secondary">
              View Website
            </Link>
            <form action={signOutOwner}>
              <button type="submit" className="button button--secondary">
                Sign Out
              </button>
            </form>
          </div>
        </div>

        <AdminTabs
          leadCount={newLeadCount}
          leadsPanel={<AdminDashboard leads={leads} attachmentsEnabled />}
          galleryPanel={<GalleryManager items={galleryItems} />}
        />
      </div>
    </section>
  );
}
