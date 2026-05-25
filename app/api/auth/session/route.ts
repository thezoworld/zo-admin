import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"

import { env } from "@/lib/env"

const SESSION_COOKIE = "zo_session"

const bodySchema = z.object({
  token: z.string().min(1),
  expiresAt: z
    .union([z.string(), z.number()])
    .transform((v) => new Date(v).getTime()),
})

/**
 * POST /api/auth/session
 * Body: { token, expiresAt }
 *
 * Mirrors the Zo bearer token into an httpOnly cookie so the middleware can
 * gate /dashboard/* server-side. Call this from the login flow right after
 * a successful `auth.login(user, token, validTill)` to opt into the
 * cookie-protected route. Existing localStorage auth keeps working.
 */
export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const { token, expiresAt } = parsed.data
  const maxAgeMs = Math.max(0, expiresAt - Date.now())
  if (maxAgeMs === 0) {
    return NextResponse.json(
      { error: "Token already expired" },
      { status: 400 }
    )
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: Math.floor(maxAgeMs / 1000),
  })
  return response
}

/** DELETE /api/auth/session — clear the cookie (also used by /api/auth/logout). */
export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  })
  return response
}
