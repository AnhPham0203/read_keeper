-- ============================================================
-- articles
-- ============================================================
create table articles (
  id            uuid        primary key default gen_random_uuid(),
  url           text        unique not null,
  title         text        not null,
  content       text,
  excerpt       text,
  thumbnail_url text,
  source        text        check (source in ('facebook', 'substack', 'other')),
  author        text,
  is_read       boolean     default false,
  saved_at      timestamptz default now(),
  search_vector tsvector
);

-- full-text search index
create index articles_search_idx on articles using gin(search_vector);

-- auto-update search_vector on insert/update
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

-- ============================================================
-- tags
-- ============================================================
create table tags (
  id    uuid primary key default gen_random_uuid(),
  name  text unique not null,
  color text default '#EDE0CE'
);

-- ============================================================
-- article_tags  (many-to-many join)
-- ============================================================
create table article_tags (
  article_id uuid references articles(id) on delete cascade,
  tag_id     uuid references tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

-- ============================================================
-- Row Level Security — authenticated users only
-- ============================================================
alter table articles    enable row level security;
alter table tags        enable row level security;
alter table article_tags enable row level security;

create policy "authenticated_all" on articles
  for all to authenticated using (true) with check (true);

create policy "authenticated_all" on tags
  for all to authenticated using (true) with check (true);

create policy "authenticated_all" on article_tags
  for all to authenticated using (true) with check (true);
