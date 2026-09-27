-- Agbada Luxe: products, consultation bookings/inquiries, newsletter, site settings and admin access.
-- Lives in the portfolio's Supabase project (aqilclozwukdnogqcmsy); every object is prefixed agbada_.
--
-- Security model
--   * Tables: RLS enabled, no policies, no grants to anon/authenticated. Nothing is reachable directly.
--   * The website talks to the database only through the agbada_* functions below (SECURITY DEFINER).
--     Public functions read published content or accept validated, rate-limited submissions.
--   * Admin functions require a session token issued by agbada_admin_login(). Admin passwords are bcrypt
--     hashes (pgcrypto); session tokens are random 256-bit values stored only as SHA-256 hashes, expire after
--     12 hours, and are all revoked when the password changes. Supabase Auth is deliberately NOT used: in
--     this project any Supabase Auth user can write several portfolio tables.
--   * Images go to the public storage bucket agbada-media. Uploading is only allowed to a random path that a
--     signed-in admin reserved in the last 10 minutes (agbada_admin_create_upload); nobody else can upload.
--   * No admin account is created here. Create one with the statement in README.md.

create table if not exists public.agbada_admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email) and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  password_hash text not null,
  created_at timestamptz not null default now(),
  password_changed_at timestamptz not null default now()
);

