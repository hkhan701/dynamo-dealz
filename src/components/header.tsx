'use client'

import { useState, useRef } from "react"
import Image from "next/image"
import { Share2, Facebook, Link as LinkIcon, Zap } from "lucide-react"
import { buildShareUrl, WEBSITE_URL, SHARE_TEXT, useClickOutside } from "@/lib/utils"
import { UI_MESSAGES } from "@/lib/strings"
import { toast } from "sonner"

export default function Header() {
  const [showShareOptions, setShowShareOptions] = useState(false)
  const shareOptionsRef = useRef<HTMLDivElement>(null)

  // Detect click outside share dock
  useClickOutside(shareOptionsRef, () => setShowShareOptions(false))

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
      <div className="mx-auto flex w-11/12 sm:max-w-[80%] md:max-w-[66%] lg:max-w-[50%] items-center justify-between rounded-full px-6 py-2 bg-leaf-background/80 backdrop-blur-md border border-border/40 shadow-md">

        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full shadow-sm">
            <Image src="/ohcanadadealslogo.png" alt="Logo" fill className="object-contain p-0.5 rounded-2xl" />
          </div>
          <div className="md:block mb-1">
            <h1 className="etna-text text-2xl font-bold text-white">{UI_MESSAGES.oHCanadaDeals}</h1>
          </div>
        </div>

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

            {/* Additional incentive text */}
            <div className="mt-3 pt-3 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                🎁 More shares = Better deals for everyone!
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}