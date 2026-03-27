"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendQuoteRequestNotification } from "@/lib/notifications";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { QuoteRequestInsert } from "@/lib/leads";

const ATTACHMENT_BUCKET = "quote-request-files";

export type QuoteFormState = {
  error?: string;
  success?: string;
};

function getTextValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function uploadAttachments(email: string, files: File[]) {
  const supabase = getSupabaseAdminClient();

  if (!supabase || files.length === 0) {
    return [];
  }

  const safeEmail = email.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const timestamp = Date.now();

  const uploads = await Promise.all(
    files.map(async (file, index) => {
      const extension = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
      const path = `${safeEmail}/${timestamp}-${index}.${extension}`;
      const { error } = await supabase.storage.from(ATTACHMENT_BUCKET).upload(path, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

      if (error) {
        throw new Error(error.message);
      }

      return path;
    }),
  );

  return uploads;
}

export async function submitQuoteRequest(
  _previousState: QuoteFormState,
  formData: FormData,
): Promise<QuoteFormState> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return {
      error: "Supabase is not configured yet. Add the environment variables before using the production form.",
    };
  }

  const email = getTextValue(formData, "email");
  const description = getTextValue(formData, "description");

  if (!email || !description) {
    return {
      error: "Email and project description are required.",
    };
  }

  try {
    const files = formData
      .getAll("files")
      .filter((value): value is File => value instanceof File && value.size > 0);

    const attachmentPaths = await uploadAttachments(email, files);

    const payload: QuoteRequestInsert = {
      name: getTextValue(formData, "name") || null,
      email,
      phone: getTextValue(formData, "phone") || null,
      location: getTextValue(formData, "location") || null,
      project_type: getTextValue(formData, "projectType") || null,
      budget_range: getTextValue(formData, "budgetRange") || null,
      timeline: getTextValue(formData, "timeline") || null,
      measurements: getTextValue(formData, "measurements") || null,
      description,
      attachment_paths: attachmentPaths,
      status: "new",
    };

    const { error } = await supabase.from("quote_requests").insert(payload);

    if (error) {
      return {
        error: error.message,
      };
    }

    try {
      await sendQuoteRequestNotification({
        name: payload.name,
        email: payload.email,
        projectType: payload.project_type,
        budgetRange: payload.budget_range,
        timeline: payload.timeline,
        description: payload.description,
      });
    } catch (notificationError) {
      console.error("Quote request notification failed", notificationError);
    }

    revalidatePath("/admin");
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong while saving your request. Please try again.",
    };
  }

  redirect("/contact?submitted=1");
}
