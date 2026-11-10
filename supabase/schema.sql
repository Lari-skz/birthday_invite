-- ════════════════════════════════════════════════════════════
--  BIRTHDAY PROTOCOL v1.0 — Supabase schema
--  Run this once in: Supabase Dashboard → SQL Editor → New query
-- ════════════════════════════════════════════════════════════
--
--  Security model
--  • Guests (anon key) can NOT read, update or delete the table directly.
--  • Guests can only call two functions:
--      submit_response()      → insert/update THEIR OWN row (keyed by a
--                               random UUID stored in their browser)
--      get_food_war_status()  → vote totals, only after they have voted
--  • Only logged-in users whose email is in public.admins can read rows.
-- ════════════════════════════════════════════════════════════

-- ── Tables ──────────────────────────────────────────────────
create table if not exists public.responses (
  id            bigint generated always as identity primary key,
  guest_id      uuid not null unique,
  name          text not null check (char_length(name) between 1 and 40),
  avatar        text check (avatar ~ '^[a-z-]{1,20}$'),
  attending     boolean not null,
  date_vote     text check (date_vote in ('saturday', 'sunday')),
  food_vote     text check (food_vote in ('pizza', 'grill')),
  drink_choice  text check (drink_choice in ('pirate', 'captain')),
  final_answer  text check (final_answer in ('A', 'B', 'C', 'D')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- (safe to re-run on an older version of the table)
alter table public.responses add column if not exists date_vote text
  check (date_vote in ('saturday', 'sunday'));
alter table public.responses add column if not exists avatar text
  check (avatar ~ '^[a-z-]{1,20}$');
alter table public.responses add column if not exists drink_choice text
  check (drink_choice in ('pirate', 'captain'));

create table if not exists public.admins (
  email text primary key
);

-- ── Lock everything down ────────────────────────────────────
alter table public.responses enable row level security;
alter table public.admins    enable row level security;

revoke all on public.responses from anon, authenticated;
revoke all on public.admins    from anon, authenticated;

-- ── Admin check ─────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- Admins (logged in) may read all responses. Nobody else can.
grant select on public.responses to authenticated;
drop policy if exists "admins can read responses" on public.responses;
create policy "admins can read responses"
  on public.responses for select
  to authenticated
  using (public.is_admin());

-- ── Guest submit (insert or update own row) ─────────────────
drop function if exists public.submit_response(uuid, text, boolean, text, text);
drop function if exists public.submit_response(uuid, text, boolean, text, text, text);
drop function if exists public.submit_response(uuid, text, boolean, text, text, text, text);
create or replace function public.submit_response(
  p_guest_id     uuid,
  p_name         text,
  p_attending    boolean,
  p_avatar       text default null,
  p_date_vote    text default null,
  p_food_vote    text default null,
  p_drink_choice text default null,
  p_final_answer text default null
)
returns void
language plpgsql security definer
set search_path = public
as $$
declare
  max_guests constant int := 300;  -- simple anti-spam cap
begin
  if p_guest_id is null or p_attending is null then
    raise exception 'missing fields';
  end if;

  if not exists (select 1 from responses where guest_id = p_guest_id)
     and (select count(*) from responses) >= max_guests then
    raise exception 'guest list is full';
  end if;

  insert into responses (guest_id, name, avatar, attending, date_vote, food_vote, drink_choice, final_answer)
  values (p_guest_id, left(btrim(p_name), 40), p_avatar, p_attending, p_date_vote, p_food_vote, p_drink_choice, p_final_answer)
  on conflict (guest_id) do update set
    name         = excluded.name,
    avatar       = coalesce(excluded.avatar, responses.avatar),
    attending    = excluded.attending,
    date_vote    = coalesce(excluded.date_vote, responses.date_vote),
    food_vote    = coalesce(excluded.food_vote, responses.food_vote),
    drink_choice = coalesce(excluded.drink_choice, responses.drink_choice),
    final_answer = coalesce(excluded.final_answer, responses.final_answer),
    updated_at   = now();
end;
$$;

-- ── Food vote totals (only revealed to guests who already voted) ──
--    Day votes and drink choices are NOT returned here: only the host sees them.
create or replace function public.get_food_war_status(p_guest_id uuid)
returns json
language plpgsql stable security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from responses
    where guest_id = p_guest_id and food_vote is not null
  ) then
    return json_build_object('locked', true);
  end if;

  return (
    select json_build_object(
      'locked',     false,
      'pizza',      count(*) filter (where food_vote = 'pizza'),
      'grill',      count(*) filter (where food_vote = 'grill'),
      'operatives', count(*)
    )
    from responses
  );
end;
$$;

-- ── Function permissions ────────────────────────────────────
revoke all on function public.is_admin()                                   from public;
revoke all on function public.submit_response(uuid, text, boolean, text, text, text, text, text) from public;
revoke all on function public.get_food_war_status(uuid)                    from public;

grant execute on function public.is_admin()                                   to authenticated;
grant execute on function public.submit_response(uuid, text, boolean, text, text, text, text, text) to anon, authenticated;
grant execute on function public.get_food_war_status(uuid)                    to anon, authenticated;

-- ── Add yourself as host ────────────────────────────────────
-- Replace with the email of the user you create in Authentication → Users:
-- insert into public.admins (email) values ('you@example.com');
