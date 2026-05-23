"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import {
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js"

import { cn } from "@/lib/utils"

export type Country = {
  code: CountryCode
  name: string
  dial: string
  flag: string
}

function isoToFlagEmoji(iso: string) {
  return iso
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
}

const regionNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null

export const COUNTRIES: Country[] = getCountries()
  .map<Country>((code) => ({
    code,
    name: regionNames?.of(code) ?? code,
    dial: `+${getCountryCallingCode(code)}`,
    flag: isoToFlagEmoji(code),
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

export function getCountry(code: CountryCode): Country {
  return (
    COUNTRIES.find((c) => c.code === code) ??
    COUNTRIES.find((c) => c.code === "IN") ??
    COUNTRIES[0]
  )
}

export function CountrySelect({
  value,
  onChange,
  className,
}: {
  value: CountryCode
  onChange: (code: CountryCode) => void
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const current = getCountry(value)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COUNTRIES
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().includes(q)
    )
  }, [query])

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setQuery("")
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={`Country: ${current.name}`}
          className={cn(
            "inline-flex h-full items-center gap-1.5 rounded-l-3xl pl-3 pr-2 text-sm outline-none transition-colors hover:bg-muted/60 focus-visible:bg-muted/60",
            className
          )}
        >
          <span aria-hidden="true" className="text-base leading-none">
            {current.flag}
          </span>
          <span className="tabular-nums text-muted-foreground">
            {current.dial}
          </span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            strokeWidth={2}
            className="size-3.5 text-muted-foreground"
          />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          className="z-50 w-(--radix-popover-trigger-width) min-w-72 origin-(--radix-popover-content-transform-origin) overflow-hidden rounded-3xl bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/5 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
        >
          <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2">
            <HugeiconsIcon
              icon={Search01Icon}
              strokeWidth={2}
              className="size-4 text-muted-foreground"
            />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or code"
              className="h-7 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-72 overflow-y-auto overscroll-contain">
            <div className="p-1.5">
              {filtered.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No matches
                </div>
              ) : (
                filtered.map((c) => {
                  const selected = c.code === value
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        onChange(c.code)
                        setOpen(false)
                      }}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-sm font-medium outline-none transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        selected && "bg-accent/60"
                      )}
                    >
                      <span aria-hidden="true" className="text-base leading-none">
                        {c.flag}
                      </span>
                      <span className="flex-1 truncate text-left">
                        {c.name}
                      </span>
                      <span className="tabular-nums text-muted-foreground">
                        {c.dial}
                      </span>
                      {selected ? (
                        <HugeiconsIcon
                          icon={Tick02Icon}
                          strokeWidth={2}
                          className="size-4"
                        />
                      ) : null}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
