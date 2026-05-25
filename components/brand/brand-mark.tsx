import Image from "next/image"

import { BRAND_LOGO, BRAND_NAME, BRAND_TAGLINE } from "@/lib/branding"
import { cn } from "@/lib/utils"

type BrandMarkProps = {
  className?: string
  /** Hide the wordmark + tagline; renders the logo only. */
  iconOnly?: boolean
  /** Set true on above-the-fold uses (e.g. the login page) for LCP. */
  priority?: boolean
}

/**
 * Brand identity block: square mark + product name + tagline.
 *
 * Used on every unauthenticated page (login today; signup / forgot-password
 * tomorrow). Pulls every string and asset from `@/lib/branding` so the
 * brand can be swapped in one place.
 */
export function BrandMark({
  className,
  iconOnly = false,
  priority = false,
}: BrandMarkProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src={BRAND_LOGO.mark.src}
        alt={BRAND_LOGO.mark.alt}
        width={BRAND_LOGO.mark.width}
        height={BRAND_LOGO.mark.height}
        priority={priority}
        className="h-10 w-10 object-contain"
      />
      {iconOnly ? null : (
        <div className="flex flex-col leading-tight">
          <span className="text-base font-bold">{BRAND_NAME}</span>
          <span className="text-xs text-muted-foreground">{BRAND_TAGLINE}</span>
        </div>
      )}
    </div>
  )
}
