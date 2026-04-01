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

  const id = getTextValue(formData, "id");
  const published = getTextValue(formData, "published") === "true";

  if (!id) {
    return;
  }

  await supabase.from("gallery_items").update({ published: !published }).eq("id", id);

  revalidatePath("/gallery");
  revalidatePath("/admin");
}

export async function deleteGalleryItem(formData: FormData) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return;
  }

  const id = getTextValue(formData, "id");
  const imagePath = getTextValue(formData, "imagePath");

  if (!id) {
    return;
  }

  if (imagePath) {
    await supabase.storage.from(GALLERY_BUCKET).remove([imagePath]);
  }

  await supabase.from("gallery_items").delete().eq("id", id);

  revalidatePath("/gallery");
  revalidatePath("/admin");
}
