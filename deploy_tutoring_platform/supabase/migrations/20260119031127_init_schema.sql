-- Init schema for tutoring platform

-- Key-value store (used by existing edge function)
create table if not exists public.kv_store_f02ad0d4 (
  key text primary key,
  value jsonb not null
);

-- Skill demo videos (one clip per skill)
create table if not exists public.skill_videos (
  id bigserial primary key,
  skill_slug text unique not null,   -- e.g. 'ielts-reading', 'sat-math'
  title text not null,
  video_url text not null,           -- hosted mp4 or embed URL
  created_at timestamptz default now()
);
