import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Use getUser() not getSession() — getSession() can return null in middleware
  // even when the user is authenticated, causing false redirect loops
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isOnDashboard = pathname.startsWith("/dashboard");
  const isOnSignIn = pathname === "/signin";

  // Only redirect to /signin if user is genuinely not authenticated
  if (isOnDashboard && !user) {
    const redirectUrl = new URL("/signin", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Don't auto-redirect from signin - let the page handle it
  // if (isOnSignIn && user) {
  //   const redirectUrl = new URL("/dashboard", request.url);
  //   return NextResponse.redirect(redirectUrl);
  // }

  return response;
}

export const config = {
  // Include /dashboard exactly (no path) so the role-redirect page is also protected
  matcher: ["/dashboard", "/dashboard/:path*", "/signin"],
};
