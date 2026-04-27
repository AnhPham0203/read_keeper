"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Tag } from "@/lib/types";

export default function TagFilter({ tags, active }: { tags: Tag[]; active: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function select(tagName: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("tag") === tagName) params.delete("tag");
    else params.set("tag", tagName);
    params.delete("page");
    router.push(`?${params}`);
    setOpen(false);
  }

  function clear() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tag");
    params.delete("page");
    router.push(`?${params}`);
    setOpen(false);
  }

  if (tags.length === 0) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border transition-colors ${
          active
            ? "border-[#8B6F47] text-[#8B6F47] bg-[#F2EDE4]"
            : "border-[#E2D9CC] text-[#7A6A5E] bg-[#F2EDE4] hover:border-[#8B6F47]"
        }`}
      >
        <span>{active || "Tags"}</span>
        {active && (
          <span
            onClick={(e) => { e.stopPropagation(); clear(); }}
            className="text-[#7A6A5E] hover:text-[#2C2420] leading-none"
          >
            ×
          </span>
        )}
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 8L1 3h10L6 8z" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-10 min-w-40 bg-[#F2EDE4] border border-[#E2D9CC] rounded-lg shadow-sm overflow-hidden">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => select(tag.name)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-[#EDE0CE] transition-colors ${
                active === tag.name ? "text-[#8B6F47] font-medium" : "text-[#2C2420]"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: tag.color }}
              />
              {tag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
