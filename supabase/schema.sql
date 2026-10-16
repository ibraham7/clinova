-- Clinova visitor analytics and leads. Run once in Supabase: SQL Editor -> New query -> paste -> Run.
-- Only the site's Netlify functions write and read these tables, with the service role key.
-- Row level security is on with no policies, so the public (anon) key can read nothing.

create table if not exists public.events (
    id bigint generated always as identity primary key,
    ts timestamptz not null default now(),
    visitor text not null,          -- anonymous daily id: a keyed hash of IP + browser, changes every day, the IP is never stored
    page text not null,             -- random id of one page load
    type text not null,             -- page_view | section | scroll | page_end | click | survey
    path text,
    lang text,
    section text,                   -- section id on the page (services, faq, ...)
    target text,                    -- what was clicked, or the survey step
    value integer,                  -- milliseconds, scroll percent or step number, depending on type
    referrer text,                  -- referring host only, never the full URL
    source text,                    -- Google, ChatGPT, Instagram, Direct, ...
    channel text,                   -- search | ai | social | direct | referral | campaign | email
    utm_source text,
    utm_medium text,
    utm_campaign text,
    device text,                    -- mobile | tablet | desktop
    browser text,
    os text,
    screen integer,                 -- screen width in CSS pixels
    country text,                   -- ISO code from Netlify geolocation
    country_name text,
    region text,
    city text,
    timezone text
);
create index if not exists events_ts_idx on public.events (ts);
create index if not exists events_type_ts_idx on public.events (type, ts);

create table if not exists public.leads (
    id bigint generated always as identity primary key,
    ts timestamptz not null default now(),
    request_id uuid not null unique,
    purpose text not null,          -- company_profile_download | trial_survey
    contact_type text not null,     -- email | phone
    contact text not null,
    phone_country text,
    lang text,
    form_source text,               -- hero | contact_cta | survey
    consent boolean not null default false,
    answers jsonb,
    visitor text,                   -- same daily id as events, to link a lead to its visit
    country text,
    city text
);
create index if not exists leads_ts_idx on public.leads (ts);

create table if not exists public.admin_log (
    id bigint generated always as identity primary key,
    ts timestamptz not null default now(),
    action text not null,           -- texts | videos | logos | logo_upload
    summary text not null,
    details jsonb
);
create index if not exists admin_log_ts_idx on public.admin_log (ts);

alter table public.events enable row level security;
alter table public.leads enable row level security;
alter table public.admin_log enable row level security;
