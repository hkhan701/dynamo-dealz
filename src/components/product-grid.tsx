'use client'

import { useEffect, useMemo, useState } from "react"
import Fuse from "fuse.js"
import ProductCard from "@/components/product-card"
import { Input } from "./ui/input"
import { Loader2, PackageSearch, Search } from "lucide-react"
import { UI_MESSAGES } from "@/lib/strings"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Product } from "@/types/product"
import { Button } from "./ui/button"

interface Props {
  products: Product[]
}

export default function ProductGrid({ products }: Props) {
  // ========== SEARCH LOGIC ==========
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
    setIsLoading(true)
    if (query.trim() === "") {
      setSearchResults(products)
    } else {
      const fuseResults = fuse.search(query)
      setSearchResults(fuseResults.map(res => res.item))
    }
    setIsLoading(false)
    // Reset to first page when search query changes
    setCurrentPage(1)
  }, [query, fuse, products])

  // ========== PAGINATION LOGIC ==========
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)

  // Calculate pagination
  const totalItems = searchResults.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const currentItems = searchResults.slice(startIndex, endIndex)

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = []

    // Always show first page
    pageNumbers.push(1)

    // Calculate range of pages to display around current page
    let rangeStart = Math.max(2, currentPage - 1)
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1)

    // Adjust range if at edges
    if (currentPage <= 2) {
      rangeEnd = Math.min(4, totalPages - 1)
    } else if (currentPage >= totalPages - 1) {
      rangeStart = Math.max(2, totalPages - 3)
    }

    // Add ellipsis before range if needed
    if (rangeStart > 2) {
      pageNumbers.push('ellipsis-start')
    }

    // Add page numbers in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pageNumbers.push(i)
    }

    // Add ellipsis after range if needed
    if (rangeEnd < totalPages - 1) {
      pageNumbers.push('ellipsis-end')
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  // ========== FILTER LOGIC ==========
  // Add your filter logic here in the future
  // const [activeFilters, setActiveFilters] = useState([])
  // const applyFilters = (items) => {
  //   // Filter logic here
  //   return items
  // }

  // ========== PAGINATION UI COMPONENT ==========
  const PaginationControls = () => {
    return (
      <>
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between mt-6 bg-white p-4 rounded-lg border border-slate-200 shadow-sm w-full max-w-xl mx-auto gap-3">
            {/* Previous Button */}
            <Button
              variant="outline"
              className="text-slate-600"
              disabled={currentPage === 1}
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>

            {/* Page Number Buttons */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) =>
                page === "ellipsis-start" || page === "ellipsis-end" ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="text-slate-500 px-1"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={`page-${page}`}
                    variant="outline"
                    className={`h-8 w-8 p-0 text-sm ${currentPage === page
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "text-slate-600"
                      }`}
                    onClick={() => handlePageChange(page as number)}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              className="text-slate-600"
              disabled={currentPage === totalPages}
              onClick={() =>
                currentPage < totalPages && handlePageChange(currentPage + 1)
              }
            >
              Next
            </Button>
          </div>
        )}
      </>
    )
  }

  // ========== MAIN RENDER ==========
  return (
    <main className="flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-screen-xl mx-auto">


        {/* Items per page selector */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Bar */}
            <div className="w-full sm:w-1/2 max-w-lg mx-auto sm:mx-0">
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
            </div>

            {/* Info + Selector Group */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end sm:gap-6 w-full sm:w-1/2">
              {/* Showing Count */}
              <div className="flex items-center justify-center sm:justify-end">
                <span className="text-sm text-slate-500">
                  Showing {startIndex + 1}-{endIndex} of {totalItems} products
                </span>
              </div>

              {/* Items per Page */}
              <div className="flex items-center justify-center sm:justify-end gap-2">
                <span className="text-sm text-slate-600">Items per page:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value))
                    setCurrentPage(1)
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
        </div>


        {/* Product Grid */}
        <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {currentItems.map((product, index) => (
            <ProductCard
              key={`${product.asin}-${index}`}
              product={product}
              lastUpdated={new Date(product.last_updated_time)}
            />
          ))}
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center mt-8 text-muted-foreground gap-3 text-sm sm:text-base">
            <Loader2 className="animate-spin h-10 w-10" />
            <span className="flex items-center gap-1">
              {UI_MESSAGES.loadingDeals}
            </span>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="flex flex-col justify-center items-center mt-8 text-muted-foreground gap-2 text-sm sm:text-base">
            <PackageSearch className="h-10 w-10" />
            <p>{UI_MESSAGES.noDealsFound}</p>
          </div>
        ) : null}

        {/* Bottom Pagination */}
        <PaginationControls />
      </div>
    </main>
  )
}