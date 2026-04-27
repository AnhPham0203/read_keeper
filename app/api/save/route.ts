import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: {
    url?: string;
    title?: string;
    content?: string;
    excerpt?: string;
    thumbnail_url?: string;
    source?: string;
    author?: string;
    tags?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { url, title, content, excerpt, thumbnail_url, source, author, tags } = body;
  if (!url || !title) {
    return NextResponse.json({ error: "url and title are required" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Duplicate check
  const { data: existing } = await admin
    .from("articles")
    .select("id")
    .eq("url", url)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ duplicate: true, id: existing.id });
  }

  // Insert article
  const { data: article, error: insertError } = await admin
    .from("articles")
    .insert({ url, title, content, excerpt, thumbnail_url, source, author })
    .select("id, saved_at")
    .single();
  if (insertError || !article) {
    return NextResponse.json({ error: insertError?.message ?? "Insert failed" }, { status: 500 });
  }

  // Upsert tags and link to article
  if (tags && tags.length > 0) {
    for (const tagName of tags) {
      const { data: tag, error: tagError } = await admin
        .from("tags")
        .upsert({ name: tagName }, { onConflict: "name" })
        .select("id")
        .single();
      if (tagError || !tag) continue;
      await admin.from("article_tags").insert({ article_id: article.id, tag_id: tag.id });
    }
  }

  return NextResponse.json({ duplicate: false, id: article.id, saved_at: article.saved_at });
}
