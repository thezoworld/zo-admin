import { withSentryConfig } from "@sentry/nextjs"

const isDev = process.env.NODE_ENV !== "production"

// Static brand / CDN / vendor origins — these don't move.
const CDN = "https://proxy.cdn.zo.xyz"
const STATIC_CDN = "https://static.cdn.zo.xyz"
const RECAPTCHA = "https://www.google.com https://www.gstatic.com"
const SENTRY = "https://*.sentry.io https://*.ingest.sentry.io"

/**
 * API origins for `connect-src`. Derived from env vars so the CSP follows
 * whatever the app is actually pointed at (e.g. nsfp staging, regional
 * variants). Falls back to the production hosts if env isn't set so the
 * default `next build` still works.
 *
 * NOTE: this file runs at build time and can't use `lib/env.ts` (which
 * does runtime validation). Reading `process.env` directly is the
 * documented exception for config files.
 */
function origin(url) {
  if (!url) return ""
  try {
    return new URL(url).origin
  } catch {
    return ""
  }
}

const ZO_API = origin(process.env.NEXT_PUBLIC_API_BASE_URL) || "https://api.io.zo.xyz"
const ZOSTEL_API =
  origin(process.env.NEXT_PUBLIC_API_BASE_URL_ZOSTEL) || "https://api.zostel.com"
const SOCKET_URL = origin(
  // ws:// / wss:// are valid scheme inputs for `new URL`.
  process.env.NEXT_PUBLIC_API_SOCKET_URL
)

/**
 * Content Security Policy.
 *
 * The script-src directive includes 'unsafe-inline' because Next.js inlines
 * its runtime config and React hydration data. In dev we also need
 * 'unsafe-eval' for Turbopack/HMR. The full strict-nonce migration is a
 * separate workstream that requires per-request middleware; the policy here
 * still defends against the most common XSS exfiltration vectors by locking
 * down connect-src, frame-src, and object-src.
 */
function contentSecurityPolicy() {
  const scriptSrc = isDev
    ? `'self' 'unsafe-inline' 'unsafe-eval' ${RECAPTCHA}`
    : `'self' 'unsafe-inline' ${RECAPTCHA}`

  const connectSrc = [
    "'self'",
    ZO_API,
    ZOSTEL_API,
    SOCKET_URL,
    RECAPTCHA,
    SENTRY,
  ]
    .filter(Boolean)
    .join(" ")

  const directives = [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: ${CDN} ${STATIC_CDN}`,
    `font-src 'self' data:`,
    `connect-src ${connectSrc}`,
    `frame-src 'self' ${RECAPTCHA}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
  ]

  return directives.join("; ")
}

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy(),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "off" },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "proxy.cdn.zo.xyz",
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to every route.
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },
}

const hasSentryDsn = Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN)

export default hasSentryDsn
  ? withSentryConfig(nextConfig, {
      silent: !process.env.CI,
      hideSourceMaps: true,
      disableLogger: true,
      tunnelRoute: "/monitoring",
      automaticVercelMonitors: false,
    })
  : nextConfig
