export const GALLERY_BUCKET = "gallery-images";
export const MAX_GALLERY_IMAGE_SIZE = 10 * 1024 * 1024;

export function getTextValue(value: FormDataEntryValue | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

export function getSafeBaseName(value: string) {
  return value
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function buildGalleryProjectKey(title: string, category: string) {
  return getSafeBaseName(`${category}-${title || "project"}`) || "gallery-project";
}

export function buildGalleryProjectSlug(title: string, category: string) {
  const base = buildGalleryProjectKey(title, category);
  return `${base}-${Date.now().toString(36)}`;
}

export function validateGalleryImage(file: File) {
  if (file.size === 0) {
    return "Choose an image to upload.";
  }

  if (!file.type.startsWith("image/")) {
    return "Only image files can be uploaded to the gallery.";
  }

  if (file.size > MAX_GALLERY_IMAGE_SIZE) {
    return "Image must be 10 MB or smaller.";
  }

  return null;
}

export function buildGalleryImagePath(
  fileName: string,
  title: string,
  category: string,
  projectSlug?: string,
) {
  const safeBaseName = getSafeBaseName(title || fileName || category);
  const extension = fileName.includes(".") ? fileName.split(".").pop() : "jpg";
  const imageName = `${Date.now()}-${safeBaseName || "gallery-item"}.${extension}`;

  if (!projectSlug) {
    return imageName;
  }

  return `${projectSlug}/${imageName}`;
}

export function buildGalleryValues({
  title,
  category,
  description,
  imageAlt,
  fileName,
}: {
  title: string;
  category: string;
  description: string;
  imageAlt: string;
  fileName: string;
}) {
  const safeBaseName = getSafeBaseName(title || fileName || category);
  const finalTitle = title || safeBaseName.replace(/-/g, " ") || category;

  return {
    finalTitle,
    finalDescription: description || `Custom ${category.toLowerCase()} piece by 9point75 Woodworks.`,
    finalImageAlt: imageAlt || finalTitle,
  };
}
