import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/auth";
import {
  buildGalleryImagePath,
  getTextValue,
  GALLERY_BUCKET,
} from "@/lib/gallery-admin";
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
    fileName?: string;
  };

  const title = getTextValue(body.title ?? "");
  const category = getTextValue(body.category ?? "");
  const fileName = getTextValue(body.fileName ?? "");

  if (!category || !fileName) {
    return NextResponse.json({ error: "Missing upload details." }, { status: 400 });
  }

  const path = buildGalleryImagePath(fileName, title, category);
  const { data, error } = await adminSupabase.storage
    .from(GALLERY_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data?.token) {
    return NextResponse.json({ error: error?.message || "Unable to prepare image upload." }, { status: 500 });
  }

  return NextResponse.json({
    path,
    token: data.token,
  });
}
