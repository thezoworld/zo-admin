import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    SENTRY_AUTH_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_API_BASE_URL: z.string().url(),
    NEXT_PUBLIC_API_BASE_URL_ZOSTEL: z.string().url(),
    NEXT_PUBLIC_APP_ID: z.string().min(1),
    NEXT_PUBLIC_ZOSTEL_APP_ID: z.string().min(1),
    NEXT_PUBLIC_API_SOCKET_URL: z.string().url().optional(),
    NEXT_PUBLIC_GIPHY_API_KEY: z.string().optional(),
    NEXT_PUBLIC_RECAPTCHA_KEY: z.string().optional(),
    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_API_BASE_URL_ZOSTEL:
      process.env.NEXT_PUBLIC_API_BASE_URL_ZOSTEL,
    NEXT_PUBLIC_APP_ID: process.env.NEXT_PUBLIC_APP_ID,
    NEXT_PUBLIC_ZOSTEL_APP_ID: process.env.NEXT_PUBLIC_ZOSTEL_APP_ID,
    NEXT_PUBLIC_API_SOCKET_URL: process.env.NEXT_PUBLIC_API_SOCKET_URL,
    NEXT_PUBLIC_GIPHY_API_KEY: process.env.NEXT_PUBLIC_GIPHY_API_KEY,
    NEXT_PUBLIC_RECAPTCHA_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_KEY,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  emptyStringAsUndefined: true,
})
