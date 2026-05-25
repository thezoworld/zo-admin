import { NextResponse } from "next/server"

import { env } from "@/lib/env"

const SESSION_COOKIE = "zo_session"

export async function POST() {
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
