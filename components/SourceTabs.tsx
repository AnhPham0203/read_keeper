"use client";

import { useRouter, useSearchParams } from "next/navigation";

const TABS = [
  { label: "Tất cả", value: "" },
  { label: "Facebook", value: "facebook" },
  { label: "Substack", value: "substack" },
  { label: "Khác", value: "other" },
];

export default function SourceTabs({ active }: { active: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function select(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("source", value);
    else params.delete("source");
    params.delete("page");
    router.push(`?${params}`);
  }

  return (
    <div className="flex gap-1 border-b border-[#E2D9CC]">
      {TABS.map((tab) => {
        const isActive = active === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => select(tab.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              isActive
                ? "border-[#8B6F47] text-[#8B6F47]"
                : "border-transparent text-[#7A6A5E] hover:text-[#2C2420]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
