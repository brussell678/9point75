import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAuthorizedAdminEmail } from "@/lib/admin-api-auth";
import { buildGalleryValues, getTextValue, GALLERY_BUCKET } from "@/lib/gallery-admin";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const adminSupabase = getSupabaseAdminClient();

  if (!adminSupabase) {
    return NextResponse.json({ error: "Supabase is not configured yet." }, { status: 500 });
  }

  const adminEmail = await getAuthorizedAdminEmail(request);
  if (!adminEmail) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as {
    projectSlug?: string;
    title?: string;
    category?: string;
    description?: string;
    imageAlt?: string;
    imagePaths?: string[];
    fileNames?: string[];
  };

  const projectSlug = getTextValue(body.projectSlug ?? "");
  const title = getTextValue(body.title ?? "");
  const category = getTextValue(body.category ?? "");
  const description = getTextValue(body.description ?? "");
  const imageAlt = getTextValue(body.imageAlt ?? "");
  const imagePaths = Array.isArray(body.imagePaths)
    ? body.imagePaths.map((path) => getTextValue(path)).filter(Boolean)
    : [];
  const fileName = Array.isArray(body.fileNames) ? getTextValue(body.fileNames[0] ?? "") : "";

  if (!id || !projectSlug || !category) {
    return NextResponse.json({ error: "Gallery item information is incomplete." }, { status: 400 });
  }

  const { finalTitle, finalDescription, finalImageAlt } = buildGalleryValues({
    title,
    category,
    description,
    imageAlt,
    fileName: fileName || title || category,
  });

  const { data: existingProject, error: existingProjectError } = await adminSupabase
    .from("gallery_items")
    .select("published, image_position, project_position")
    .eq("project_slug", projectSlug)
    .order("image_position", { ascending: false });

  if (existingProjectError || !existingProject || existingProject.length === 0) {
    if (imagePaths.length > 0) {
      await adminSupabase.storage.from(GALLERY_BUCKET).remove(imagePaths);
    }

    return NextResponse.json({ error: "Gallery project could not be found." }, { status: 404 });
  }

  const { error } = await adminSupabase
    .from("gallery_items")
    .update({
      title: finalTitle,
      category,
      description: finalDescription,
      image_alt: finalImageAlt,
    })
    .eq("project_slug", projectSlug);

  if (error) {
    if (imagePaths.length > 0) {
      await adminSupabase.storage.from(GALLERY_BUCKET).remove(imagePaths);
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (imagePaths.length > 0) {
    const nextImagePosition = (existingProject[0]?.image_position ?? -1) + 1;
    const projectPosition = existingProject[0]?.project_position ?? 0;
    const published = existingProject[0]?.published ?? true;

    const { error: insertError } = await adminSupabase.from("gallery_items").insert(
      imagePaths.map((imagePath, index) => ({
        project_slug: projectSlug,
        title: finalTitle,
        category,
        description: finalDescription,
        image_path: imagePath,
        image_position: nextImagePosition + index,
        project_position: projectPosition,
        image_alt: finalImageAlt,
        published,
      })),
    );

    if (insertError) {
      await adminSupabase.storage.from(GALLERY_BUCKET).remove(imagePaths);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  revalidatePath("/gallery");
  revalidatePath("/admin");

  return NextResponse.json({ success: "Gallery project updated.", adminEmail });
}
