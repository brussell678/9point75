import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/auth";
import { buildGalleryValues, getTextValue, GALLERY_BUCKET } from "@/lib/gallery-admin";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient();
  const adminSupabase = getSupabaseAdminClient();

  if (!supabase || !adminSupabase) {
    return NextResponse.json({ error: "Supabase is not configured yet." }, { status: 500 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAuthorizedAdmin(user?.email)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    category?: string;
    description?: string;
    imageAlt?: string;
    imagePath?: string;
    fileName?: string;
  };

  const title = getTextValue(body.title ?? "");
  const category = getTextValue(body.category ?? "");
  const description = getTextValue(body.description ?? "");
  const imageAlt = getTextValue(body.imageAlt ?? "");
  const imagePath = getTextValue(body.imagePath ?? "");
  const fileName = getTextValue(body.fileName ?? "");

  if (!category || !imagePath || !fileName) {
    return NextResponse.json({ error: "Gallery item information is incomplete." }, { status: 400 });
  }

  const { finalTitle, finalDescription, finalImageAlt } = buildGalleryValues({
    title,
    category,
    description,
    imageAlt,
    fileName,
  });

  const { error } = await adminSupabase.from("gallery_items").insert({
    title: finalTitle,
    category,
    description: finalDescription,
    image_path: imagePath,
    image_alt: finalImageAlt,
    published: true,
  });

  if (error) {
    await adminSupabase.storage.from(GALLERY_BUCKET).remove([imagePath]);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin");

  return NextResponse.json({ success: "Gallery item saved." });
}
