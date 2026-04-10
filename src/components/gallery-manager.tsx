"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteGalleryItem, moveGalleryItem, toggleGalleryPublished } from "@/app/admin/actions";
import { galleryCategories } from "@/content/site-content";
import {
  buildGalleryProjectSlug,
  getTextValue,
  validateGalleryImage,
  GALLERY_BUCKET,
} from "@/lib/gallery-admin";
import type { GalleryAdminItem } from "@/lib/cms";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type GalleryManagerProps = {
  items: GalleryAdminItem[];
};

async function getAdminAuthHeaders() {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Your admin session has expired. Please sign in again.");
  }

  return {
    supabase,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
  };
}

async function uploadGalleryFiles({
  files,
  title,
  category,
  projectSlug,
}: {
  files: File[];
  title: string;
  category: string;
  projectSlug: string;
}) {
  const { supabase, headers } = await getAdminAuthHeaders();

  const uploadResults = await Promise.all(
    files.map(async (file) => {
      const uploadResponse = await fetch("/api/admin/gallery/upload", {
        method: "POST",
        headers,
        body: JSON.stringify({
          title,
          category,
          fileName: file.name,
          projectSlug,
        }),
      });

      const uploadPayload = (await uploadResponse.json()) as { error?: string; path?: string; token?: string };
      if (!uploadResponse.ok || !uploadPayload.path || !uploadPayload.token) {
        throw new Error(uploadPayload.error || "Unable to prepare image upload.");
      }

      const { error: uploadError } = await supabase.storage
        .from(GALLERY_BUCKET)
        .uploadToSignedUrl(uploadPayload.path, uploadPayload.token, file, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      return {
        path: uploadPayload.path,
        fileName: file.name,
      };
    }),
  );

  return {
    headers,
    uploads: uploadResults,
  };
}

function CreateGalleryForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = getTextValue(formData.get("title"));
    const category = getTextValue(formData.get("category"));
    const description = getTextValue(formData.get("description"));
    const imageAlt = getTextValue(formData.get("imageAlt"));
    const files = formData
      .getAll("images")
      .filter((value): value is File => value instanceof File && value.size > 0);

    if (!category) {
      setError("Choose a gallery category.");
      setPending(false);
      return;
    }

    if (files.length === 0) {
      setError("Choose at least one image to upload.");
      setPending(false);
      return;
    }

    const validationError = files.map((file) => validateGalleryImage(file)).find(Boolean);
    if (validationError) {
      setError(validationError);
      setPending(false);
      return;
    }

    const projectSlug = buildGalleryProjectSlug(title, category);

    try {
      const { headers, uploads } = await uploadGalleryFiles({
        files,
        title,
        category,
        projectSlug,
      });

      const saveResponse = await fetch("/api/admin/gallery", {
        method: "POST",
        headers,
        body: JSON.stringify({
          projectSlug,
          title,
          category,
          description,
          imageAlt,
          imagePaths: uploads.map((upload) => upload.path),
          fileNames: uploads.map((upload) => upload.fileName),
        }),
      });

      const savePayload = (await saveResponse.json()) as { error?: string; success?: string };
      if (!saveResponse.ok) {
        throw new Error(savePayload.error || "Unable to save gallery project.");
      }

      setSuccess(savePayload.success || "Gallery project saved.");
      form.reset();
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong while uploading the gallery project.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <label>
        Project title
        <input type="text" name="title" placeholder="Example: White Oak Twin Bed w/ Trundle" />
      </label>

      <label>
        Category
        <select name="category" defaultValue="" required>
          <option value="" disabled>
            Select a category
          </option>
          {galleryCategories
            .filter((category) => category !== "All")
            .map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
        </select>
      </label>

      <label>
        Description
        <textarea name="description" rows={4} placeholder="Optional" />
      </label>

      <label>
        Image alt text
        <input type="text" name="imageAlt" placeholder="Optional" />
      </label>

      <label>
        Project images
        <input type="file" name="images" accept="image/*" multiple required />
      </label>

      <p>Upload one or more JPG, PNG, or WebP images up to 10 MB each. The first image becomes the gallery tile cover.</p>
      {error ? <p className="form-error">{error}</p> : null}
      {success ? <p className="form-success">{success}</p> : null}
      <button type="submit" className="button button--primary" disabled={pending}>
        {pending ? "Saving..." : "Save Gallery Project"}
      </button>
    </form>
  );
}

function GalleryEditForm({ item }: { item: GalleryAdminItem }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = getTextValue(formData.get("title"));
    const category = getTextValue(formData.get("category"));
    const description = getTextValue(formData.get("description"));
    const imageAlt = getTextValue(formData.get("imageAlt"));
    const files = formData
      .getAll("images")
      .filter((value): value is File => value instanceof File && value.size > 0);

    const validationError = files.map((file) => validateGalleryImage(file)).find(Boolean);
    if (validationError) {
      setError(validationError);
      setPending(false);
      return;
    }

    try {
      const uploads =
        files.length > 0
          ? await uploadGalleryFiles({
              files,
              title,
              category,
              projectSlug: item.project_slug,
            })
          : await getAdminAuthHeaders().then(({ headers }) => ({ headers, uploads: [] }));

      const response = await fetch(`/api/admin/gallery/${item.id}`, {
        method: "PATCH",
        headers: uploads.headers,
        body: JSON.stringify({
          projectSlug: item.project_slug,
          title,
          category,
          description,
          imageAlt,
          imagePaths: uploads.uploads.map((upload) => upload.path),
          fileNames: uploads.uploads.map((upload) => upload.fileName),
        }),
      });

      const payload = (await response.json()) as { error?: string; success?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Unable to update gallery project.");
      }

      setSuccess(payload.success || "Gallery project updated.");
      form.reset();
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong while updating the gallery project.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form admin-form--compact">
      <label>
        Project title
        <input type="text" name="title" defaultValue={item.title} />
      </label>

      <label>
        Category
        <select name="category" defaultValue={item.category} required>
          {galleryCategories
            .filter((category) => category !== "All")
            .map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
        </select>
      </label>

      <label>
        Description
        <textarea name="description" rows={3} defaultValue={item.description} />
      </label>

      <label>
        Image alt text
        <input type="text" name="imageAlt" defaultValue={item.image_alt} />
      </label>

      <label>
        Add more project images
        <input type="file" name="images" accept="image/*" multiple />
      </label>

      <div className="gallery-admin-card__thumbs">
        {item.images.map((image) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={image.id}
            src={image.url}
            alt={image.alt}
            className="gallery-admin-card__thumb"
          />
        ))}
      </div>

      {error ? <p className="form-error">{error}</p> : null}
      {success ? <p className="form-success">{success}</p> : null}
      <button type="submit" className="button button--primary" disabled={pending}>
        {pending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

export function GalleryManager({ items }: GalleryManagerProps) {
  return (
    <section className="admin-stack">
      <div className="admin-panel">
        <div className="admin-panel__header">
          <p className="section-heading__eyebrow">Gallery manager</p>
          <h2>Add a gallery project</h2>
        </div>

        <CreateGalleryForm />
      </div>

      <div className="admin-panel">
        <div className="admin-panel__header">
          <p className="section-heading__eyebrow">Current gallery</p>
          <h2>Manage existing projects</h2>
        </div>

        {items.length === 0 ? (
          <p className="admin-empty-copy">No gallery projects have been added yet.</p>
        ) : (
          <div className="gallery-admin-list">
            {items.map((item, index) => (
              <article key={item.project_slug} className="gallery-admin-card">
                <div className="gallery-admin-card__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image_url}
                    alt={item.image_alt}
                    className="gallery-admin-card__image"
                  />
                </div>
                <div className="gallery-admin-card__body">
                  <p className="section-heading__eyebrow">{item.category}</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="gallery-admin-card__meta">
                    <span className={item.published ? "status-pill status-pill--ready" : "status-pill"}>
                      {item.published ? "Published" : "Hidden"}
                    </span>
                    <span>Gallery position {index + 1}</span>
                    <span>{item.image_count} photos</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="gallery-admin-card__actions">
                    <form action={moveGalleryItem}>
                      <input type="hidden" name="projectSlug" value={item.project_slug} />
                      <input type="hidden" name="direction" value="up" />
                      <button type="submit" className="button button--secondary" disabled={index === 0}>
                        Move Up
                      </button>
                    </form>
                    <form action={moveGalleryItem}>
                      <input type="hidden" name="projectSlug" value={item.project_slug} />
                      <input type="hidden" name="direction" value="down" />
                      <button type="submit" className="button button--secondary" disabled={index === items.length - 1}>
                        Move Down
                      </button>
                    </form>
                    <form action={toggleGalleryPublished}>
                      <input type="hidden" name="projectSlug" value={item.project_slug} />
                      <input type="hidden" name="published" value={String(item.published)} />
                      <button type="submit" className="button button--secondary">
                        {item.published ? "Hide Project" : "Publish Project"}
                      </button>
                    </form>
                    <form action={deleteGalleryItem}>
                      <input type="hidden" name="projectSlug" value={item.project_slug} />
                      <button type="submit" className="button button--secondary">
                        Delete Project
                      </button>
                    </form>
                  </div>
                  <details className="gallery-admin-card__editor">
                    <summary>Edit project</summary>
                    <GalleryEditForm item={item} />
                  </details>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
