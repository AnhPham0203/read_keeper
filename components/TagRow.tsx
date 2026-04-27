"use client";

import { useState, useRef } from "react";
import type { Tag } from "@/lib/types";

export default function TagRow({
  articleId,
  initialTags,
}: {
  articleId: string;
  initialTags: Tag[];
}) {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const inputRef = useRef<HTMLInputElement>(null);

  async function addTag(name: string) {
    const trimmed = name.trim();
    if (!trimmed || tags.some((t) => t.name === trimmed)) {
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // Optimistic add with temp id
    const temp: Tag = { id: `temp-${Date.now()}`, name: trimmed, color: "#EDE0CE" };
    setTags((prev) => [...prev, temp]);
    if (inputRef.current) inputRef.current.value = "";

    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ article_id: articleId, tag_name: trimmed }),
    });
    const json = await res.json();
    if (json.tag) {
      setTags((prev) => prev.map((t) => (t.id === temp.id ? json.tag : t)));
    } else {
      setTags((prev) => prev.filter((t) => t.id !== temp.id)); // rollback
    }
  }

  async function removeTag(tagId: string) {
    setTags((prev) => prev.filter((t) => t.id !== tagId)); // optimistic
    await fetch("/api/tags", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ article_id: articleId, tag_id: tagId }),
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="flex items-center gap-1 text-[13px] pl-2.5 pr-1.5 py-0.5 rounded-full text-[#2C2420]"
          style={{ backgroundColor: tag.color || "#EDE0CE" }}
        >
          {tag.name}
          <button
            onClick={() => removeTag(tag.id)}
            className="flex items-center justify-center w-4 h-4 rounded-full text-[#7A6A5E] hover:text-[#2C2420] hover:bg-black/10 transition-colors leading-none"
            aria-label={`Xóa tag ${tag.name}`}
          >
            ×
          </button>
        </span>
      ))}

      <input
        ref={inputRef}
        type="text"
        placeholder="Thêm tag…"
        className="text-[13px] px-2 py-0.5 rounded-full border border-dashed border-[#E2D9CC] bg-transparent text-[#7A6A5E] placeholder:text-[#7A6A5E] focus:outline-none focus:border-[#8B6F47] focus:text-[#2C2420] w-28 transition-colors"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag(e.currentTarget.value);
          }
        }}
      />
    </div>
  );
}
