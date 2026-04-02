import { NextResponse } from "next/server";
import { getAuthorizedAdminEmail } from "@/lib/admin-api-auth";
import {
  buildGalleryImagePath,
  getTextValue,
  GALLERY_BUCKET,
} from "@/lib/gallery-admin";
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
    title?: string;
    category?: string;
    fileName?: string;
    projectSlug?: string;
  };

  const title = getTextValue(body.title ?? "");
  const category = getTextValue(body.category ?? "");
  const fileName = getTextValue(body.fileName ?? "");
  const projectSlug = getTextValue(body.projectSlug ?? "");

  if (!category || !fileName) {
    return NextResponse.json({ error: "Missing upload details." }, { status: 400 });
  }

  const path = buildGalleryImagePath(fileName, title, category, projectSlug || undefined);
  const { data, error } = await adminSupabase.storage
    .from(GALLERY_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data?.token) {
    return NextResponse.json({ error: error?.message || "Unable to prepare image upload." }, { status: 500 });
  }

  return NextResponse.json({
    path,
    token: data.token,
    adminEmail,
  });
}
