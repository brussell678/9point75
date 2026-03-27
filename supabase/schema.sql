create extension if not exists "pgcrypto";

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  email text not null,
  phone text,
  location text,
  project_type text,
  budget_range text,
  timeline text,
  measurements text,
  description text not null,
  attachment_paths text[] not null default '{}',
  status text not null default 'new' check (status in ('new', 'in_review', 'responded', 'closed'))
);

alter table public.quote_requests enable row level security;

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  category text not null,
  description text not null,
  image_path text,
  image_alt text not null,
  published boolean not null default true
);

alter table public.gallery_items enable row level security;

create table if not exists public.site_content (
  section_key text primary key,
  heading text not null default '',
  body text not null default '',
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

insert into storage.buckets (id, name, public)
values ('quote-request-files', 'quote-request-files', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('gallery-images', 'gallery-images', true)
on conflict (id) do nothing;

insert into public.site_content (section_key, heading, body, payload)
values
  (
    'hero',
    'Custom woodwork with a steady hand and a lived-in sense of craftsmanship.',
    '9point75 Woodworks creates tailored pieces for homes that want warmth, durability, and a finish that feels intentional from every angle.',
    jsonb_build_object(
      'eyebrow', 'Custom cabinetry, built-ins, and heirloom furniture',
      'primaryCtaLabel', 'Request a Quote',
      'primaryCtaHref', '/contact',
      'secondaryCtaLabel', 'View Featured Work',
      'secondaryCtaHref', '/gallery'
    )
  ),
  (
    'about_intro',
    'Craftsmanship without compromise, built around practical design and close communication.',
    '9point75 Woodworks was built around the idea that custom work should feel personal, durable, and thoughtfully made from the first conversation to the final walkthrough.',
    '{}'::jsonb
  ),
  (
    'about_story',
    'The story',
    'The shop is rooted in patience, problem-solving, and the satisfaction of building something with purpose. As the business grows from a serious craft into a dedicated service, the goal stays the same: create work that feels honest, useful, and worth keeping.',
    '{}'::jsonb
  ),
  (
    'about_philosophy',
    'The philosophy',
    'Each project is approached with close communication, practical design thinking, and a respect for materials that earn their character over time.',
    '{}'::jsonb
  )
on conflict (section_key) do nothing;
