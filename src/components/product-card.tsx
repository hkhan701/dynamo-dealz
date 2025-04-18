'use client'

import Image from "next/image"
import Link from "next/link"
import { Clock, Star, Copy, ArrowUpRight, ArrowDown } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow, getAffiliateLink } from "@/lib/utils"
import { UI_MESSAGES } from "@/lib/strings"
import CopyAlert from "@/components/copy-alert"
import { useState } from "react"

interface ProductCardProps {
  product: {
    name: string
    asin: string
    list_price: number
    current_price: number
    percent_off_list_price: string
    clip_coupon_savings: string
    promo_code: string
    promo_code_percent_off: string
    final_savings_percent: number
    final_price: number
    hyperlink: string
    image_link: string
    rating: number
    rating_count: number
  }
  lastUpdated: Date
}

export default function ProductCard({ product, lastUpdated }: ProductCardProps) {
  const truncatedName = product.name.length > 80 ? `${product.name.substring(0, 80)}...` : product.name
  const lastUpdatedRelative = formatDistanceToNow(lastUpdated)
  const [showCopiedAlert, setShowCopiedAlert] = useState(false)

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
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {product.rating && product.rating_count > 0 ? (
            <>
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
              <span>({product.rating_count})</span>
            </>
          ) : (
            <span className="text-muted-foreground">No Ratings</span>
          )}
        </div>

        {/* Price info */}
        <div className="flex flex-wrap items-center justify-between">
          <span className="text-lg font-bold">${product.final_price.toFixed(2)}</span>
          {product.list_price && (
            <span className="text-sm text-muted-foreground line-through">${product.list_price.toFixed(2)}</span>
          )}
        </div>

        {/* Additional savings info */}
        {(Number(product.clip_coupon_savings) > 0 || product.promo_code) && (
          <div className="space-y-1 rounded-md bg-muted p-2 text-xs">
            {Number(product.clip_coupon_savings) > 0 && (
              <div className="flex justify-between">
                <span>Coupon:</span>
                <span className="font-medium text-green-600">-${product.clip_coupon_savings}</span>
              </div>
            )}
            {product.promo_code && (
              <div className="flex justify-between">
                <span>Promo Code:</span>
                <span className="font-medium">{product.promo_code}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3 p-3 sm:p-4 pt-0">
        <div className="flex flex-wrap w-full gap-2">
          {/* View Deal Button */}
          <Button asChild className="flex-1 gap-2 group">
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
              navigator.clipboard.writeText(getAffiliateLink(product.hyperlink));
              setShowCopiedAlert(true);
            }}
            className="h-10 w-full sm:w-10 flex items-center justify-center gap-2 text-sm"
          >
            <Copy className="h-4 w-4" />
            <span className="block sm:hidden">Copy Link</span>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Last updated {lastUpdatedRelative} ago</span>
        </div>
      </CardFooter>

      <CopyAlert
        show={showCopiedAlert}
        onDismiss={() => setShowCopiedAlert(false)}
        message={UI_MESSAGES.linkCopied}
      />
    </Card>
  )
}
