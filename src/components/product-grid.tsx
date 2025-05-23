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
import { Loader2, PackageSearch, Search, Filter, Gift, Ticket, Clock, ArrowDown, ArrowUp, MessageSquare, Percent, Star, Check, ChevronDown } from "lucide-react"
import { UI_MESSAGES } from "@/lib/strings"
import { Product } from "@/types/product"
import { getPageNumbers, cn } from "@/lib/utils"
import { DialogTitle } from "@radix-ui/react-dialog"
import { TabsList, Tabs, TabsTrigger } from "@/components/ui/tabs"
import { GENERAL_CATEGORIES } from "@/lib/category"

interface Props {
  products: Product[]
}

interface FilterState {
  priceRange: [number, number];
  minDiscount: number;
  sortBy?: string;
  categories: string[];
  specialOffers: {
    coupon: boolean;
    promoCode: boolean;
    lightningDeals: boolean;
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
  const [showAllCategories, setShowAllCategories] = useState(false);


  // Enhanced filter state
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 9999],
    minDiscount: 0,
    sortBy: 'newest',
    categories: [],
    specialOffers: {
      coupon: false,
      promoCode: false,
      lightningDeals: false
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

    // Filter by categories
    if (filters.categories.length > 0) {
      result = result.filter((product) =>
        filters.categories.includes(product.category)
      )
    }

    // Filter by special offers
    if (filters.specialOffers.coupon) {
      result = result.filter(
        (product) =>
          (Number(product.clip_coupon_savings) > 0 && product.clip_coupon_savings !== "") ||
          Number(product.clip_coupon_percent_savings) > 0
      )
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
      categories: [],
      specialOffers: {
        coupon: false,
        promoCode: false,
        lightningDeals: false
      },
    })
    setCurrentPage(1)
    setIsFilterSheetOpen(false)
  }, [])

  const FilterComponent = useMemo(() => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          Filters
        </h4>
      </div>

      {/* Price Range */}
      <section className="space-y-3">
        <h5 className="text-sm font-medium text-slate-600">Price Range</h5>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Min</label>
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
                className="pl-7"
              />
            </div>
          </div>

          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Max</label>
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
                className="pl-7"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Minimum Discount */}
      <section className="space-y-3 border-t pt-4">
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-medium text-slate-600">Minimum Discount</h5>
          {filters.minDiscount > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
              {filters.minDiscount}%+
            </span>
          )}
        </div>

        <Tabs
          value={filters.minDiscount.toString()}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, minDiscount: parseInt(value) }))
          }
        >
          <TabsList className="grid grid-cols-5 gap-2 w-full">
            {[0, 10, 25, 50, 70].map((discount) => (
              <TabsTrigger
                key={discount}
                value={discount.toString()}
                className="text-xs py-1 data-[state=active]:bg-leaf-background data-[state=active]:text-white text-slate-600"
              >
                {discount === 0 ? "Any" : `${discount}%+`}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Custom Discount</label>

          <div
            className={cn(
              "relative rounded-md border transition-all duration-300 ease-in-out",
              ![0, 10, 25, 50, 70].includes(filters.minDiscount)
                ? "ring-2 ring-leaf-background border-transparent scale-[1.02]"
                : "border-slate-200"
            )}
          >
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full py-2 pl-4 pr-7 rounded-md bg-white focus:outline-none"
              value={[0, 10, 25, 50, 70].includes(filters.minDiscount) ? "" : filters.minDiscount}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/^0+(?!$)/, "");
                const value = Number(cleaned);
                if (!isNaN(value) && value >= 0 && value <= 100) {
                  setFilters((prev) => ({
                    ...prev,
                    minDiscount: value,
                  }));
                }
              }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
          </div>
        </div>

      </section>

      {/* Sort By */}
      <section className="space-y-3 border-t pt-4">
        <h5 className="text-sm font-medium text-slate-600">Sort By</h5>
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
            <SelectItem value="newest">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Newest</span>
              </div>
            </SelectItem>
            <SelectItem value="rating">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>Review Rating</span>
              </div>
            </SelectItem>
            <SelectItem value="reviews">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span>Number of Reviews</span>
              </div>
            </SelectItem>
            <SelectItem value="price-asc">
              <div className="flex items-center gap-2">
                <ArrowDown className="h-4 w-4 text-green-500" />
                <span>Price: Low to High</span>
              </div>
            </SelectItem>
            <SelectItem value="price-desc">
              <div className="flex items-center gap-2">
                <ArrowUp className="h-4 w-4 text-red-500" />
                <span>Price: High to Low</span>
              </div>
            </SelectItem>
            <SelectItem value="discount">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-blue-500" />
                <span>Discount Amount</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </section>

      {/* Categories */}
      <section className="space-y-3 border-t pt-4">
        <h5 className="text-sm font-medium text-slate-600 transition-opacity duration-300 hover:opacity-80">Categories</h5>

        <div
          className={cn(
            "space-y-1 overflow-hidden transition-all duration-500 ease-in-out",
            showAllCategories ? "max-h-[1000px] opacity-100" : "max-h-[260px] opacity-100"
          )}
        >
          {Object.entries(GENERAL_CATEGORIES)
            .slice(0, showAllCategories ? undefined : 6)
            .map(([key, { icon: Icon, label }], index) => {
              const isSelected = filters.categories.includes(key);

              return (
                <button
                  key={key}
                  onClick={() =>
                    setFilters((prev) => {
                      const newCategories = isSelected
                        ? prev.categories.filter((c) => c !== key)
                        : [...prev.categories, key];
                      return { ...prev, categories: newCategories };
                    })
                  }
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md p-2 text-sm capitalize transition-all duration-300",
                    "transform hover:translate-x-1 hover:shadow-sm",
                    isSelected
                      ? "bg-zinc-50 text-black"
                      : "hover:bg-slate-50 text-muted-foreground"
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "both"
                  }}
                >
                  <Icon className="size-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  <span className="truncate">{label}</span>
                  {isSelected && (
                    <Check className="ml-auto size-4 shrink-0 stroke-[3] animate-appear" />
                  )}
                </button>
              );
            })}
        </div>

        <button
          onClick={() => setShowAllCategories((prev) => !prev)}
          className="w-full text-xs text-muted-foreground transition-all duration-300 hover:underline hover:text-slate-700 pt-1 flex items-center justify-center gap-1"
        >
          <span>{showAllCategories ? "Show less" : "Show more"}</span>
          <span className={`transition-transform duration-300 ${showAllCategories ? "rotate-180" : "rotate-0"}`}>
            <ChevronDown className="h-4 w-4" />
          </span>
        </button>
      </section>

      {/* Special Offers */}
      <section className="space-y-3 border-t pt-4">
        <h5 className="text-sm font-medium text-slate-600">Special Offers</h5>
        <div className="flex flex-col gap-4">
          <div
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border transition-all duration-200",
              filters.specialOffers.coupon
                ? "bg-emerald-50 border-emerald-200"
                : "bg-white border-slate-200 hover:bg-slate-50",
            )}
          >
            <div className="flex items-center gap-2 text-sm">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full",
                  filters.specialOffers.coupon ? "bg-emerald-100" : "bg-slate-100",
                )}
              >
                <Gift className={cn("h-4 w-4", filters.specialOffers.coupon ? "text-emerald-600" : "text-slate-500")} />
              </div>
              <div>
                <span
                  className={cn("font-medium", filters.specialOffers.coupon ? "text-emerald-800" : "text-slate-700")}
                >
                  Clip Coupon
                </span>
                <p className="text-xs text-slate-500">Products with additional coupons</p>
              </div>
            </div>
            <Switch
              checked={filters.specialOffers.coupon}
              className={filters.specialOffers.coupon ? "bg-emerald-500" : ""}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  specialOffers: {
                    ...prev.specialOffers,
                    coupon: !prev.specialOffers.coupon,
                  },
                }))
              }
            />
          </div>

          <div
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border transition-all duration-200",
              filters.specialOffers.promoCode
                ? "bg-purple-50 border-purple-200"
                : "bg-white border-slate-200 hover:bg-slate-50",
            )}
          >
            <div className="flex items-center gap-2 text-sm">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full",
                  filters.specialOffers.promoCode ? "bg-purple-100" : "bg-slate-100",
                )}
              >
                <Ticket
                  className={cn("h-4 w-4", filters.specialOffers.promoCode ? "text-purple-600" : "text-slate-500")}
                />
              </div>
              <div>
                <span
                  className={cn(
                    "font-medium",
                    filters.specialOffers.promoCode ? "text-purple-800" : "text-slate-700",
                  )}
                >
                  Promo Code
                </span>
                <p className="text-xs text-slate-500">Products with promo code discounts</p>
              </div>
            </div>
            <Switch
              checked={filters.specialOffers.promoCode}
              className={filters.specialOffers.promoCode ? "bg-purple-500" : ""}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  specialOffers: {
                    ...prev.specialOffers,
                    promoCode: !prev.specialOffers.promoCode,
                  },
                }))
              }
            />
          </div>

          <div
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border transition-all duration-200",
              filters.specialOffers.lightningDeals
                ? "bg-amber-50 border-amber-200"
                : "bg-white border-slate-200 hover:bg-slate-50",
            )}
          >
            <div className="flex items-center gap-2 text-sm">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full",
                  filters.specialOffers.lightningDeals ? "bg-amber-100" : "bg-slate-100",
                )}
              >
                <Gift className={cn("h-4 w-4", filters.specialOffers.lightningDeals ? "text-amber-600" : "text-slate-500")} />
              </div>
              <div>
                <span
                  className={cn("font-medium", filters.specialOffers.lightningDeals ? "text-amber-800" : "text-slate-700")}
                >
                  Lightning Deals
                </span>
                <p className="text-xs text-slate-500">Coming soon...</p>
              </div>
            </div>
            <Switch
              checked={filters.specialOffers.lightningDeals}
              className={filters.specialOffers.lightningDeals ? "bg-amber-500" : ""}
              disabled
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  specialOffers: {
                    ...prev.specialOffers,
                    lightningDeals: !prev.specialOffers.lightningDeals,
                  },
                }))
              }
            />
          </div>
        </div>
      </section>

      {/* Reset Button */}
      <div className="pt-4">
        <Button className="w-full bg-leaf-background text-white" onClick={clearFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  ), [filters, clearFilters, showAllCategories])

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
          <div className="hidden md:flex flex-col gap-6 p-4 bg-white rounded-xl shadow-sm border border-slate-200 h-fit">
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
          <SheetContent
            side="left"
            className="w-80 h-screen overflow-y-auto"
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
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