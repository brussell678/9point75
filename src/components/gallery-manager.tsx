import Image from "next/image";
import {
  createGalleryItem,
  deleteGalleryItem,
  toggleGalleryPublished,
} from "@/app/admin/actions";
import { galleryCategories } from "@/content/site-content";
import type { GalleryAdminItem } from "@/lib/cms";

type GalleryManagerProps = {
  items: GalleryAdminItem[];
};

export function GalleryManager({ items }: GalleryManagerProps) {
  return (
    <section className="admin-stack">
      <div className="admin-panel">
        <div className="admin-panel__header">
          <p className="section-heading__eyebrow">Gallery manager</p>
          <h2>Add a gallery item</h2>
        </div>

        <form action={createGalleryItem} className="admin-form">
          <label>
            Title
            <input type="text" name="title" required />
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
            <textarea name="description" rows={4} required />
          </label>

          <label>
            Image alt text
            <input type="text" name="imageAlt" required />
          </label>

          <label>
            Thumbnail image
            <input type="file" name="image" accept="image/*" />
          </label>

          <button type="submit" className="button button--primary">
            Save Gallery Item
          </button>
        </form>
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
                  <Image
                    src={item.image_url}
                    alt={item.image_alt}
                    width={240}
                    height={180}
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
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
