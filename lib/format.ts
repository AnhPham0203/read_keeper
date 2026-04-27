export function formatRelativeTime(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const min = Math.floor(diff / 60_000);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (min < 1) return "Vừa xong";
  if (min < 60) return `${min} phút trước`;
  if (hr < 24) return `${hr} giờ trước`;
  if (day < 30) return `${day} ngày trước`;
  return new Date(dateString).toLocaleDateString("vi-VN");
}

export function sourceLabel(source: string | null): string {
  if (source === "facebook") return "Facebook";
  if (source === "substack") return "Substack";
  if (source === "other") return "Khác";
  return source ?? "";
}
