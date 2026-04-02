import {
  aboutSections,
  galleryItems,
  heroContent,
  type GalleryItem,
  type GalleryCategory,
} from "@/content/site-content";
import { buildGalleryProjectKey } from "@/lib/gallery-admin";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type SiteContentRecord = {
  section_key: string;
  heading: string;
  body: string;
  payload: Record<string, string>;
};

type GalleryItemRecord = {
  id: string;
  project_slug: string | null;
  title: string;
  category: Exclude<GalleryCategory, "All">;
  description: string;
  image_path: string | null;
  image_position: number;
  image_alt: string;
  published: boolean;
  created_at: string;
};

type GalleryProjectImage = {
  id: string;
  path: string | null;
  url: string;
  alt: string;
  position: number;
  created_at: string;
};

export type GalleryAdminItem = {
  id: string;
  project_slug: string;
  title: string;
  category: Exclude<GalleryCategory, "All">;
  description: string;
  published: boolean;
  created_at: string;
  image_url: string;
  image_alt: string;
  image_count: number;
  image_paths: string[];
  images: GalleryProjectImage[];
};

const GALLERY_BUCKET = "gallery-images";

function getPublicGalleryUrl(path: string | null) {
  if (!path) {
    return "/placeholders/gallery.svg";
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return "/placeholders/gallery.svg";
  }

  const { data } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(path);
  return data.publicUrl || "/placeholders/gallery.svg";
}

function getProjectSlug(item: GalleryItemRecord) {
  return item.project_slug || buildGalleryProjectKey(item.title, item.category);
}

function groupGalleryRecords(items: GalleryItemRecord[]) {
  const projects = new Map<string, GalleryAdminItem>();

  items.forEach((item) => {
    const projectSlug = getProjectSlug(item);
    const imageUrl = getPublicGalleryUrl(item.image_path);
    const image: GalleryProjectImage = {
      id: item.id,
      path: item.image_path,
      url: imageUrl,
      alt: item.image_alt,
      position: item.image_position ?? 0,
      created_at: item.created_at,
    };

    const existing = projects.get(projectSlug);
    if (!existing) {
      projects.set(projectSlug, {
        id: item.id,
        project_slug: projectSlug,
        title: item.title,
        category: item.category,
        description: item.description,
        published: item.published,
        created_at: item.created_at,
        image_url: imageUrl,
        image_alt: item.image_alt,
        image_count: 1,
        image_paths: item.image_path ? [item.image_path] : [],
        images: [image],
      });
      return;
    }

    existing.images.push(image);
    existing.image_count += 1;
    if (item.image_path) {
      existing.image_paths.push(item.image_path);
    }

    if (new Date(item.created_at).getTime() > new Date(existing.created_at).getTime()) {
      existing.created_at = item.created_at;
    }
  });

  return Array.from(projects.values())
    .map((project) => {
      const sortedImages = [...project.images].sort((left, right) => {
        if (left.position !== right.position) {
          return left.position - right.position;
        }

        return new Date(left.created_at).getTime() - new Date(right.created_at).getTime();
      });

      const coverImage = sortedImages[0];

      return {
        ...project,
        image_url: coverImage?.url || "/placeholders/gallery.svg",
        image_alt: coverImage?.alt || project.title,
        image_paths: sortedImages.flatMap((image) => (image.path ? [image.path] : [])),
        images: sortedImages,
      };
    })
    .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime());
}

export async function getGalleryItemsFromCms(): Promise<GalleryItem[]> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return galleryItems;
  }

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .returns<GalleryItemRecord[]>();

  if (error || !data || data.length === 0) {
    return galleryItems;
  }

  const groupedItems = groupGalleryRecords(data);

  return groupedItems.map((item) => ({
    id: item.project_slug,
    title: item.title,
    category: item.category,
    description: item.description,
    image: item.image_url,
    alt: item.image_alt,
    images: item.images.map((image) => ({
      src: image.url,
      alt: image.alt,
    })),
  }));
}

export async function getHeroContentFromCms() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return heroContent;
  }

  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("section_key", "hero")
    .single<SiteContentRecord>();

  if (error || !data) {
    return heroContent;
  }

  return {
    eyebrow: data.payload.eyebrow || heroContent.eyebrow,
    title: data.heading || heroContent.title,
    description: data.body || heroContent.description,
    primaryCta: {
      href: data.payload.primaryCtaHref || heroContent.primaryCta.href,
      label: data.payload.primaryCtaLabel || heroContent.primaryCta.label,
    },
    secondaryCta: {
      href: data.payload.secondaryCtaHref || heroContent.secondaryCta.href,
      label: data.payload.secondaryCtaLabel || heroContent.secondaryCta.label,
    },
  };
}

export async function getAboutContentFromCms() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return aboutSections;
  }

  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .in("section_key", ["about_intro", "about_story", "about_philosophy"])
    .returns<SiteContentRecord[]>();

  if (error || !data) {
    return aboutSections;
  }

  const byKey = new Map(data.map((item) => [item.section_key, item]));

  return {
    intro: byKey.get("about_intro")?.body || aboutSections.intro,
    story: byKey.get("about_story")?.body || aboutSections.story,
    philosophy: byKey.get("about_philosophy")?.body || aboutSections.philosophy,
  };
}

export async function getSiteContentMap() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return {
      hero: {
        section_key: "hero",
        heading: heroContent.title,
        body: heroContent.description,
        payload: {
          eyebrow: heroContent.eyebrow,
          primaryCtaLabel: heroContent.primaryCta.label,
          primaryCtaHref: heroContent.primaryCta.href,
          secondaryCtaLabel: heroContent.secondaryCta.label,
          secondaryCtaHref: heroContent.secondaryCta.href,
        },
      },
      about_intro: {
        section_key: "about_intro",
        heading: "Craftsmanship without compromise, built around practical design and close communication.",
        body: aboutSections.intro,
        payload: {},
      },
      about_story: {
        section_key: "about_story",
        heading: "The story",
        body: aboutSections.story,
        payload: {},
      },
      about_philosophy: {
        section_key: "about_philosophy",
        heading: "The philosophy",
        body: aboutSections.philosophy,
        payload: {},
      },
    };
  }

  const { data } = await supabase.from("site_content").select("*").returns<SiteContentRecord[]>();
  const byKey = new Map((data || []).map((item) => [item.section_key, item]));

  return {
    hero: byKey.get("hero"),
    about_intro: byKey.get("about_intro"),
    about_story: byKey.get("about_story"),
    about_philosophy: byKey.get("about_philosophy"),
  };
}

export async function getGalleryAdminItems(): Promise<GalleryAdminItem[]> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<GalleryItemRecord[]>();

  if (error || !data) {
    return [];
  }

  return groupGalleryRecords(data);
}
