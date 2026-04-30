"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-4xl mb-4">😕</p>
        <p className="font-serif text-xl text-[#2C2420] mb-2">Có lỗi xảy ra</p>
        <p className="text-sm text-[#7A6A5E] mb-6 max-w-xs">
          {error.message || "Không thể tải dữ liệu. Vui lòng thử lại."}
        </p>
        <button
          onClick={reset}
          className="px-5 py-2 bg-[#8B6F47] text-white text-sm font-medium rounded-lg hover:bg-[#7a6040] transition-colors"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
