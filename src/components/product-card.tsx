'use client'

import Image from "next/image"
import Link from "next/link"
import { Clock, Star, Copy, ArrowUpRight, ArrowDown } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow, getAffiliateLink } from "@/lib/utils"
import { UI_MESSAGES } from "@/lib/strings"
import { toast } from "sonner"
import { Product } from "@/types/product"

interface ProductCardProps {
  product: Product,
  lastUpdated: Date
}

export default function ProductCard({ product, lastUpdated }: ProductCardProps) {
  const truncatedName = product.name.length > 80 ? `${product.name.substring(0, 80)}...` : product.name
  const lastUpdatedRelative = formatDistanceToNow(lastUpdated)

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative">
        {/* Discount badge */}
        {Number(product.final_savings_percent) > 0 && (
          <Badge className="absolute left-2 top-2 z-10 bg-red-600 hover:bg-red-700 text-xs">
            <ArrowDown className="mr-1 h-4 w-4" />
            {product.final_savings_percent}% price drop
          </Badge>
        )}

        {/* Product image */}
        <div className="relative flex h-40 sm:h-48 items-center justify-center bg-white p-2 sm:p-4">
          <Image
            src={product.image_link}
            alt={product.name}
            width={150}
            height={150}
            className="h-full object-contain hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        </div>
      </div>

      <CardContent className="grid gap-2 p-3 sm:p-4">
        <h3 className="line-clamp-2 text-sm font-medium leading-tight" title={product.name}>
          {truncatedName}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 text-xs">
          {product.rating && product.rating_count > 0 ? (
            <>
              <div className="flex items-center bg-amber-50 px-2 py-1 rounded-full">
                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 mr-1" />
                <span className="font-semibold text-amber-700">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground" title="Number of Ratings">({product.rating_count.toLocaleString()})</span>
            </>
          ) : (
            <span className="text-muted-foreground italic">No Ratings</span>
          )}
        </div>

        {/* Price info */}
        <div className="flex items-end gap-2 mt-1">
          <span className="text-xl font-bold text-primary">${product.final_price.toFixed(2)}</span>
          {product.list_price > 0 && (
            <span className="text-sm text-muted-foreground line-through mb-0.5">${product.list_price.toFixed(2)}</span>
          )}
        </div>

        {/* Additional savings info */}
        {(Number(product.clip_coupon_savings) > 0 || product.promo_code) && (
          <div className="rounded-md bg-muted/50 p-2 text-xs space-y-2 border border-muted shadow-sm">

            {/* Clip Coupon */}
            {Number(product.clip_coupon_savings) > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span>Coupon</span>
                </div>
                <span className="font-semibold text-green-600">
                  -${product.clip_coupon_savings}
                </span>
              </div>
            )}

            {/* Promo Code with Copy */}
            {product.promo_code && (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span>Promo</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-mono font-medium">{product.promo_code}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(product.promo_code || "")
                      toast.success(`Promo code copied: ${product.promo_code}`, {
                        style: {
                          backgroundColor: '#dcfce7', // Tailwind green-100
                          color: '#166534'            // Tailwind green-700
                        }
                      })
                    }}
                    className="p-1 rounded hover:bg-muted transition"
                    aria-label="Copy promo code"
                  >
                    <Copy className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3 p-3 sm:p-4 pt-0">
        <div className="flex flex-wrap w-full gap-2">
          {/* View Deal Button */}
          <Button asChild className="flex-1 gap-2 group bg-leaf-background hover:bg-leaf-background/80 text-white">
            <Link
              href={getAffiliateLink(product.hyperlink)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              View Deal
              <ArrowUpRight
                className="h-4 w-4 transform transition-transform duration-300 group-hover:rotate-45 group-hover:translate-x-1"
              />
            </Link>
          </Button>

          {/* Copy Link Button */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => {
              navigator.clipboard.writeText(getAffiliateLink(product.hyperlink))
              toast.success(UI_MESSAGES.linkCopied, {
                style: {
                  backgroundColor: '#dcfce7', // Tailwind green-100
                  color: '#166534'            // Tailwind green-700
                }
              })
            }}
            className="h-10 w-full sm:w-10 flex items-center justify-center gap-2 text-sm"
          >
            <Copy className="h-4 w-4" />
            <span className="block sm:hidden">Copy Link</span>
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
