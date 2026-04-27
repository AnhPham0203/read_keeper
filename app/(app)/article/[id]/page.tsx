import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Tag } from "@/lib/types";
import { sourceLabel, formatDate } from "@/lib/format";
import ArticleToolbar from "@/components/ArticleToolbar";
import TagRow from "@/components/TagRow";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { id } = await params;

  const { data, error } = await supabase
    .from("articles")
    .select(
      "id, url, title, content, thumbnail_url, source, author, is_read, saved_at, article_tags(tag:tags(id, name, color))"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  const tags: Tag[] = (
    data.article_tags as unknown as { tag: Tag }[]
  ).map((at) => at.tag);

  const meta = [sourceLabel(data.source), data.author, formatDate(data.saved_at)]
    .filter(Boolean)
    .join(" · ");

  // Render content as plain text paragraphs — no raw HTML (security)
  const paragraphs = data.content
    ? (data.content.split(/\n{2,}/) as string[]).map((p) => p.replace(/\n/g, " ").trim()).filter((p) => p.length > 0)
    : [] as string[];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <ArticleToolbar articleId={data.id} initialIsRead={data.is_read} />

      <article className="max-w-[680px] mx-auto px-4 py-8">
        {data.thumbnail_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.thumbnail_url}
            alt=""
            className="w-full max-h-[300px] object-cover rounded-lg mb-6"
          />
        )}

        <header className="mb-5">
          <h1 className="font-serif text-2xl leading-snug text-[#2C2420] mb-2">
            {data.title}
          </h1>
          {meta && <p className="text-sm text-[#7A6A5E]">{meta}</p>}
        </header>

        <div className="mb-7">
          <TagRow articleId={data.id} initialTags={tags} />
        </div>

        <div className="text-base text-[#2C2420] leading-[1.8]">
          {paragraphs.length > 0 ? (
            paragraphs.map((para, i) => (
              <p key={i} className="mb-4">
                {para}
              </p>
            ))
          ) : (
            <p className="text-[#7A6A5E] italic">Không có nội dung được lưu.</p>
          )}
        </div>

        <footer className="mt-10 pt-6 border-t border-[#E2D9CC]">
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-[#8B6F47] hover:underline"
          >
            Xem bài gốc ↗
          </a>
        </footer>
      </article>
    </div>
  );
}
