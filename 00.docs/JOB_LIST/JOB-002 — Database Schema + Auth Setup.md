JOB-002 — Database Schema + Auth Setup
Context:
Readkeeper dùng Supabase làm database và auth. Chỉ có 1 user duy nhất.
Auth bằng Magic Link qua email.
Task:

Tạo Supabase project
Chạy SQL migration tạo tables:

sql-- articles
create table articles (
  id uuid primary key default gen_random_uuid(),
  url text unique not null,
  title text not null,
  content text,
  excerpt text,
  thumbnail_url text,
  source text check (source in ('facebook', 'substack', 'other')),
  author text,
  is_read boolean default false,
  saved_at timestamptz default now(),
  search_vector tsvector
);

-- full-text search index
create index articles_search_idx on articles using gin(search_vector);

-- trigger tự động cập nhật search_vector
create or replace function update_search_vector()
returns trigger as $$
begin
  new.search_vector :=
    to_tsvector('simple', coalesce(new.title, '')) ||
    to_tsvector('simple', coalesce(new.content, ''));
  return new;
end;
$$ language plpgsql;

create trigger articles_search_trigger
before insert or update on articles
for each row execute function update_search_vector();

-- tags
create table tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  color text default '#EDE0CE'
);

-- article_tags
create table article_tags (
  article_id uuid references articles(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

Bật Row Level Security (RLS) — chỉ user đã auth mới đọc/ghi được
Cấu hình Supabase Auth: bật Magic Link, tắt các provider khác
Tạo /lib/supabase.ts — client và server client

Input: JOB-001 hoàn thành (repo + Vercel)
Output:

Supabase project với 3 tables đúng schema
RLS đã bật
/lib/supabase.ts có đủ createClient() và createServerClient()

Constraints:

Dùng @supabase/ssr cho server-side client — không dùng createClient thuần
search_vector phải dùng 'simple' dictionary để support tiếng Việt