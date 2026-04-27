import type { NextRequest } from "next/server";
import { createAdminClient } from "./supabase/admin";
import { createClient as createServerSupabaseClient } from "./supabase/server";

// Supports both cookie-based sessions (web app) and Bearer tokens (Chrome extension)
export async function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const { data } = await createAdminClient().auth.getUser(token);
    return data.user;
  }
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}
