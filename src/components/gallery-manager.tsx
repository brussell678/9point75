"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createGalleryItem,
  deleteGalleryItem,
  type GalleryActionState,
  toggleGalleryPublished,
  updateGalleryItem,
} from "@/app/admin/actions";
import { galleryCategories } from "@/content/site-content";
import type { GalleryAdminItem } from "@/lib/cms";

type GalleryManagerProps = {
  items: GalleryAdminItem[];
};

const initialActionState: GalleryActionState = {};

function GallerySubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="button button--primary" disabled={pending}>
      {pending ? "Saving..." : "Save Gallery Item"}
    </button>
  );
}

function GalleryUpdateButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="button button--primary" disabled={pending}>
      {pending ? "Saving..." : "Save Changes"}
    </button>
  );
}

function CreateGalleryForm() {
  const [state, formAction] = useActionState(createGalleryItem, initialActionState);

  return (
    <form action={formAction} className="admin-form">
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
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {state.success ? <p className="form-success">{state.success}</p> : null}
      <GallerySubmitButton />
    </form>
  );
}

function GalleryEditForm({ item }: { item: GalleryAdminItem }) {
  const [state, formAction] = useActionState(updateGalleryItem, initialActionState);

  return (
    <form action={formAction} className="admin-form admin-form--compact">
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

      {state.error ? <p className="form-error">{state.error}</p> : null}
      {state.success ? <p className="form-success">{state.success}</p> : null}
      <GalleryUpdateButton />
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
