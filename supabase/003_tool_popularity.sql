-- Optional: 30-day usage ranking. Counts one visit per browser session and tool.
-- No file names, prompt text, IP address, user identity or visitor tokens are stored.
create table if not exists public.tool_usage_daily (
  tool_slug text not null references public.tool_catalog(slug) on delete cascade,
  used_on date not null default (now() at time zone 'UTC')::date,
  visit_count bigint not null default 0 check (visit_count >= 0),
  primary key (tool_slug, used_on)
);
create index if not exists tool_usage_daily_date_idx on public.tool_usage_daily(used_on);
alter table public.tool_usage_daily enable row level security;
revoke all on public.tool_usage_daily from anon, authenticated;
grant select on public.tool_usage_daily to anon, authenticated;
grant select, insert, update on public.tool_usage_daily to service_role;
drop policy if exists "Public can read aggregate tool usage" on public.tool_usage_daily;
create policy "Public can read aggregate tool usage" on public.tool_usage_daily
  for select to anon, authenticated using (true);

-- The app server calls this only using its server-side secret key.
create or replace function public.record_tool_visit(p_slug text)
returns void language plpgsql security invoker set search_path = '' as $$
begin
  if not exists (select 1 from public.tool_catalog where slug=p_slug and is_active=true) then
    raise exception 'Unknown tool';
  end if;
  insert into public.tool_usage_daily(tool_slug,used_on,visit_count)
  values(p_slug,(now() at time zone 'UTC')::date,1)
  on conflict (tool_slug,used_on)
  do update set visit_count=public.tool_usage_daily.visit_count+1;
end;
$$;
revoke all on function public.record_tool_visit(text) from public, anon, authenticated;
grant execute on function public.record_tool_visit(text) to service_role;
