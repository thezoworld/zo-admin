import { NextResponse, type NextRequest } from "next/server"

// Cookie name set by /api/auth/session. When the cookie auth flow is enabled
// (i.e. the Zo backend can accept a cookie-bearing login), this middleware
// blocks unauthenticated access to /dashboard/* server-side and preserves the
// originally-requested URL in `?next=`.
//
// Until the cookie is being set, this middleware is a no-op for the existing
// localStorage flow: it lets every request through.
const SESSION_COOKIE = "zo_session"

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const isProtectedRoute = pathname.startsWith("/dashboard")
  if (!isProtectedRoute) return NextResponse.next()

  // Soft-launch mode: if no session cookie has ever been issued, fall back to
  // the client-side gate in app/dashboard/layout.tsx. Once /api/auth/session
  // starts setting the cookie this branch flips on automatically.
  const hasSessionCookie = request.cookies.has(SESSION_COOKIE)
  const cookieFlowEnabled = process.env.NEXT_PUBLIC_AUTH_COOKIE_FLOW === "on"
  if (!cookieFlowEnabled) return NextResponse.next()
  if (hasSessionCookie) return NextResponse.next()

  const loginUrl = new URL("/login", request.url)
  if (pathname !== "/" && pathname !== "/login") {
    loginUrl.searchParams.set("next", `${pathname}${search ?? ""}`)
  }
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
