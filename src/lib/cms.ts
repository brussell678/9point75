import {
  aboutSections,
  galleryItems,
  heroContent,
  type GalleryItem,
  type GalleryCategory,
} from "@/content/site-content";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type SiteContentRecord = {
  section_key: string;
  heading: string;
  body: string;
  payload: Record<string, string>;
};

type GalleryItemRecord = {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, "All">;
  description: string;
  image_path: string | null;
  image_alt: string;
  published: boolean;
  created_at: string;
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

  return data.map((item, index) => ({
    id: index + 1,
    title: item.title,
    category: item.category,
    description: item.description,
    image: getPublicGalleryUrl(item.image_path),
    alt: item.image_alt,
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
