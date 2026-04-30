export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header skeleton */}
      <div className="border-b border-[#E2D9CC] bg-[#FAF7F2] sticky top-0 z-10 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="h-6 w-28 bg-[#E2D9CC] rounded animate-pulse mb-3" />
          <div className="h-9 bg-[#E2D9CC] rounded-lg animate-pulse" />
          <div className="flex gap-1 mt-2">
            {[80, 70, 80, 50].map((w, i) => (
              <div key={i} className="h-8 bg-[#E2D9CC] rounded animate-pulse" style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>

      {/* Card skeletons */}
      <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-3 p-4 bg-[#F2EDE4] rounded-lg border border-[#E2D9CC] animate-pulse">
            <div className="w-20 h-20 bg-[#E2D9CC] rounded flex-shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-[#E2D9CC] rounded w-4/5" />
              <div className="h-4 bg-[#E2D9CC] rounded w-3/5" />
              <div className="h-3 bg-[#E2D9CC] rounded w-2/5 mt-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
