import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAuthorizedAdminEmail } from "@/lib/admin-api-auth";
import { buildGalleryValues, getTextValue, GALLERY_BUCKET } from "@/lib/gallery-admin";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const adminSupabase = getSupabaseAdminClient();

  if (!adminSupabase) {
    return NextResponse.json({ error: "Supabase is not configured yet." }, { status: 500 });
  }

  const adminEmail = await getAuthorizedAdminEmail(request);
  if (!adminEmail) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

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

  if (!projectSlug || !category || imagePaths.length === 0 || !fileName) {
    return NextResponse.json({ error: "Gallery item information is incomplete." }, { status: 400 });
  }

  const { finalTitle, finalDescription, finalImageAlt } = buildGalleryValues({
    title,
    category,
    description,
    imageAlt,
    fileName,
  });

  const { data: latestProject } = await adminSupabase
    .from("gallery_items")
    .select("project_position")
    .order("project_position", { ascending: false })
    .limit(1)
    .maybeSingle<{ project_position: number | null }>();
  const projectPosition = (latestProject?.project_position ?? -1) + 1;

  const { error } = await adminSupabase.from("gallery_items").insert(
    imagePaths.map((imagePath, index) => ({
      project_slug: projectSlug,
      title: finalTitle,
      category,
      description: finalDescription,
      image_path: imagePath,
      image_position: index,
      project_position: projectPosition,
      image_alt: finalImageAlt,
      published: true,
    })),
  );

  if (error) {
    await adminSupabase.storage.from(GALLERY_BUCKET).remove(imagePaths);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin");

  return NextResponse.json({ success: "Gallery project saved.", adminEmail });
}
