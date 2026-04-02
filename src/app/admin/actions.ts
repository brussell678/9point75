"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { GALLERY_BUCKET } from "@/lib/gallery-admin";
import type { QuoteRequestRecord } from "@/lib/leads";

function getTextValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function updateLeadStatus(formData: FormData) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return;
  }

  const id = getTextValue(formData, "id");
  const status = getTextValue(formData, "status") as QuoteRequestRecord["status"];

  if (!id || !status) {
    return;
  }

  await supabase.from("quote_requests").update({ status }).eq("id", id);
  revalidatePath("/admin");
}

export async function toggleGalleryPublished(formData: FormData) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return;
  }

  const projectSlug = getTextValue(formData, "projectSlug");
  const published = getTextValue(formData, "published") === "true";

  if (!projectSlug) {
    return;
  }

  await supabase.from("gallery_items").update({ published: !published }).eq("project_slug", projectSlug);

  revalidatePath("/gallery");
  revalidatePath("/admin");
}

export async function deleteGalleryItem(formData: FormData) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return;
  }

  const projectSlug = getTextValue(formData, "projectSlug");

  if (!projectSlug) {
    return;
  }

  const { data } = await supabase
    .from("gallery_items")
    .select("image_path")
    .eq("project_slug", projectSlug)
    .returns<Array<{ image_path: string | null }>>();

  const imagePaths = (data || [])
    .flatMap((item) => (item.image_path ? [item.image_path] : []));

  if (imagePaths.length > 0) {
    await supabase.storage.from(GALLERY_BUCKET).remove(imagePaths);
  }

  await supabase.from("gallery_items").delete().eq("project_slug", projectSlug);

  revalidatePath("/gallery");
  revalidatePath("/admin");
}
