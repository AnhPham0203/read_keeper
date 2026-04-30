import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-5xl mb-4">📭</p>
        <p className="font-serif text-xl text-[#2C2420] mb-2">Không tìm thấy trang</p>
        <p className="text-sm text-[#7A6A5E] mb-6">Trang này không tồn tại hoặc đã bị xóa.</p>
        <Link
          href="/"
          className="px-5 py-2 bg-[#8B6F47] text-white text-sm font-medium rounded-lg hover:bg-[#7a6040] transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
