'use client'

import Image from "next/image"
import Link from "next/link"
import { Tag, ShoppingCart, Clock } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow, getAffiliateLink } from "@/lib/utils"

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
  }
  lastUpdated: Date
}

export default function ProductCard({ product, lastUpdated }: ProductCardProps) {
  // Truncate product name for display
  const truncatedName = product.name.length > 80 ? `${product.name.substring(0, 80)}...` : product.name

  // Format the last updated time
  const lastUpdatedRelative = formatDistanceToNow(lastUpdated)

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        {/* Discount badge */}
        {Number(product.final_savings_percent) > 0 && (
          <Badge className="absolute left-2 top-2 z-10 bg-red-600 hover:bg-red-700">
            <Tag className="mr-1 h-3.5 w-3.5" />
            {product.final_savings_percent}% OFF
          </Badge>
        )}

        {/* Product image */}
        <div className="relative flex h-48 items-center justify-center bg-white p-4">
          <Image
            src={product.image_link || "/placeholder.svg"}
            alt={product.name}
            width={150}
            height={150}
            className="h-full object-contain"
            unoptimized
          />
        </div>
      </div>

      <CardContent className="grid gap-3 p-4">
        {/* Product name */}
        <h3 className="line-clamp-2 text-sm font-medium leading-tight" title={product.name}>
          {truncatedName}
        </h3>

        {/* Price information */}
        <div className="flex items-center justify-between">
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

      <CardFooter className="flex flex-col gap-3 p-4 pt-0">
        <Button asChild className="w-full gap-2">
          <Link href={getAffiliateLink(product.hyperlink)} target="_blank" rel="noopener noreferrer">
            <ShoppingCart className="h-4 w-4" />
            View Deal
          </Link>
        </Button>

        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Last updated {lastUpdatedRelative} ago</span>
        </div>
      </CardFooter>
    </Card>
  )
}
