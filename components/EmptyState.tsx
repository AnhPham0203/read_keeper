export default function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-5xl mb-4">📚</span>
      <p className="text-[#2C2420] font-serif text-lg mb-1">
        {hasFilters ? "Không tìm thấy bài nào" : "Chưa có bài viết nào"}
      </p>
      <p className="text-[#7A6A5E] text-sm">
        {hasFilters
          ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
          : "Cài Chrome Extension và lưu bài viết đầu tiên của bạn."}
      </p>
    </div>
  );
}
