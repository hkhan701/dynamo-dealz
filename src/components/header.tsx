"use client"
import { usePathname } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useState, useRef } from "react"
import { Share2, Facebook, Link as LinkIcon, Zap, Users } from "lucide-react"
import {
  buildShareUrl,
  WEBSITE_URL,
  SHARE_TEXT,
  useClickOutside,
  goToFacebookGroup,
} from "@/lib/utils"
import { UI_MESSAGES } from "@/lib/strings"
import { toast } from "sonner"
import Link from "next/link"

export default function Header() {
  const [showShareOptions, setShowShareOptions] = useState(false)
  const shareOptionsRef = useRef<HTMLDivElement>(null)
  useClickOutside(shareOptionsRef, () => setShowShareOptions(false))

  const pathname = usePathname()
  const isCanada = pathname.startsWith("/ca")
  const isUSA = pathname.startsWith("/us")

  const currentCountry = isCanada ? "Canada" : isUSA ? "USA" : "Canada"
  const currentFlag = isCanada
    ? "CA.svg"
    : "US.svg"

  const handleShare = (platform: string) => {
    if (platform === "copy") {
      navigator.clipboard.writeText(WEBSITE_URL)
      setShowShareOptions(false)
      toast.success(UI_MESSAGES.linkCopied)
      return
    }

    const shareUrl = buildShareUrl(platform, WEBSITE_URL, SHARE_TEXT)
    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer")
    }
    setShowShareOptions(false)
  }

  return (
    <header className="sticky top-0 z-50 flex w-full justify-center py-4">
      <div className="mx-auto flex w-11/12 sm:max-w-[80%] md:max-w-[66%] lg:max-w-[50%] items-center justify-between rounded-full px-4 py-2 bg-leaf-background/80 backdrop-blur-md border border-border/40 shadow-md">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Logo + Title */}
          <div className="relative h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-full shadow-sm">
            <Image src="/dynamodealzlogo.png" alt="Logo" fill className="object-contain p-0.5 rounded-sm" />
          </div>
          <h1 className="text-white font-bold etna-text text-lg sm:text-xl md:text-2xl text-wrap mb-2">
            {UI_MESSAGES.siteTitle}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Country Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-md border bg-white text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-100 transition">
              <Image src={currentFlag} alt={`${currentCountry} Flag`} width={20} height={15} />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44 p-1">
              <Link href="/ca" passHref>
                <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 cursor-pointer">
                  <Image src="CA.svg" alt="Canada Flag" width={20} height={15} />
                  <span>Canada</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/us" passHref>
                <DropdownMenuItem
                  className="flex items-center gap-2 px-3 py-2"
                >
                  <Image src="US.svg" alt="USA Flag" width={20} height={15} />
                  <span>USA</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Share Button and Panel */}
          <div className="relative" ref={shareOptionsRef}>
            <button
              onClick={() => setShowShareOptions(prev => !prev)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Share"
            >
              <Share2 className="h-5 w-5 text-white" />
            </button>

            <div
              className={`absolute right-0 mt-3 p-4 bg-white rounded-xl shadow-2xl z-50 transform transition-all duration-200 ease-in-out border border-gray-100 ${showShareOptions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
            >
              {/* Header with incentive */}
              <div className="text-center mb-3 pb-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800 flex items-center justify-center gap-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Share for Better Deals!
                </p>
                <p className="text-xs text-gray-600 mt-1">Help others save money too</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleShare("facebook")}
                  className="flex flex-col items-center hover:scale-110 transition-all duration-200 group"
                  title="Share on Facebook"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-md group-hover:shadow-lg">
                    <Facebook className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-600 mt-1">Facebook</span>
                </button>

                <button
                  onClick={() => handleShare("twitter")}
                  className="flex flex-col items-center hover:scale-110 transition-all duration-200 group"
                  title="Share on X (Twitter)"
                >
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center shadow-md group-hover:shadow-lg">
                    <Image src="/x.svg" alt="X Logo" width={24} height={24} className="invert" />
                  </div>
                  <span className="text-xs text-gray-600 mt-1">Twitter</span>
                </button>

                <button
                  onClick={() => handleShare("whatsapp")}
                  className="flex flex-col items-center hover:scale-110 transition-all duration-200 group"
                  title="Share on WhatsApp"
                >
                  <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center shadow-md group-hover:shadow-lg">
                    <Image src="/whatsapp.svg" alt="WhatsApp Logo" width={24} height={24} className="invert" />
                  </div>
                  <span className="text-xs text-gray-600 mt-1">WhatsApp</span>
                </button>

                <button
                  onClick={() => handleShare("copy")}
                  className="flex flex-col items-center hover:scale-110 transition-all duration-200 group"
                  title="Copy link"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center shadow-md group-hover:shadow-lg">
                    <LinkIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-600 mt-1">Copy Link</span>
                </button>
              </div>

              {/* Facebook Group Join Button */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => goToFacebookGroup()}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
                  title="Join our Facebook group"
                >
                  <Users className="h-8 w-8" />
                  Join Our Canadian Facebook Group
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  🎯 Never miss another bargain!
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}