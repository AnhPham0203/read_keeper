"use client";

import { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar({ initialValue }: { initialValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (val) params.set("q", val);
      else params.delete("q");
      params.delete("page");
      router.push(`?${params}`);
    }, 300);
  }

  return (
    <input
      type="search"
      defaultValue={initialValue}
      onChange={handleChange}
      placeholder="Tìm kiếm bài viết..."
      className="w-full px-4 py-2.5 rounded-lg border border-[#E2D9CC] bg-[#F2EDE4] text-[#2C2420] placeholder:text-[#7A6A5E] focus:outline-none focus:border-[#8B6F47] transition-colors text-sm"
    />
  );
}
