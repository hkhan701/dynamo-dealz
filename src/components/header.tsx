"use client"

import Image from "next/image"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

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
            <Image src="/logo-png.png" alt="Logo" fill className="object-contain p-0.5" />
          </div>

          <div className="hidden md:block mb-1">
            <h1 className="etna-text text-2xl font-bold text-white">
              Oh Canada Deals
            </h1>
          </div>
        </div>

        <div className="md:flex md:w-1/3 lg:w-1/2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search deals..."
              className="w-full rounded-full border-muted-foreground/20 pl-10 pr-4"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
