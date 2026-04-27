import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Article, Tag } from "@/lib/types";
import SearchBar from "@/components/SearchBar";
import SourceTabs from "@/components/SourceTabs";
import TagFilter from "@/components/TagFilter";
import ArticleCard from "@/components/ArticleCard";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";

const LIMIT = 20;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const sp = await searchParams;
  const q = String(sp.q ?? "");
  const source = String(sp.source ?? "");
  const tag = String(sp.tag ?? "");
  const page = Math.max(1, Number(sp.page ?? "1"));
  const offset = (page - 1) * LIMIT;

  // All tags for the dropdown
  const { data: allTags } = await supabase
    .from("tags")
    .select("id, name, color")
    .order("name");

  // If tag filter: resolve article IDs
  let tagFilterIds: string[] | null = null;
  if (tag) {
    const { data: tagRow } = await supabase
      .from("tags")
      .select("id")
      .eq("name", tag)
      .maybeSingle();
    if (!tagRow) {
      return (
        <Shell q={q} source={source} tag={tag} allTags={allTags ?? []}>
          <EmptyState hasFilters />
        </Shell>
      );
    }
    const { data: rows } = await supabase
      .from("article_tags")
      .select("article_id")
      .eq("tag_id", tagRow.id);
    tagFilterIds = rows?.map((r) => r.article_id) ?? [];
    if (tagFilterIds.length === 0) {
      return (
        <Shell q={q} source={source} tag={tag} allTags={allTags ?? []}>
          <EmptyState hasFilters />
        </Shell>
      );
    }
  }

  // Build query
  let query = supabase
    .from("articles")
    .select(
      "id, url, title, excerpt, thumbnail_url, source, author, is_read, saved_at, article_tags(tag:tags(id, name, color))",
      { count: "exact" }
    )
    .order("saved_at", { ascending: false })
    .range(offset, offset + LIMIT - 1);

  if (source) query = query.eq("source", source);
  if (tagFilterIds) query = query.in("id", tagFilterIds);
  if (q) query = query.textSearch("search_vector", q, { config: "simple", type: "websearch" });

  const { data: raw, count, error } = await query;
  if (error) throw new Error(error.message);

  const total = count ?? 0;
  const totalPages = Math.ceil(total / LIMIT);
  const hasFilters = !!(q || source || tag);

  const articles: Article[] = (raw ?? []).map((a) => ({
    id: a.id,
    url: a.url,
    title: a.title,
    excerpt: a.excerpt,
    thumbnail_url: a.thumbnail_url,
    source: a.source,
    author: a.author,
    is_read: a.is_read,
    saved_at: a.saved_at,
    tags: (
      a.article_tags as unknown as { tag: Tag }[]
    ).map((at) => at.tag),
  }));

  return (
    <Shell q={q} source={source} tag={tag} allTags={allTags ?? []}>
      {articles.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <>
          <p className="text-xs text-[#7A6A5E] mb-3">
            {total} bài viết{hasFilters ? " phù hợp" : ""}
          </p>
          <div className="flex flex-col gap-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <Suspense>
            <Pagination page={page} totalPages={totalPages} />
          </Suspense>
        </>
      )}
    </Shell>
  );
}

// Layout shell extracted to avoid repeating the header/filters markup
function Shell({
  q,
  source,
  tag,
  allTags,
  children,
}: {
  q: string;
  source: string;
  tag: string;
  allTags: Tag[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="border-b border-[#E2D9CC] bg-[#FAF7F2] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <h1 className="font-serif text-xl text-[#2C2420] mb-3">Readkeeper</h1>
          <Suspense>
            <SearchBar initialValue={q} />
          </Suspense>
        </div>
        <div className="max-w-2xl mx-auto px-4">
          <Suspense>
            <SourceTabs active={source} />
          </Suspense>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4">
        {allTags.length > 0 && (
          <div className="mb-4">
            <Suspense>
              <TagFilter tags={allTags} active={tag} />
            </Suspense>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
