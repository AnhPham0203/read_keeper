import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatRelativeTime, sourceLabel } from "@/lib/format";

export default function ArticleCard({ article }: { article: Article }) {
  const meta = [
    sourceLabel(article.source),
    article.author,
    formatRelativeTime(article.saved_at),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/article/${article.id}`}
      className="flex gap-3 p-4 bg-[#F2EDE4] rounded-lg border border-[#E2D9CC] hover:border-[#8B6F47] transition-colors group"
    >
      {article.thumbnail_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.thumbnail_url}
          alt=""
          width={80}
          height={80}
          className="w-20 h-20 object-cover rounded flex-shrink-0"
        />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <h2 className="flex-1 font-serif text-[18px] leading-snug text-[#2C2420] line-clamp-2 group-hover:text-[#8B6F47] transition-colors">
            {article.title}
          </h2>
          {!article.is_read && (
            <span className="flex-shrink-0 text-[11px] px-2 py-0.5 bg-[#8B6F47] text-white rounded-full mt-0.5">
              Chưa đọc
            </span>
          )}
        </div>

        {meta && (
          <p className="mt-1 text-sm text-[#7A6A5E] truncate">{meta}</p>
        )}

        {article.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {article.tags.map((tag) => (
              <span
                key={tag.id}
                className="text-[11px] px-2 py-0.5 rounded-full text-[#2C2420]"
                style={{ backgroundColor: tag.color || "#EDE0CE" }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
