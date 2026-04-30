import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isApi     = path.startsWith("/api/");
  const isPublic  = path.startsWith("/login") || path.startsWith("/auth/");

  // CORS preflight — return immediately
  if (request.method === "OPTIONS" && isApi) {
    return new NextResponse(null, { status: 204, headers: CORS });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session (updateSession equivalent with @supabase/ssr)
  const { data: { user } } = await supabase.auth.getUser();

  // Guard: unauthenticated → redirect to /login
  if (!isApi && !isPublic && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Already logged in → skip /login
  if (path === "/login" && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Attach CORS headers to API responses
  if (isApi) {
    Object.entries(CORS).forEach(([k, v]) => supabaseResponse.headers.set(k, v));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
