// Single source of truth for brand-level constants used across the app.
//
// Everything that names the product or points at brand assets should be
// imported from here. If it ever needs to swap (white-label, rebrand,
// regional variant), this is the only file to touch.
//
// Keep this file dependency-free: no React, no next/image, no fetch.

export const BRAND_NAME = "Zo World"
export const BRAND_TAGLINE = "Follow Your Heart"
export const BRAND_PRODUCT_NAME = "Zo Admin"

/**
 * Brand image assets. CDN-hosted today; the recommended migration is to
 * commit static assets under `public/brand/` so they're versioned with
 * the code and can't drift behind the CDN. When you move them:
 *  1. Add the file at `public/brand/zo-mark.png` (or .svg).
 *  2. Replace the URL string with a static import:
 *     `import zoMark from "@/public/brand/zo-mark.png"`
 *     and update consumers to use the imported object.
 *  3. Drop `proxy.cdn.zo.xyz` from `next.config.mjs#images.remotePatterns`
 *     once nothing else needs it.
 */
export const BRAND_LOGO = {
  /** Square mark used in the auth header. */
  mark: {
    src: "https://proxy.cdn.zo.xyz/gallery/media/images/0de4ce27-6ca4-4015-8a74-54cdae159712_20260523001302.png",
    width: 40,
    height: 40,
    alt: BRAND_NAME,
  },
  /** Wide background image used on the login card. */
  loginBackground: {
    src: "https://proxy.cdn.zo.xyz/gallery/media/images/a2d7b00a-3742-4f90-a844-a80606d65fab_20260523100537.webp",
    alt: "Zo World travellers",
  },
} as const
