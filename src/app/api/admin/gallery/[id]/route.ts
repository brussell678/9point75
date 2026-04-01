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
    title?: string;
    category?: string;
    description?: string;
    imageAlt?: string;
    imagePath?: string;
    currentImagePath?: string;
    fileName?: string;
  };

  const title = getTextValue(body.title ?? "");
  const category = getTextValue(body.category ?? "");
  const description = getTextValue(body.description ?? "");
  const imageAlt = getTextValue(body.imageAlt ?? "");
  const imagePath = getTextValue(body.imagePath ?? "");
  const currentImagePath = getTextValue(body.currentImagePath ?? "");
  const fileName = getTextValue(body.fileName ?? currentImagePath);

  if (!id || !category) {
    return NextResponse.json({ error: "Gallery item information is incomplete." }, { status: 400 });
  }

  const { finalTitle, finalDescription, finalImageAlt } = buildGalleryValues({
    title,
    category,
    description,
    imageAlt,
    fileName,
  });

  const nextImagePath = imagePath || currentImagePath || null;

  const { error } = await adminSupabase
    .from("gallery_items")
    .update({
      title: finalTitle,
      category,
      description: finalDescription,
      image_alt: finalImageAlt,
      image_path: nextImagePath,
    })
    .eq("id", id);

  if (error) {
    if (imagePath && imagePath !== currentImagePath) {
      await adminSupabase.storage.from(GALLERY_BUCKET).remove([imagePath]);
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (imagePath && currentImagePath && imagePath !== currentImagePath) {
    await adminSupabase.storage.from(GALLERY_BUCKET).remove([currentImagePath]);
  }

  revalidatePath("/gallery");
  revalidatePath("/admin");

  return NextResponse.json({ success: "Gallery item updated.", adminEmail });
}
