'use client'

import { useCallback, useEffect, useMemo, useState } from "react"
import Fuse from "fuse.js"
import ProductCard from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import { Loader2, PackageSearch, Search, Filter, Gift, Ticket } from "lucide-react"
import { UI_MESSAGES } from "@/lib/strings"
import { Product } from "@/types/product"
import { getPageNumbers } from "@/lib/utils"
import { DialogTitle } from "@radix-ui/react-dialog"

interface Props {
  products: Product[]
}

interface FilterState {
  priceRange: [number, number];
  minDiscount: number;
  sortBy?: string;
  specialOffers: {
    coupon: boolean;
    promoCode: boolean;
  };
}


export default function ProductGrid({ products }: Props) {
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>(products)
  const [filteredResults, setFilteredResults] = useState<Product[]>(products)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)

  // Enhanced filter state
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 9999],
    minDiscount: 0,
    sortBy: 'newest',
    specialOffers: {
      coupon: true,
      promoCode: true,
    },
  })

  const fuse = useMemo(() => {
    return new Fuse(products, {
      keys: ['name'],
      threshold: 0.3,
      ignoreLocation: true,
      minMatchCharLength: 2,
    })
  }, [products])

  // Run search when query changes
  useEffect(() => {
    setIsLoading(true)

    if (query.trim() === "") {
      setSearchResults(products)
    } else {
      const fuseResults = fuse.search(query)
      setSearchResults(fuseResults.map((res) => res.item))
    }

    // Reset to first page when search query changes
    setCurrentPage(1)
    setIsLoading(false)
  }, [query, fuse, products])

  // Apply filters to search results
  useEffect(() => {
    setIsLoading(true)
    let result = [...searchResults]

    // Filter by price range
    result = result.filter(
      (product) => product.final_price >= filters.priceRange[0] && product.final_price <= filters.priceRange[1]
    )

    // Filter by minimum discount
    if (filters.minDiscount > 0) {
      result = result.filter((product) => product.final_savings_percent >= filters.minDiscount)
    }

    // Filter by special offers
    if (filters.specialOffers.coupon) {
      result = result.filter((product) => product.clip_coupon_savings && product.clip_coupon_savings !== "")
    }
    if (filters.specialOffers.promoCode) {
      result = result.filter((product) => product.promo_code && product.promo_code !== "")
    }

    // Sort based on selected criteria
    switch (filters.sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.last_updated_time).getTime() - new Date(a.last_updated_time).getTime())
        break
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "reviews":
        result.sort((a, b) => (b.rating_count || 0) - (a.rating_count || 0))
        break
      case "price-asc":
        result.sort((a, b) => a.final_price - b.final_price)
        break
      case "price-desc":
        result.sort((a, b) => b.final_price - a.final_price)
        break
      case "discount":
        result.sort((a, b) => b.final_savings_percent - a.final_savings_percent)
        break
    }


    setFilteredResults(result)
    setIsLoading(false)
  }, [filters, searchResults])

  const totalItems = filteredResults.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const currentItems = filteredResults.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => setCurrentPage(page)

  const clearFilters = useCallback(() => {
    setFilters({
      priceRange: [0, 9999],
      minDiscount: 0,
      sortBy: 'newest',
      specialOffers: {
        coupon: true,
        promoCode: true,
      },
    })
    setCurrentPage(1)
    setIsFilterSheetOpen(false)
  }, [])

  const FilterComponent = useMemo(() => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-slate-700 flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </h4>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <h5 className="font-medium text-sm text-slate-600">Price Range</h5>

        <div className="flex flex-row items-center gap-4 md:flex-col lg:flex-row">
          {/* Min Field */}
          <div className="flex-1">
            <label className="text-sm text-muted-foreground">Min</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={filters.priceRange[0].toString()}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/^0+(?!$)/, "")
                  const num = cleaned === "" ? 0 : Number(cleaned)
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: [num, prev.priceRange[1]],
                  }))
                }}
                className="w-full py-2 px-7 border rounded-md"
              />
            </div>
          </div>

          {/* Max Field */}
          <div className="flex-1">
            <label className="text-sm text-muted-foreground">Max</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={filters.priceRange[1].toString()}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/^0+(?!$)/, "")
                  const num = cleaned === "" ? 0 : Number(cleaned)
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], num],
                  }))
                }}
                className="w-full py-2 px-7 border rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Minimum Discount */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-sm text-slate-600">Minimum Discount</h5>
          {filters.minDiscount > 0 && (
            <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-600 rounded-full">
              {filters.minDiscount}% or more
            </span>
          )}
        </div>

        <div className="grid grid-cols-5 gap-2">
          {[0, 10, 25, 50, 70].map((discount) => (
            <Button
              key={discount}
              variant={filters.minDiscount === discount ? "default" : "outline"}
              className={`h-9 px-2 text-xs ${filters.minDiscount === discount ? "bg-leaf-background text-white" : "text-slate-600"
                }`}
              onClick={() => setFilters((prev) => ({ ...prev, minDiscount: discount }))}
            >
              {discount === 0 ? "Any" : `${discount}%+`}
            </Button>
          ))}
        </div>

        {/* Custom discount input */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Custom Discount</label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full py-2 pl-4 pr-7 border rounded-md"
              value={[0, 10, 25, 50, 70].includes(filters.minDiscount) ? "" : filters.minDiscount}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/^0+(?!$)/, "")
                const value = Number(cleaned)
                if (!isNaN(value) && value >= 0 && value <= 100) {
                  setFilters((prev) => ({
                    ...prev,
                    minDiscount: value,
                  }))
                }
              }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
          </div>
        </div>
      </div>

      {/* Sorting Section */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <h5 className="font-medium text-sm text-slate-600">Sort By</h5>
        <Select
          value={filters.sortBy}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, sortBy: value }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="rating">Review Rating</SelectItem>
            <SelectItem value="reviews">Number of Reviews</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="discount">Discount Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Special Offers */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <h5 className="font-medium text-sm text-slate-600">Special Offers</h5>
        <div className="flex flex-col gap-4">

          {/* Clip Coupon Switch */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Gift className="h-4 w-4 text-muted-foreground" />
              <span>Clip Coupon</span>
            </div>
            <Switch
              checked={filters.specialOffers.coupon}
              onCheckedChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  specialOffers: {
                    ...prev.specialOffers,
                    coupon: value,
                  },
                }))
              }
            />
          </div>

          {/* Promo Code Switch */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Ticket className="h-4 w-4 text-muted-foreground" />
              <span>Promo Code</span>
            </div>
            <Switch
              checked={filters.specialOffers.promoCode}
              onCheckedChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  specialOffers: {
                    ...prev.specialOffers,
                    promoCode: value,
                  },
                }))
              }
            />
          </div>

        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <Button className="flex-1 bg-leaf-background text-white" onClick={clearFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  ), [filters, clearFilters])

  const PaginationControls = () => (
    totalPages > 1 && (
      <div className="flex flex-wrap items-center justify-between mt-6 bg-white p-4 rounded-lg border border-slate-200 shadow-sm w-full max-w-xl mx-auto gap-3">
        <Button variant="outline" className="text-slate-600" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
          Previous
        </Button>
        <div className="flex items-center gap-1">
          {getPageNumbers(currentPage, totalPages).map((page, index) =>
            typeof page === "string" ? (
              <span key={`ellipsis-${index}`} className="text-slate-500 px-1">...</span>
            ) : (
              <Button
                key={`page-${page}`}
                variant="outline"
                className={`h-8 w-8 p-0 text-sm ${currentPage === page ? "bg-red-50 text-red-600 border-red-200" : "text-slate-600"}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            )
          )}
        </div>
        <Button variant="outline" className="text-slate-600" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
          Next
        </Button>
      </div>
    )
  )

  return (
    <main className="flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-screen-2xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-[275px_1fr] gap-6 mb-6">

          {/* Filter Sidebar */}
          <div className="hidden md:flex flex-col h-[700px] bg-white p-4 border border-slate-200 rounded-lg shadow-sm">
            {FilterComponent}
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-4">

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              {/* Mobile Filter Button */}
              <div className="flex md:hidden justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsFilterSheetOpen(true)}
                  className="flex items-center gap-2 w-full justify-center"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>

              {/* Status + Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4 sm:gap-6">

                {/* Showing Text */}
                <div className="text-sm text-slate-500 text-center sm:text-left w-full sm:w-auto">
                  Showing <span className="font-medium text-slate-700">{startIndex + 1}-{endIndex}</span> of{" "}
                  <span className="font-medium text-slate-700">{totalItems}</span> products
                </div>

                {/* Items per page selector */}
                <div className="flex items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
                  <span className="text-sm text-slate-600 whitespace-nowrap">Items per page:</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(v) => {
                      setItemsPerPage(Number(v));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="12" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                      <SelectItem value="48">48</SelectItem>
                      <SelectItem value="96">96</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>
            </div>


            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={UI_MESSAGES.searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-full pl-12 pr-4 py-2 shadow-sm border border-muted-foreground/20 focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {isLoading ? (
                <div className="col-span-full flex flex-col justify-center items-center mt-8 text-muted-foreground gap-3 text-sm sm:text-base min-h-[200px]">
                  <Loader2 className="animate-spin h-10 w-10" />
                  <span>{UI_MESSAGES.loadingDeals}</span>
                </div>
              ) : filteredResults.length === 0 ? (
                <div className="col-span-full flex flex-col justify-center items-center mt-8 text-muted-foreground gap-2 text-sm sm:text-base min-h-[200px]">
                  <PackageSearch className="h-10 w-10" />
                  <p>None of the available deals match your filters and search query</p>
                  <p className="text-sm text-slate-500">Try adjusting your filters or search terms</p>
                  <Button variant="outline" onClick={clearFilters} className="mt-2">Reset Filters</Button>
                </div>
              ) : (currentItems.map((product, index) => (
                <ProductCard key={`${product.asin}-${index}`} product={product} lastUpdated={new Date(product.last_updated_time)} />
              )))}
            </div>
            <PaginationControls />
          </div>
        </div>

        <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
          <SheetContent side="left" className="w-80">
            <DialogTitle className="hidden">
              Filter Options
            </DialogTitle>
            {FilterComponent}
          </SheetContent>
        </Sheet>
      </div>
    </main>
  )
}