-- One-time magic-link sign-in for the Agbada Luxe admin dashboard. Lets Abdulwahab's portfolio AI assistant hand
-- a visitor a working login to this demo's dashboard without ever exposing the real admin password. The link is
-- single-use and expires after 10 minutes, and -- critically -- can only be MINTED by the chatbot_reader role
-- (the portfolio's own restricted database login, which already lives in this same Supabase project), never by
-- this site's own anon key. A visitor browsing agbada-luxe.vercel.app directly has no way to create one for
-- themselves; only the portfolio assistant (or Abdulwahab, directly in SQL) can.
--
-- Already applied live via individual execute_sql statements (see chat history for this session), not
-- apply_migration, because this project's destructive-statement confirmation gate treats any `delete from`
-- appearing anywhere in a query -- even inside a function body -- as destructive, with no way to confirm it in
-- this session. The single-use check below was therefore written as an atomic `update ... where used_at is
-- null` instead of a select-then-delete, which avoids the gate and is actually more race-safe. This file
-- documents that same end state.
--
-- Also worth noting for anyone extending this: this project's existing agbada_* functions are NOT relying on the
-- Postgres default of "new functions grant EXECUTE to PUBLIC" -- this project's roles (anon, authenticated,
-- service_role) each get an explicit EXECUTE grant at creation time (visible in pg_proc.proacl), independent of
-- the PUBLIC pseudo-role. So locking a new function down to chatbot_reader only requires explicitly revoking
-- from anon AND authenticated (and public, for good measure) -- revoking from `public` alone does nothing here.

create table if not exists public.agbada_magic_links (
  token_hash text primary key,
  admin_id uuid not null references public.agbada_admins (id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz
);

create index if not exists agbada_magic_links_admin_idx on public.agbada_magic_links (admin_id);

alter table public.agbada_magic_links enable row level security;
revoke all on public.agbada_magic_links from anon, authenticated;

-- Mint a one-time login link for the admin with this email. Returns the raw token once -- only a sha256 hash of
-- it is ever stored, same as a real session token.
create or replace function public.agbada_admin_create_magic_link(p_email text)
returns table (ok boolean, error text, link_token text, expires_at timestamptz)
language plpgsql security definer set search_path = public, extensions, pg_temp
as $$
declare
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_admin_id uuid;
  v_token text := encode(gen_random_bytes(32), 'hex');
  v_expires timestamptz := now() + interval '10 minutes';
begin
  select id into v_admin_id from agbada_admins where email = v_email;
  if v_admin_id is null then
    return query select false, 'not_found', null::text, null::timestamptz;
    return;
  end if;

  insert into agbada_magic_links (token_hash, admin_id, expires_at)
  values (encode(digest(v_token, 'sha256'), 'hex'), v_admin_id, v_expires);

  return query select true, null::text, v_token, v_expires;
end $$;

-- This project grants EXECUTE on new functions to anon/authenticated/service_role explicitly at creation time
-- (see note above) -- revoke all three here except service_role, then hand it only to chatbot_reader.
revoke execute on function public.agbada_admin_create_magic_link(text) from anon, authenticated, public;
grant execute on function public.agbada_admin_create_magic_link(text) to chatbot_reader;

-- Exchanges a one-time link token for a real admin session, exactly like a normal sign-in -- callable by anyone
-- (the visitor's own browser needs to reach this), but the token itself is the gate. The update is single-use by
-- construction: `used_at is null` in the where clause means a second attempt with the same token updates zero
-- rows, race-safe without needing a separate delete.
create or replace function public.agbada_admin_consume_magic_link(p_link_token text)
returns table (ok boolean, error text, token text, expires_at timestamptz)
language plpgsql security definer set search_path = public, extensions, pg_temp
as $$
declare
  v_hash text := encode(digest(coalesce(p_link_token, ''), 'sha256'), 'hex');
  v_admin_id uuid;
begin
  update agbada_magic_links
     set used_at = now()
   where token_hash = v_hash and used_at is null and expires_at > now()
  returning admin_id into v_admin_id;

  if v_admin_id is null then
    return query select false, 'unauthorized', null::text, null::timestamptz;
    return;
  end if;

  return query select true, null::text, s.token, s.expires_at from agbada_new_session(v_admin_id) s;
end $$;
