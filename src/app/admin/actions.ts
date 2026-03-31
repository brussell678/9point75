"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { QuoteRequestRecord } from "@/lib/leads";

const GALLERY_BUCKET = "gallery-images";

function getTextValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getSafeBaseName(value: string) {
  return value
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uploadGalleryImage(file: File, title: string, category: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return null;
  }

  const safeBaseName = getSafeBaseName(title || file.name || category);
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const imagePath = `${Date.now()}-${safeBaseName || "gallery-item"}.${extension}`;

  const { error } = await supabase.storage.from(GALLERY_BUCKET).upload(imagePath, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    return null;
  }

  return imagePath;
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

  if (!category || !(file instanceof File) || file.size === 0) {
    return;
  }

  const safeBaseName = getSafeBaseName(title || file.name || category);
  const finalTitle = title || safeBaseName.replace(/-/g, " ") || category;
  const finalDescription = description || `Custom ${category.toLowerCase()} piece by 9point75 Woodworks.`;
  const finalImageAlt = imageAlt || finalTitle;
  const imagePath = await uploadGalleryImage(file, finalTitle, category);

  if (!imagePath) {
    return;
  }

  await supabase.from("gallery_items").insert({
    title: finalTitle,
    category,
    description: finalDescription,
    image_path: imagePath,
    image_alt: finalImageAlt,
    published: true,
  });

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin");
}

export async function updateGalleryItem(formData: FormData) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return;
  }

  const id = getTextValue(formData, "id");
  const currentImagePath = getTextValue(formData, "currentImagePath");
  const titleInput = getTextValue(formData, "title");
  const category = getTextValue(formData, "category");
  const descriptionInput = getTextValue(formData, "description");
  const imageAltInput = getTextValue(formData, "imageAlt");
  const file = formData.get("image");

  if (!id || !category) {
    return;
  }

  const finalTitle = titleInput || category;
  const finalDescription = descriptionInput || `Custom ${category.toLowerCase()} piece by 9point75 Woodworks.`;
  const finalImageAlt = imageAltInput || finalTitle;

  let imagePath = currentImagePath || null;

  if (file instanceof File && file.size > 0) {
    const uploadedPath = await uploadGalleryImage(file, finalTitle, category);

    if (uploadedPath) {
      imagePath = uploadedPath;

      if (currentImagePath) {
        await supabase.storage.from(GALLERY_BUCKET).remove([currentImagePath]);
      }
    }
  }

  await supabase
    .from("gallery_items")
    .update({
      title: finalTitle,
      category,
      description: finalDescription,
      image_alt: finalImageAlt,
      image_path: imagePath,
    })
    .eq("id", id);

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
