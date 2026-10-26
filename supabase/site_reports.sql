-- NightCamp Wiki · "report a mistake" form (แจ้งข้อมูลผิด)
-- Paste all of this into Supabase → SQL Editor → Run, once. Safe to run again (it replaces the function, keeps the data).
--
-- What it makes:
--   site_reports        one row per report: which page, what is wrong, what the game shows instead
--   submit_report(...)  the only way to add a row: checks the lengths and stops floods
-- Nobody can READ the reports through the site's public key: only you, in Table Editor → site_reports.
-- No names, no contact details, nothing about the person is stored. Mark a row done by setting status = 'done'.

create table if not exists public.site_reports (
  id          bigint generated always as identity primary key,
  page_url    text        not null check (char_length(page_url) between 1 and 400),
  page_title  text        not null default '' check (char_length(page_title) <= 200),
  wrong       text        not null check (char_length(wrong) between 3 and 1000),
  correct     text        not null default '' check (char_length(correct) <= 1000),
  lang        text        not null default 'th' check (lang in ('th', 'en')),
  status      text        not null default 'new' check (status in ('new', 'done', 'skip')),
  created_at  timestamptz not null default now()
);
create index if not exists site_reports_recent on public.site_reports (created_at desc);

-- row level security on, and no policy for the public: they cannot read, change or delete anything
alter table public.site_reports enable row level security;
revoke all on public.site_reports from anon, authenticated;

create or replace function public.submit_report(p_url text, p_title text, p_wrong text, p_correct text, p_lang text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_url     text := left(btrim(coalesce(p_url, '')), 400);
  v_title   text := left(btrim(coalesce(p_title, '')), 200);
  v_wrong   text := btrim(coalesce(p_wrong, ''));
  v_correct text := btrim(coalesce(p_correct, ''));
begin
  if v_url = '' then raise exception 'page required'; end if;
  if char_length(v_wrong) < 3 then raise exception 'too short'; end if;
  if char_length(v_wrong) > 1000 or char_length(v_correct) > 1000 then raise exception 'too long'; end if;
  -- the same text on the same page in the last 10 minutes: a double tap
  if exists (select 1 from site_reports where page_url = v_url and wrong = v_wrong and created_at > now() - interval '10 minutes') then
    raise exception 'already sent';
  end if;
  -- flood guards for the whole table
  if (select count(*) from site_reports where created_at > now() - interval '1 minute') >= 10 then
    raise exception 'too many reports, try again in a minute';
  end if;
  if (select count(*) from site_reports where created_at > now() - interval '1 day') >= 300 then
    raise exception 'too many reports today';
  end if;
  insert into site_reports (page_url, page_title, wrong, correct, lang)
  values (v_url, v_title, v_wrong, v_correct, case when p_lang = 'en' then 'en' else 'th' end);
end;
$$;

revoke all on function public.submit_report(text, text, text, text, text) from public;
grant execute on function public.submit_report(text, text, text, text, text) to anon, authenticated;
