"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl">🔖</span>
          <h1 className="mt-3 font-serif text-2xl text-[#2C2420]">Readkeeper</h1>
          <p className="mt-1 text-sm text-[#7A6A5E]">Bộ sưu tập bài đọc cá nhân</p>
        </div>

        {sent ? (
          <div className="bg-[#F2EDE4] border border-[#E2D9CC] rounded-xl p-6 text-center">
            <p className="text-2xl mb-2">📬</p>
            <p className="font-medium text-[#2C2420]">Kiểm tra email của bạn</p>
            <p className="mt-1 text-sm text-[#7A6A5E]">
              Link đăng nhập đã được gửi tới <strong>{email}</strong>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#F2EDE4] border border-[#E2D9CC] rounded-xl p-6">
            <label className="block text-xs font-semibold text-[#7A6A5E] uppercase tracking-wide mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="your@email.com"
              className="w-full px-3 py-2.5 border border-[#E2D9CC] rounded-lg bg-[#FAF7F2] text-[#2C2420] placeholder:text-[#7A6A5E] focus:outline-none focus:border-[#8B6F47] text-sm mb-4 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-2.5 bg-[#8B6F47] text-white rounded-lg font-semibold text-sm disabled:opacity-50 hover:bg-[#7a6040] transition-colors"
            >
              {loading ? "Đang gửi…" : "Gửi Magic Link"}
            </button>
            {error && (
              <p className="mt-3 text-xs text-red-600 text-center">{error}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
