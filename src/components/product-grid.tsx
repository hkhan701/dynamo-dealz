'use client'

import { useEffect, useMemo, useState } from "react"
import Fuse from "fuse.js"
import ProductCard from "@/components/product-card"
import { Input } from "./ui/input"
import { Search } from "lucide-react"

interface Product {
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
  last_updated_time: string
}

interface Props {
  products: Product[]
}

export default function ProductGrid({ products }: Props) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])

  // Setup Fuse instance with config
  const fuse = useMemo(() => {
    return new Fuse(products, {
      keys: ['name'],         // Search on product name
      threshold: 0.3,         // Lower = stricter (0 = exact match, 1 = match all)
      ignoreLocation: true,   // Better for large text
      minMatchCharLength: 2,  // Helps skip 1-letter matches
    })
  }, [products])

  // Run search when query changes
  useEffect(() => {
    if (query.trim() === "") {
      setResults(products)
    } else {
      const fuseResults = fuse.search(query)
      setResults(fuseResults.map(res => res.item))
    }
  }, [query, fuse, products])

  return (
    <main className="flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-screen-xl mx-auto">

        {/* Search Bar */}
        <div className="w-full max-w-lg mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search deals..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full rounded-full pl-12 pr-4 py-2 shadow-sm border border-muted-foreground/20 focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {results.map((product, index) => (
            <ProductCard
              key={index}
              product={product}
              lastUpdated={new Date(product.last_updated_time)}
            />
          ))}
        </div>

        {results.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">No products found.</p>
        )}
      </div>
    </main>
  )
}
