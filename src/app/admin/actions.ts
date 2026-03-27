"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { QuoteRequestRecord } from "@/lib/leads";

const GALLERY_BUCKET = "gallery-images";

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

export async function createGalleryItem(formData: FormData) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return;
  }

  const title = getTextValue(formData, "title");
  const category = getTextValue(formData, "category");
  const description = getTextValue(formData, "description");
  const imageAlt = getTextValue(formData, "imageAlt");
  const file = formData.get("image");

  if (!title || !category || !description || !imageAlt) {
    return;
  }

  let imagePath: string | null = null;

  if (file instanceof File && file.size > 0) {
    const extension = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    imagePath = `${Date.now()}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.${extension}`;
    await supabase.storage.from(GALLERY_BUCKET).upload(imagePath, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
  }

  await supabase.from("gallery_items").insert({
    title,
    category,
    description,
    image_path: imagePath,
    image_alt: imageAlt,
    published: true,
  });

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin");
}

export async function updateSiteContent(formData: FormData) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return;
  }

  const sectionKey = getTextValue(formData, "sectionKey");
  const heading = getTextValue(formData, "heading");
  const body = getTextValue(formData, "body");
  const payloadText = getTextValue(formData, "payload");

  let payload = {};

  if (payloadText) {
    try {
      payload = JSON.parse(payloadText);
    } catch {
      payload = {};
    }
  }

  await supabase.from("site_content").upsert({
    section_key: sectionKey,
    heading,
    body,
    payload,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin");
}