create table if not exists public.agbada_sessions (
  token_hash text primary key,
  admin_id uuid not null references public.agbada_admins (id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create table if not exists public.agbada_login_attempts (
  email text primary key,
  failures integer not null default 0,
  window_started_at timestamptz not null default now(),
  locked_until timestamptz
);

create table if not exists public.agbada_products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  description text not null default '' check (char_length(description) <= 4000),
  price numeric(12, 2) check (price is null or (price >= 0 and price <= 100000000)),
  currency text not null default 'NGN' check (currency in ('NGN', 'USD', 'GBP', 'EUR')),
  category text not null check (char_length(category) between 1 and 60),
  image_url text check (image_url is null or image_url ~ '^https://'),
  image_path text check (image_path is null or image_path ~ '^products/[0-9a-f-]{36}\.(jpg|jpeg|png|webp|avif)$'),
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agbada_bookings (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'consultation' check (kind in ('consultation', 'inquiry')),
  full_name text not null check (char_length(full_name) between 1 and 120),
  email text not null check (char_length(email) <= 254 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text check (phone is null or char_length(phone) <= 40),
  service text check (service is null or char_length(service) <= 120),
  preferred_date date,
  message text not null default '' check (char_length(message) <= 4000),
  status text not null default 'new' check (status in ('new', 'contacted', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.agbada_newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (char_length(email) <= 254 and email = lower(email) and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at timestamptz not null default now()
);

-- Editable site content (contact details, story, hero image). Only these keys are accepted.
create table if not exists public.agbada_settings (
  key text primary key check (key in (
    'tagline', 'intro', 'about_title', 'about_body', 'contact_email', 'contact_phone', 'whatsapp',
    'address', 'opening_hours', 'instagram_url', 'hero_image_url'
  )),
  value text not null default '' check (char_length(value) <= 4000),
  updated_at timestamptz not null default now()
);

create table if not exists public.agbada_upload_tickets (
  object_path text primary key,
  admin_id uuid not null references public.agbada_admins (id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists agbada_bookings_created_at_idx on public.agbada_bookings (created_at desc);
create index if not exists agbada_products_listing_idx on public.agbada_products (is_published, sort_order, created_at desc);
create index if not exists agbada_sessions_admin_idx on public.agbada_sessions (admin_id);

alter table public.agbada_admins enable row level security;
alter table public.agbada_sessions enable row level security;
alter table public.agbada_login_attempts enable row level security;
alter table public.agbada_products enable row level security;
alter table public.agbada_bookings enable row level security;
alter table public.agbada_newsletter_subscribers enable row level security;
alter table public.agbada_settings enable row level security;
alter table public.agbada_upload_tickets enable row level security;

revoke all on public.agbada_admins, public.agbada_sessions, public.agbada_login_attempts, public.agbada_products,
  public.agbada_bookings, public.agbada_newsletter_subscribers, public.agbada_settings, public.agbada_upload_tickets
  from anon, authenticated;

-- ---------------------------------------------------------------------------------------------------------
-- Internal helpers (not callable by the website)
-- ---------------------------------------------------------------------------------------------------------

-- Returns the admin id for a valid, unexpired session token; raises 'unauthorized' otherwise.
create or replace function public.agbada_session_admin(p_token text)
returns uuid
language plpgsql stable security definer set search_path = public, extensions, pg_temp
as $$
declare v_admin uuid;
begin
  if p_token is null or char_length(p_token) <> 64 then
    raise exception 'unauthorized';
  end if;
  select admin_id into v_admin from agbada_sessions
   where token_hash = encode(digest(p_token, 'sha256'), 'hex') and expires_at > now();
  if v_admin is null then
    raise exception 'unauthorized';
  end if;
  return v_admin;
end $$;

create or replace function public.agbada_new_session(p_admin uuid)
returns table (token text, expires_at timestamptz)
language plpgsql security definer set search_path = public, extensions, pg_temp
as $$
declare
  v_token text := encode(gen_random_bytes(32), 'hex');
  v_expires timestamptz := now() + interval '12 hours';
begin
  delete from agbada_sessions s where s.expires_at <= now();
  insert into agbada_sessions (token_hash, admin_id, expires_at)
  values (encode(digest(v_token, 'sha256'), 'hex'), p_admin, v_expires);
  return query select v_token, v_expires;
end $$;

-- Rate limiting for public submissions: raises 'rate_limited' when the table already has too many recent rows.
create or replace function public.agbada_check_rate(p_recent_for_key integer, p_key_limit integer, p_recent_total integer, p_total_limit integer)
returns void
language plpgsql immutable set search_path = public, pg_temp
as $$
begin
  if p_recent_for_key >= p_key_limit or p_recent_total >= p_total_limit then
    raise exception 'rate_limited';
  end if;
end $$;

-- Used by the storage upload policy: true only for a path an admin reserved in the last 10 minutes.
create or replace function public.agbada_upload_allowed(p_name text)
returns boolean
language sql stable security definer set search_path = public, pg_temp
as $$ select exists (select 1 from agbada_upload_tickets where object_path = p_name and expires_at > now()) $$;

-- ---------------------------------------------------------------------------------------------------------
-- Admin authentication
-- ---------------------------------------------------------------------------------------------------------

-- Never raises for bad credentials (so the failure counter is not rolled back); returns ok=false instead.
create or replace function public.agbada_admin_login(p_email text, p_password text)
returns table (ok boolean, error text, token text, expires_at timestamptz)
language plpgsql security definer set search_path = public, extensions, pg_temp
as $$
declare
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_admin agbada_admins%rowtype;
  v_attempt agbada_login_attempts%rowtype;
  v_valid boolean;
begin
  select * into v_attempt from agbada_login_attempts a where a.email = v_email;
  if v_attempt.locked_until is not null and v_attempt.locked_until > now() then
    return query select false, 'rate_limited', null::text, null::timestamptz;
    return;
  end if;

  select * into v_admin from agbada_admins a where a.email = v_email;
  if v_admin.id is null then
    -- Unknown email: still run a bcrypt hash so both cases take about the same time.
    perform crypt(coalesce(p_password, ''), gen_salt('bf', 12));
    v_valid := false;
  else
    v_valid := crypt(coalesce(p_password, ''), v_admin.password_hash) = v_admin.password_hash;
  end if;

  if not v_valid then
    insert into agbada_login_attempts as a (email, failures, window_started_at)
    values (v_email, 1, now())
    on conflict (email) do update set
      failures = case when a.window_started_at < now() - interval '15 minutes' then 1 else a.failures + 1 end,
      window_started_at = case when a.window_started_at < now() - interval '15 minutes' then now() else a.window_started_at end,
      locked_until = case
        when a.window_started_at >= now() - interval '15 minutes' and a.failures + 1 >= 5 then now() + interval '15 minutes'
        else null end;
    return query select false, 'invalid_credentials', null::text, null::timestamptz;
    return;
  end if;

  delete from agbada_login_attempts a where a.email = v_email;
  return query select true, null::text, s.token, s.expires_at from agbada_new_session(v_admin.id) s;
end $$;

create or replace function public.agbada_admin_logout(p_token text)
returns void
language sql security definer set search_path = public, extensions, pg_temp
as $$ delete from agbada_sessions where token_hash = encode(digest(coalesce(p_token, ''), 'sha256'), 'hex') $$;

create or replace function public.agbada_admin_session(p_token text)
returns table (email text, expires_at timestamptz)
language plpgsql stable security definer set search_path = public, extensions, pg_temp
as $$
declare v_admin uuid := agbada_session_admin(p_token);
begin
  return query select a.email, s.expires_at from agbada_admins a
    join agbada_sessions s on s.admin_id = a.id and s.token_hash = encode(digest(p_token, 'sha256'), 'hex')
   where a.id = v_admin;
end $$;

-- Changing the password signs out every session (including other devices) and returns a fresh one.
create or replace function public.agbada_admin_change_password(p_token text, p_current text, p_new text)
returns table (ok boolean, error text, token text, expires_at timestamptz)
language plpgsql security definer set search_path = public, extensions, pg_temp
as $$
declare
  v_admin uuid := agbada_session_admin(p_token);
  v_hash text;
begin
  select password_hash into v_hash from agbada_admins where id = v_admin;
  if crypt(coalesce(p_current, ''), v_hash) <> v_hash then
    return query select false, 'wrong_password', null::text, null::timestamptz;
    return;
  end if;
  if p_new is null or char_length(p_new) < 10 or char_length(p_new) > 200 then
    return query select false, 'weak_password', null::text, null::timestamptz;
    return;
  end if;
  if p_new = p_current then
    return query select false, 'same_password', null::text, null::timestamptz;
    return;
  end if;
  update agbada_admins set password_hash = crypt(p_new, gen_salt('bf', 12)), password_changed_at = now() where id = v_admin;
  delete from agbada_sessions where admin_id = v_admin;
  return query select true, null::text, s.token, s.expires_at from agbada_new_session(v_admin) s;
end $$;

-- ---------------------------------------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------------------------------------

create or replace function public.agbada_list_products()
returns table (id uuid, name text, description text, price double precision, currency text, category text, image_url text, sort_order integer, created_at timestamptz)
language sql stable security definer set search_path = public, pg_temp
as $$
  select id, name, description, price::double precision, currency, category, image_url, sort_order, created_at
  from agbada_products where is_published order by sort_order, created_at desc
$$;

create or replace function public.agbada_get_product(p_id uuid)
returns table (id uuid, name text, description text, price double precision, currency text, category text, image_url text, sort_order integer, created_at timestamptz)
language sql stable security definer set search_path = public, pg_temp
as $$
  select id, name, description, price::double precision, currency, category, image_url, sort_order, created_at
  from agbada_products where id = p_id and is_published
$$;

create or replace function public.agbada_admin_list_products(p_token text)
returns table (id uuid, name text, description text, price double precision, currency text, category text, image_url text, image_path text, is_published boolean, sort_order integer, created_at timestamptz, updated_at timestamptz)
language plpgsql stable security definer set search_path = public, extensions, pg_temp
as $$
begin
  perform agbada_session_admin(p_token);
  return query select p.id, p.name, p.description, p.price::double precision, p.currency, p.category, p.image_url, p.image_path,
    p.is_published, p.sort_order, p.created_at, p.updated_at
  from agbada_products p order by p.sort_order, p.created_at desc;
end $$;

-- Creates a product when p_id is null, otherwise updates it. Returns the saved product id.
create or replace function public.agbada_admin_save_product(
  p_token text, p_id uuid, p_name text, p_description text, p_price numeric, p_currency text, p_category text,
  p_image_url text, p_image_path text, p_is_published boolean, p_sort_order integer)
returns uuid
language plpgsql security definer set search_path = public, extensions, pg_temp
as $$
declare v_id uuid;
begin
  perform agbada_session_admin(p_token);
  if p_id is null then
    insert into agbada_products (name, description, price, currency, category, image_url, image_path, is_published, sort_order)
    values (btrim(p_name), btrim(coalesce(p_description, '')), p_price, coalesce(p_currency, 'NGN'), btrim(p_category),
            nullif(btrim(coalesce(p_image_url, '')), ''), nullif(btrim(coalesce(p_image_path, '')), ''),
            coalesce(p_is_published, true), coalesce(p_sort_order, 0))
    returning id into v_id;
  else
    update agbada_products set name = btrim(p_name), description = btrim(coalesce(p_description, '')), price = p_price,
      currency = coalesce(p_currency, 'NGN'), category = btrim(p_category),
      image_url = nullif(btrim(coalesce(p_image_url, '')), ''), image_path = nullif(btrim(coalesce(p_image_path, '')), ''),
      is_published = coalesce(p_is_published, true), sort_order = coalesce(p_sort_order, 0), updated_at = now()
    where id = p_id returning id into v_id;
    if v_id is null then
      raise exception 'not_found';
    end if;
  end if;
  return v_id;
end $$;

create or replace function public.agbada_admin_delete_product(p_token text, p_id uuid)
returns boolean
language plpgsql security definer set search_path = public, extensions, pg_temp
as $$
begin
  perform agbada_session_admin(p_token);
  delete from agbada_products where id = p_id;
  return found;
end $$;

-- Reserves a random storage path for one image upload (valid for 10 minutes).
create or replace function public.agbada_admin_create_upload(p_token text, p_extension text)
returns text
language plpgsql security definer set search_path = public, extensions, pg_temp
as $$
declare
  v_admin uuid := agbada_session_admin(p_token);
  v_ext text := lower(coalesce(p_extension, ''));
  v_path text;
begin
  if v_ext not in ('jpg', 'jpeg', 'png', 'webp', 'avif') then
    raise exception 'invalid_file_type';
  end if;
  delete from agbada_upload_tickets where expires_at <= now();
  if (select count(*) from agbada_upload_tickets where admin_id = v_admin) >= 30 then
    raise exception 'rate_limited';
  end if;
  v_path := 'products/' || gen_random_uuid() || '.' || v_ext;
  insert into agbada_upload_tickets (object_path, admin_id, expires_at) values (v_path, v_admin, now() + interval '10 minutes');
  return v_path;
end $$;

-- ---------------------------------------------------------------------------------------------------------
-- Consultation bookings and inquiries
-- ---------------------------------------------------------------------------------------------------------

create or replace function public.agbada_submit_booking(
  p_kind text, p_full_name text, p_email text, p_phone text, p_service text, p_preferred_date date, p_message text)
returns uuid
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_id uuid;
begin
  perform agbada_check_rate(
    (select count(*)::int from agbada_bookings where email = v_email and created_at > now() - interval '1 hour'), 5,
    (select count(*)::int from agbada_bookings where created_at > now() - interval '1 hour'), 200);
  if p_preferred_date is not null and (p_preferred_date < current_date or p_preferred_date > current_date + 366) then
    raise exception 'invalid_date';
  end if;
  insert into agbada_bookings (kind, full_name, email, phone, service, preferred_date, message)
  values (coalesce(p_kind, 'consultation'), btrim(coalesce(p_full_name, '')), v_email,
          nullif(btrim(coalesce(p_phone, '')), ''), nullif(btrim(coalesce(p_service, '')), ''), p_preferred_date,
          btrim(coalesce(p_message, '')))
  returning id into v_id;
  return v_id;
end $$;

create or replace function public.agbada_admin_list_bookings(p_token text)
returns table (id uuid, kind text, full_name text, email text, phone text, service text, preferred_date date, message text, status text, created_at timestamptz)
language plpgsql stable security definer set search_path = public, extensions, pg_temp
as $$
begin
  perform agbada_session_admin(p_token);
  return query select b.id, b.kind, b.full_name, b.email, b.phone, b.service, b.preferred_date, b.message, b.status, b.created_at
  from agbada_bookings b order by b.created_at desc;
end $$;

create or replace function public.agbada_admin_update_booking(p_token text, p_id uuid, p_status text)
returns boolean
language plpgsql security definer set search_path = public, extensions, pg_temp
as $$
begin
  perform agbada_session_admin(p_token);
  update agbada_bookings set status = p_status where id = p_id;
  return found;
end $$;

-- ---------------------------------------------------------------------------------------------------------
-- Newsletter
-- ---------------------------------------------------------------------------------------------------------

create or replace function public.agbada_subscribe(p_email text)
returns void
language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  perform agbada_check_rate(0, 1, (select count(*)::int from agbada_newsletter_subscribers where created_at > now() - interval '1 hour'), 300);
  insert into agbada_newsletter_subscribers (email) values (lower(btrim(coalesce(p_email, '')))) on conflict (email) do nothing;
end $$;

create or replace function public.agbada_admin_list_subscribers(p_token text)
returns table (id uuid, email text, created_at timestamptz)
language plpgsql stable security definer set search_path = public, extensions, pg_temp
as $$
begin
  perform agbada_session_admin(p_token);
  return query select s.id, s.email, s.created_at from agbada_newsletter_subscribers s order by s.created_at desc;
end $$;

create or replace function public.agbada_admin_delete_subscriber(p_token text, p_id uuid)
returns boolean
language plpgsql security definer set search_path = public, extensions, pg_temp
as $$
begin
  perform agbada_session_admin(p_token);
  delete from agbada_newsletter_subscribers where id = p_id;
  return found;
end $$;

-- ---------------------------------------------------------------------------------------------------------
-- Site settings
-- ---------------------------------------------------------------------------------------------------------

create or replace function public.agbada_get_settings()
returns table (key text, value text)
language sql stable security definer set search_path = public, pg_temp
as $$ select key, value from agbada_settings where value <> '' $$;

-- Saves the given keys (a JSON object of key -> text); unknown keys are rejected by the table constraint.
create or replace function public.agbada_admin_save_settings(p_token text, p_settings jsonb)
returns void
language plpgsql security definer set search_path = public, extensions, pg_temp
as $$
declare r record;
begin
  perform agbada_session_admin(p_token);
  if jsonb_typeof(p_settings) <> 'object' then
    raise exception 'invalid_settings';
  end if;
  for r in select * from jsonb_each_text(p_settings) loop
    insert into agbada_settings (key, value, updated_at) values (r.key, btrim(coalesce(r.value, '')), now())
    on conflict (key) do update set value = excluded.value, updated_at = now();
  end loop;
end $$;

-- ---------------------------------------------------------------------------------------------------------
-- Permissions: only the listed functions are callable by the website (anon/authenticated)
-- ---------------------------------------------------------------------------------------------------------

do $$
declare f record;
begin
  for f in
    select p.oid::regprocedure as sig, p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname like 'agbada\_%'
  loop
    execute format('revoke all on function %s from public, anon, authenticated', f.sig);
    if f.proname not in ('agbada_session_admin', 'agbada_new_session', 'agbada_check_rate') then
      execute format('grant execute on function %s to anon, authenticated', f.sig);
    end if;
  end loop;
end $$;
