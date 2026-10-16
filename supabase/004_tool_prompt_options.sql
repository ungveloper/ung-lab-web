-- 관리자(Supabase Table Editor)가 기본 질문과 문구를 관리합니다.
-- 질문 원문, IP, 사용자의 개인정보는 저장하지 않습니다. 도구별 질문 유형만 집계합니다.
create table if not exists public.tool_prompt_options (
  tool_slug text primary key references public.tool_catalog(slug) on delete cascade,
  question text not null check (char_length(question) between 3 and 90),
  is_default boolean not null default false,
  is_enabled boolean not null default true,
  display_order integer not null default 100,
  question_count bigint not null default 0 check (question_count >= 0)
);

alter table public.tool_prompt_options enable row level security;
revoke all on public.tool_prompt_options from anon, authenticated;
grant select on public.tool_prompt_options to anon, authenticated;
grant select,insert,update on public.tool_prompt_options to service_role;
drop policy if exists "Read enabled prompt options" on public.tool_prompt_options;
create policy "Read enabled prompt options" on public.tool_prompt_options for select to anon, authenticated using(is_enabled=true);

insert into public.tool_prompt_options(tool_slug,question,is_default,display_order) values
('background-remover','사진 배경을 투명하게 만들어줘',true,1),
('pdf-to-image','PDF를 이미지로 저장하고 싶어',true,2),
('image-converter','WebP 파일을 PNG로 바꿔줘',true,3),
('xlsx-viewer','엑셀 파일을 열어보고 싶어',true,4),
('image-to-pdf','사진 여러 장을 PDF로 합쳐줘',false,10),
('image-compressor','사진 용량을 줄이고 싶어',false,11),
('image-resizer','이미지 크기를 바꾸고 싶어',false,12),
('image-cropper','이미지 일부를 잘라내고 싶어',false,13),
('docx-viewer','워드 파일을 열어보고 싶어',false,14),
('pptx-viewer','파워포인트 파일을 보고 싶어',false,15),
('csv-viewer','CSV 파일을 열고 싶어',false,16)
on conflict(tool_slug) do nothing;

create or replace function public.record_tool_question(p_slug text)
returns void language plpgsql security invoker set search_path='' as $$
begin
  update public.tool_prompt_options
  set question_count=question_count+1
  where tool_slug=p_slug and is_enabled=true;
end;
$$;
revoke all on function public.record_tool_question(text) from public,anon,authenticated;
grant execute on function public.record_tool_question(text) to service_role;
notify pgrst,'reload schema';
