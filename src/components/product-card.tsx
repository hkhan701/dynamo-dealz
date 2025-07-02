"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Clock, Star, Copy, ArrowUpRight, ArrowDown, Zap } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow, getAffiliateLink } from "@/lib/utils"
import { UI_MESSAGES } from "@/lib/strings"
import { toast } from "sonner"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
  lastUpdated: Date
}

export default function ProductCard({ product, lastUpdated }: ProductCardProps) {
  const truncatedName = product.name.length > 80 ? `${product.name.substring(0, 80)}...` : product.name
  const lastUpdatedRelative = formatDistanceToNow(lastUpdated)
  const savingsAmount = product.list_price > 0 ? product.list_price - product.final_price : 0

  return (
    <Card className="group relative flex flex-col h-full overflow-hidden bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 via-transparent to-red-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative">
        {/* Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
          {Number(product.final_savings_percent) > 0 && (
            <Badge className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white border-0 shadow-lg text-xs font-medium">
              <ArrowDown className="mr-1 h-3 w-3" />
              {product.final_savings_percent}% OFF
            </Badge>
          )}

          {product.is_lightning_deal && (
            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white border-0 shadow-lg text-xs font-medium animate-pulse">
              <Zap className="mr-1 h-3 w-3" />
              Lightning Deal
            </Badge>
          )}
        </div>

        {/* Product image */}
        <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100/50 p-6">
          <Link
            href={getAffiliateLink(product.hyperlink)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <Image
              src={product.image_link || "/placeholder.svg"}
              alt={product.name}
              width={160}
              height={160}
              className="object-contain max-h-40 max-w-full hover:scale-110 transition-transform duration-500 drop-shadow-sm"
              unoptimized
            />
          </Link>
        </div>
      </div>

      <CardContent className="flex-1 p-4 space-y-3">
        {/* Product name */}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900" title={product.name}>
          <Link
            href={getAffiliateLink(product.hyperlink)}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rose-600 transition-colors duration-200 hover:underline"
          >
            {truncatedName}
          </Link>
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          {product.rating && product.rating_count > 0 ? (
            <>
              <div className="flex items-center bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />
                <span className="font-semibold text-amber-700 text-xs">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-gray-500">({product.rating_count.toLocaleString()})</span>
            </>
          ) : (
            <span className="text-xs text-gray-400 italic">No ratings yet</span>
          )}
        </div>

        {/* Price section */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-end gap-2 min-w-0">
            <span className="text-2xl font-bold text-gray-900 break-words">{`$${product.final_price.toFixed(2)}`}</span>
            {product.list_price > 0 && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm text-gray-400 line-through truncate">{`$${product.list_price.toFixed(2)}`}</span>
                {savingsAmount > 0 && (
                  <span className="text-xs font-semibold text-emerald-600 truncate">{`Save $${savingsAmount.toFixed(2)}`}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Additional savings info */}
        {(product.clip_coupon_savings > 0 ||
          product.clip_coupon_percent_savings > 0 ||
          product.promo_code ||
          product.checkout_discount_amount > 0 ||
          product.checkout_discount_percent > 0) && (
            <div className="rounded-md bg-green-100 p-2 text-xs space-y-2 border border-muted shadow-sm">
              {(
                [
                  product.clip_coupon_percent_savings > 0 && {
                    label: 'Coupon',
                    value: `-${product.clip_coupon_percent_savings}%`,
                  },
                  product.clip_coupon_savings > 0 && {
                    label: 'Coupon',
                    value: `-$${product.clip_coupon_savings}`,
                  },
                  product.promo_code && {
                    label: 'Promo',
                    value: (
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-medium">{product.promo_code}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(product.promo_code || "");
                            toast.success(`Promo code copied: ${product.promo_code}`);
                          }}
                          className="p-1 rounded hover:bg-muted transition"
                          aria-label="Copy promo code"
                        >
                          <Copy className="w-3 h-3 text-muted-foreground" />
                        </button>
                      </div>
                    ),
                  },
                  product.checkout_discount_percent > 0 && {
                    label: 'Checkout Discount',
                    value: `-${product.checkout_discount_percent}%`,
                  },
                  product.checkout_discount_amount > 0 && {
                    label: 'Checkout Discount',
                    value: `-$${product.checkout_discount_amount}`,
                  },
                ].filter(Boolean) as { label: string; value: React.ReactNode }[]
              ).map((discount, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <span>{discount.label}</span>
                  </div>
                  <span className="font-semibold text-green-600">{discount.value}</span>
                </div>
              ))}
            </div>
          )}

        {product.extra_offer && (
          <div className="rounded-md bg-blue-50 p-2 border border-blue-200 shadow-sm mt-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-blue-800 font-semibold text-xs">
                <Badge className="bg-blue-600 text-white text-[10px] font-medium border-0 shadow">
                  Extra Offer
                </Badge>
                <span className="text-xs text-blue-900">{product.extra_offer}</span>
              </div>
            </div>
          </div>
        )}


      </CardContent>

      <CardFooter className="flex flex-col p-4 pt-0 space-y-3">
        {/* Action buttons */}
        <div className="flex flex-wrap w-full gap-2">
          <Button
            asChild
            className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 group"
          >
            <Link
              href={getAffiliateLink(product.hyperlink)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <span className="font-medium">View Deal</span>
              <ArrowUpRight className="h-4 w-4 transform transition-transform duration-300 group-hover:rotate-45 group-hover:translate-x-1" />
            </Link>
          </Button>

          {/* Copy Link Button */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => {
              navigator.clipboard.writeText(getAffiliateLink(product.hyperlink))
              toast.success(UI_MESSAGES.linkCopied)
            }}
            className="h-10 w-full sm:w-10 flex items-center justify-center gap-2 text-sm"
          >
            <Copy className="h-4 w-4 text-gray-600" />
            <span className="block sm:hidden">Copy link</span>
          </Button>
        </div>

        {/* Timestamp aligned left */}
        <div className="flex w-full items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Updated {lastUpdatedRelative} ago</span>
        </div>
      </CardFooter>
    </Card>
  )
}
