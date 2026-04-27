"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function go(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`?${params}`);
  }

  // Show up to 5 page buttons around current page
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const btnBase =
    "w-9 h-9 flex items-center justify-center rounded-lg text-sm border transition-colors";
  const btnActive = "border-[#8B6F47] bg-[#8B6F47] text-white";
  const btnIdle =
    "border-[#E2D9CC] text-[#2C2420] hover:border-[#8B6F47] bg-[#F2EDE4]";
  const btnDisabled =
    "border-[#E2D9CC] text-[#7A6A5E] opacity-40 cursor-not-allowed bg-[#F2EDE4]";

  return (
    <div className="flex items-center justify-center gap-1 py-6">
      <button
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        className={`${btnBase} ${page <= 1 ? btnDisabled : btnIdle}`}
      >
        ‹
      </button>

      {start > 1 && (
        <>
          <button onClick={() => go(1)} className={`${btnBase} ${btnIdle}`}>1</button>
          {start > 2 && <span className="text-[#7A6A5E] px-1">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => go(p)}
          className={`${btnBase} ${p === page ? btnActive : btnIdle}`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-[#7A6A5E] px-1">…</span>}
          <button onClick={() => go(totalPages)} className={`${btnBase} ${btnIdle}`}>
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        className={`${btnBase} ${page >= totalPages ? btnDisabled : btnIdle}`}
      >
        ›
      </button>
    </div>
  );
}
