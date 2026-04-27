"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ArticleToolbar({
  articleId,
  initialIsRead,
}: {
  articleId: string;
  initialIsRead: boolean;
}) {
  const router = useRouter();
  const [isRead, setIsRead] = useState(initialIsRead);
  const [deleting, setDeleting] = useState(false);

  async function toggleRead() {
    const next = !isRead;
    setIsRead(next); // optimistic
    try {
      await fetch(`/api/articles/${articleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: next }),
      });
    } catch {
      setIsRead(!next); // rollback
    }
  }

  async function handleDelete() {
    if (!window.confirm("Xóa bài viết này? Không thể hoàn tác.")) return;
    setDeleting(true);
    await fetch(`/api/articles/${articleId}`, { method: "DELETE" });
    router.push("/");
  }

  const btnBase =
    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors";

  return (
    <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-3 bg-[#FAF7F2]/95 backdrop-blur border-b border-[#E2D9CC]">
      <button
        onClick={() => router.push("/")}
        className={`${btnBase} border-transparent text-[#7A6A5E] hover:text-[#2C2420]`}
      >
        <span>←</span>
        <span>Quay lại</span>
      </button>

      <div className="flex-1" />

      <button
        onClick={toggleRead}
        className={`${btnBase} ${
          isRead
            ? "border-[#8B6F47] text-[#8B6F47] bg-[#F2EDE4]"
            : "border-[#E2D9CC] text-[#7A6A5E] bg-[#F2EDE4] hover:border-[#8B6F47]"
        }`}
      >
        <span>{isRead ? "✓" : "○"}</span>
        <span>{isRead ? "Đã đọc" : "Chưa đọc"}</span>
      </button>

      <button
        onClick={handleDelete}
        disabled={deleting}
        className={`${btnBase} border-[#E2D9CC] text-[#7A6A5E] bg-[#F2EDE4] hover:border-red-400 hover:text-red-500 disabled:opacity-40`}
      >
        <span>🗑</span>
        <span>Xóa</span>
      </button>
    </div>
  );
}
