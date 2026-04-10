"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { GALLERY_BUCKET } from "@/lib/gallery-admin";
import type { QuoteRequestRecord } from "@/lib/leads";

const QUOTE_ATTACHMENT_BUCKET = "quote-request-files";

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

export async function deleteLead(formData: FormData) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return;
  }

  const id = getTextValue(formData, "id");

  if (!id) {
    return;
  }

  const { data } = await supabase
    .from("quote_requests")
    .select("attachment_paths")
    .eq("id", id)
    .single<{ attachment_paths: string[] | null }>();

  const attachmentPaths = data?.attachment_paths || [];

  if (attachmentPaths.length > 0) {
    await supabase.storage.from(QUOTE_ATTACHMENT_BUCKET).remove(attachmentPaths);
  }

  await supabase.from("quote_requests").delete().eq("id", id);
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

export async function moveGalleryItem(formData: FormData) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return;
  }

  const projectSlug = getTextValue(formData, "projectSlug");
  const direction = getTextValue(formData, "direction");

  if (!projectSlug || !["up", "down"].includes(direction)) {
    return;
  }

  const { data, error } = await supabase
    .from("gallery_items")
    .select("project_slug, title, category, created_at, project_position")
    .returns<Array<{
      project_slug: string | null;
      title: string;
      category: string;
      created_at: string;
      project_position: number | null;
    }>>();

  if (error || !data) {
    return;
  }

  const projects = Array.from(
    data.reduce((groupedProjects, item) => {
      const slug = item.project_slug;
      if (!slug || groupedProjects.has(slug)) {
        return groupedProjects;
      }

      groupedProjects.set(slug, {
        project_slug: slug,
        title: item.title,
        category: item.category,
        created_at: item.created_at,
        project_position: item.project_position ?? 0,
      });

      return groupedProjects;
    }, new Map<string, { project_slug: string; title: string; category: string; created_at: string; project_position: number }>()),
  ).map(([, project]) => project);

  projects.sort((left, right) => {
    if (left.project_position !== right.project_position) {
      return left.project_position - right.project_position;
    }

    const leftCreatedAt = new Date(left.created_at).getTime();
    const rightCreatedAt = new Date(right.created_at).getTime();

    if (leftCreatedAt !== rightCreatedAt) {
      return rightCreatedAt - leftCreatedAt;
    }

    return left.title.localeCompare(right.title);
  });

  const currentIndex = projects.findIndex((project) => project.project_slug === projectSlug);
  const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  const currentProject = projects[currentIndex];
  const swapProject = projects[swapIndex];

  if (!currentProject || !swapProject) {
    return;
  }

  projects[currentIndex] = swapProject;
  projects[swapIndex] = currentProject;

  await Promise.all(
    projects.map((project, index) =>
      supabase.from("gallery_items").update({ project_position: index }).eq("project_slug", project.project_slug),
    ),
  );

  revalidatePath("/");
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
