'use client'

import { useState, useRef } from "react"
import Image from "next/image"
import { Share2, Facebook, Link as LinkIcon } from "lucide-react"
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
      toast.success(UI_MESSAGES.linkCopied, {
        style: {
          backgroundColor: '#dcfce7', // Tailwind green-100
          color: '#166534'            // Tailwind green-700
        }
      })
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

        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full shadow-sm">
            <Image src="/ohcanadadealslogo.png" alt="Logo" fill className="object-contain p-0.5 rounded-2xl" />
          </div>
          <div className="md:block mb-1">
            <h1 className="etna-text text-2xl font-bold text-white">{UI_MESSAGES.oHCanadaDeals}</h1>
          </div>
        </div>

        {/* Share Button */}
        <div className="relative" ref={shareOptionsRef}>
          <button
            onClick={() => setShowShareOptions(prev => !prev)}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Share"
          >
            <Share2 className="h-5 w-5 text-white" />
          </button>

          {/* Share Options */}
          <div
            className={`absolute right-0 mt-2 p-3 bg-slate-100 rounded-lg shadow-lg z-50 flex gap-4 transform transition-all duration-200 ease-in-out ${showShareOptions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
              }`}
          >
            <button onClick={() => handleShare("facebook")} className="flex flex-col items-center hover:scale-110 transition-transform" title="Share on Facebook">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <Facebook className="h-5 w-5 text-white" />
              </div>
            </button>

            <button onClick={() => handleShare("twitter")} className="flex flex-col items-center hover:scale-110 transition-transform" title="Share on X (Twitter)">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                <Image src="/x.svg" alt="X Logo" width={20} height={20} className="invert" />
              </div>
            </button>

            <button onClick={() => handleShare("whatsapp")} className="flex flex-col items-center hover:scale-110 transition-transform" title="Share on WhatsApp">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                <Image src="/whatsapp.svg" alt="WhatsApp Logo" width={20} height={20} className="invert" />
              </div>
            </button>

            <button onClick={() => handleShare("copy")} className="flex flex-col items-center hover:scale-110 transition-transform" title="Copy link">
              <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center">
                <LinkIcon className="h-5 w-5 text-white" />
              </div>
            </button>

          </div>
        </div>
      </div>

    </header>
  )
}
