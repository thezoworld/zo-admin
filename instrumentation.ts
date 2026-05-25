import { captureRequestError } from "@sentry/nextjs"

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config")
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config")
  }
}

// Next.js looks for an exported `onRequestError` on this module to forward
// request-level errors. Sentry v10 renamed its handler to
// `captureRequestError`, so we alias it.
export const onRequestError = captureRequestError
