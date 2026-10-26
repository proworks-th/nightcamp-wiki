-- NightCamp Wiki · shared boss timer (จับเวลาบอสร่วมกัน)
-- Paste all of this into Supabase → SQL Editor → Run, once. Safe to run again (it replaces the functions, keeps the data).
--
-- What it makes:
--   boss_kills          one row per "killed" report: which boss, when it died, who reported it
--   report_kill(...)    the only way to add a row: checks the boss id, the time, the name, and stops repeat taps
--   adjust_kill(...)    move a report's time by up to ±10 min, within 30 min of reporting (the −1 / +1 buttons)
--   undo_kill(...)      take a report back, within 10 min of reporting
-- Everyone can READ the reports (the site shows them to all). Nobody can write to the table directly: only through the
-- three functions above, which run the checks. The site uses the public (publishable / anon) key only.

create table if not exists public.boss_kills (
  id          bigint generated always as identity primary key,
  boss_id     text        not null check (boss_id ~ '^[a-z0-9_]{1,40}$'),
  killed_at   timestamptz not null,
  reporter    text        not null check (char_length(reporter) between 1 and 24),
  created_at  timestamptz not null default now(),
  undone      boolean     not null default false
);
create index if not exists boss_kills_recent on public.boss_kills (created_at desc);

-- row level security: read for everyone, no direct writes
alter table public.boss_kills enable row level security;
drop policy if exists "anyone can read boss kills" on public.boss_kills;
create policy "anyone can read boss kills" on public.boss_kills for select to anon, authenticated using (true);
revoke insert, update, delete, truncate on public.boss_kills from anon, authenticated;
grant select on public.boss_kills to anon, authenticated;

-- add a report
create or replace function public.report_kill(p_boss text, p_killed_at timestamptz, p_name text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := left(btrim(coalesce(p_name, '')), 24);
  v_id bigint;
begin
  if p_boss is null or p_boss !~ '^[a-z0-9_]{1,40}$' then raise exception 'bad boss id'; end if;
  if p_killed_at is null or p_killed_at > now() + interval '1 minute' or p_killed_at < now() - interval '2 hours' then
    raise exception 'bad time';
  end if;
  if v_name = '' then raise exception 'name required'; end if;
  -- the same boss reported in the last 30 s: a double tap or two friends at once, keep the first
  if exists (select 1 from boss_kills where boss_id = p_boss and not undone and created_at > now() - interval '30 seconds') then
    raise exception 'already reported';
  end if;
  -- a flood guard for the whole table
  if (select count(*) from boss_kills where created_at > now() - interval '1 minute') >= 30 then
    raise exception 'too many reports, try again in a minute';
  end if;
  insert into boss_kills (boss_id, killed_at, reporter) values (p_boss, p_killed_at, v_name) returning id into v_id;
  return v_id;
end;
$$;

-- move a report's time (the −1 / +1 minute buttons)
create or replace function public.adjust_kill(p_id bigint, p_seconds integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_seconds is null or abs(p_seconds) > 600 then raise exception 'bad adjustment'; end if;
  update boss_kills set killed_at = killed_at + make_interval(secs => p_seconds)
   where id = p_id and not undone and created_at > now() - interval '30 minutes'
     and killed_at + make_interval(secs => p_seconds) <= now() + interval '1 minute';
  if not found then raise exception 'cannot adjust this report'; end if;
end;
$$;

-- take a report back
create or replace function public.undo_kill(p_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update boss_kills set undone = true where id = p_id and not undone and created_at > now() - interval '10 minutes';
  if not found then raise exception 'cannot undo this report'; end if;
end;
$$;

revoke all on function public.report_kill(text, timestamptz, text) from public;
revoke all on function public.adjust_kill(bigint, integer) from public;
revoke all on function public.undo_kill(bigint) from public;
grant execute on function public.report_kill(text, timestamptz, text) to anon, authenticated;
grant execute on function public.adjust_kill(bigint, integer) to anon, authenticated;
grant execute on function public.undo_kill(bigint) to anon, authenticated;
