import Image from "next/image"

import { LoginForm } from "@/components/login-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <ThemeToggle className="absolute top-6 right-6 md:top-10 md:right-10" />
      <div className="absolute top-6 left-6 flex items-center gap-3 md:top-10 md:left-10">
        <Image
          src="https://proxy.cdn.zo.xyz/gallery/media/images/0de4ce27-6ca4-4015-8a74-54cdae159712_20260523001302.png"
          alt="Zo World"
          width={40}
          height={40}
          priority
          className="h-10 w-10 object-contain"
        />
        <div className="flex flex-col leading-tight">
          <span className="text-base font-bold">Zo World</span>
          <span className="text-xs text-muted-foreground">
            Follow Your Heart
          </span>
        </div>
      </div>
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}
