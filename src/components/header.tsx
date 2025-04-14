"use client"

import Image from "next/image"

import { cn } from "@/lib/utils"

export default function Header() {
  return (
    <header className={cn("sticky top-0 z-50 flex w-full justify-center py-4")}>
      <div
        className={cn(
          "mx-auto flex w-full max-w-[66%] items-center justify-between rounded-full px-6 py-2",
          "bg-leaf-background/80 backdrop-blur-md",
          "border border-border/40 shadow-md"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full shadow-sm">
            <Image src="/logo-png.png" alt="Logo" fill className="object-contain p-0.5 rounded-2xl" />
          </div>

          <div className="md:block mb-1">
            <h1 className="etna-text text-2xl font-bold text-white">
              Oh Canada Deals
            </h1>
          </div>
        </div>
      </div>
    </header>
  )
}
