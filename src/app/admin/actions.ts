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
