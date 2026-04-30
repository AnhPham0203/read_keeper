"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <button
      onClick={logout}
      className="text-xs text-[#7A6A5E] hover:text-[#2C2420] px-2 py-1 rounded transition-colors"
    >
      Đăng xuất
    </button>
  );
}
