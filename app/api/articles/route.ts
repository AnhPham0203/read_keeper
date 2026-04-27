import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source");
  const tag = searchParams.get("tag");
  const q = searchParams.get("q");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? "20")));
  const offset = (page - 1) * limit;

  const admin = createAdminClient();

  // If filtering by tag, resolve to article IDs first
  let tagFilterIds: string[] | null = null;
  if (tag) {
    const { data: tagRow } = await admin.from("tags").select("id").eq("name", tag).maybeSingle();
    if (!tagRow) {
      return NextResponse.json({ articles: [], total: 0, page, totalPages: 0 });
    }
    const { data: rows } = await admin
      .from("article_tags")
      .select("article_id")
      .eq("tag_id", tagRow.id);
    tagFilterIds = rows?.map((r) => r.article_id) ?? [];
    if (tagFilterIds.length === 0) {
      return NextResponse.json({ articles: [], total: 0, page, totalPages: 0 });
    }
  }

  let query = admin
    .from("articles")
    .select(
      "id, url, title, excerpt, thumbnail_url, source, author, is_read, saved_at, article_tags(tag:tags(id, name, color))",
      { count: "exact" }
    )
    .order("saved_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (source) query = query.eq("source", source);
  if (tagFilterIds) query = query.in("id", tagFilterIds);
  if (q) query = query.textSearch("search_vector", q, { config: "simple", type: "websearch" });

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const total = count ?? 0;
  const articles = (data ?? []).map((a) => ({
    ...a,
    tags: (a.article_tags as unknown as { tag: { id: string; name: string; color: string } }[]).map(
      (at) => at.tag
    ),
    article_tags: undefined,
  }));

  return NextResponse.json({ articles, total, page, totalPages: Math.ceil(total / limit) });
}
