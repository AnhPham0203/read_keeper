import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { article_id?: string; tag_name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { article_id, tag_name } = body;
  if (!article_id || !tag_name) {
    return NextResponse.json({ error: "article_id and tag_name are required" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: tag, error: upsertError } = await admin
    .from("tags")
    .upsert({ name: tag_name }, { onConflict: "name" })
    .select("id, name, color")
    .single();

  if (upsertError || !tag) {
    return NextResponse.json({ error: upsertError?.message ?? "Upsert failed" }, { status: 500 });
  }

  const { error: linkError } = await admin
    .from("article_tags")
    .upsert({ article_id, tag_id: tag.id }, { onConflict: "article_id,tag_id" });

  if (linkError) return NextResponse.json({ error: linkError.message }, { status: 500 });

  return NextResponse.json({ tag });
}

export async function DELETE(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { article_id?: string; tag_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { article_id, tag_id } = body;
  if (!article_id || !tag_id) {
    return NextResponse.json({ error: "article_id and tag_id are required" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { error } = await admin
    .from("article_tags")
    .delete()
    .eq("article_id", article_id)
    .eq("tag_id", tag_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
