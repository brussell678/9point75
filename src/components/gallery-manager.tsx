import { createGalleryItem } from "@/app/admin/actions";
import { galleryCategories } from "@/content/site-content";

export function GalleryManager() {
  return (
    <section className="admin-panel">
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
    </section>
  );
}
