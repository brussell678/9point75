"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteGalleryItem,
  toggleGalleryPublished,
} from "@/app/admin/actions";
import { galleryCategories } from "@/content/site-content";
import {
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
    const file = formData.get("image");

    if (!category) {
      setError("Choose a gallery category.");
      setPending(false);
      return;
    }

    if (!(file instanceof File)) {
      setError("Choose an image to upload.");
      setPending(false);
      return;
    }

    const validationError = validateGalleryImage(file);
    if (validationError) {
      setError(validationError);
      setPending(false);
      return;
    }

    try {
      const { supabase, headers } = await getAdminAuthHeaders();

      const uploadResponse = await fetch("/api/admin/gallery/upload", {
        method: "POST",
        headers,
        body: JSON.stringify({
          title,
          category,
          fileName: file.name,
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

      const saveResponse = await fetch("/api/admin/gallery", {
        method: "POST",
        headers,
        body: JSON.stringify({
          title,
          category,
          description,
          imageAlt,
          imagePath: uploadPayload.path,
          fileName: file.name,
        }),
      });

      const savePayload = (await saveResponse.json()) as { error?: string; success?: string };
      if (!saveResponse.ok) {
        throw new Error(savePayload.error || "Unable to save gallery item.");
      }

      setSuccess(savePayload.success || "Gallery item saved.");
      form.reset();
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong while uploading the gallery image.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <label>
        Title
        <input type="text" name="title" placeholder="Optional" />
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
        Thumbnail image
        <input type="file" name="image" accept="image/*" required />
      </label>

      <p>Upload JPG, PNG, or WebP images up to 10 MB.</p>
      {error ? <p className="form-error">{error}</p> : null}
      {success ? <p className="form-success">{success}</p> : null}
      <button type="submit" className="button button--primary" disabled={pending}>
        {pending ? "Saving..." : "Save Gallery Item"}
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
    const currentImagePath = getTextValue(formData.get("currentImagePath"));
    const file = formData.get("image");

    let imagePath = "";
    let fileName = currentImagePath;

      if (file instanceof File && file.size > 0) {
      const validationError = validateGalleryImage(file);
      if (validationError) {
        setError(validationError);
        setPending(false);
        return;
      }

      try {
        const { supabase, headers } = await getAdminAuthHeaders();

        const uploadResponse = await fetch("/api/admin/gallery/upload", {
          method: "POST",
          headers,
          body: JSON.stringify({
            title,
            category,
            fileName: file.name,
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

        imagePath = uploadPayload.path;
        fileName = file.name;
      } catch (submissionError) {
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : "Something went wrong while uploading the gallery image.",
        );
        setPending(false);
        return;
      }
    }

    try {
      const { headers } = await getAdminAuthHeaders();

      const response = await fetch(`/api/admin/gallery/${item.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          title,
          category,
          description,
          imageAlt,
          imagePath,
          currentImagePath,
          fileName,
        }),
      });

      const payload = (await response.json()) as { error?: string; success?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Unable to update gallery item.");
      }

      setSuccess(payload.success || "Gallery item updated.");
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong while updating the gallery item.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form admin-form--compact">
      <input type="hidden" name="id" value={item.id} />
      <input type="hidden" name="currentImagePath" value={item.image_path || ""} />

      <label>
        Title
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
        Replace image
        <input type="file" name="image" accept="image/*" />
      </label>

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
          <h2>Add a gallery item</h2>
        </div>

        <CreateGalleryForm />
      </div>

      <div className="admin-panel">
        <div className="admin-panel__header">
          <p className="section-heading__eyebrow">Current gallery</p>
          <h2>Manage existing items</h2>
        </div>

        {items.length === 0 ? (
          <p className="admin-empty-copy">No gallery items have been added yet.</p>
        ) : (
          <div className="gallery-admin-list">
            {items.map((item) => (
              <article key={item.id} className="gallery-admin-card">
                <div className="gallery-admin-card__media">
                  {/* Admin previews use direct Supabase URLs, so a plain image keeps them reliable without extra remote config. */}
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
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="gallery-admin-card__actions">
                    <form action={toggleGalleryPublished}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="published" value={String(item.published)} />
                      <button type="submit" className="button button--secondary">
                        {item.published ? "Hide Item" : "Publish Item"}
                      </button>
                    </form>
                    <form action={deleteGalleryItem}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="imagePath" value={item.image_path || ""} />
                      <button type="submit" className="button button--secondary">
                        Delete Item
                      </button>
                    </form>
                  </div>
                  <details className="gallery-admin-card__editor">
                    <summary>Edit item</summary>
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
