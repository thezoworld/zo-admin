import type { Metadata } from "next"

import { BrandMark } from "@/components/brand/brand-mark"
import { ThemeToggle } from "@/components/theme-toggle"
import { LoginForm } from "@/features/auth"
import { BRAND_PRODUCT_NAME } from "@/lib/branding"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the Zo Admin dashboard.",
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <BrandMark
        className="absolute top-6 left-6 md:top-10 md:left-10"
        priority
      />
      <ThemeToggle className="absolute top-6 right-6 md:top-10 md:right-10" />

      <section
        aria-labelledby="login-heading"
        className="w-full max-w-sm md:max-w-4xl"
      >
        <h1 id="login-heading" className="sr-only">
          Sign in to {BRAND_PRODUCT_NAME}
        </h1>
        <LoginForm />
      </section>
    </main>
  )
}
