'use client'

import { useEffect, useMemo, useState } from "react"
import Fuse from "fuse.js"
import ProductCard from "@/components/product-card"
import { Input } from "./ui/input"
import { Loader2, PackageSearch, Search } from "lucide-react"
import { UI_MESSAGES } from "@/lib/strings"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Product } from "@/types/product"

interface Props {
  products: Product[]
}

export default function ProductGrid({ products }: Props) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)

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
      setResults(products)
    } else {
      const fuseResults = fuse.search(query)
      setResults(fuseResults.map(res => res.item))
    }
    setIsLoading(false)
    // Reset to first page when search query changes
    setCurrentPage(1)
  }, [query, fuse, products])

  // Calculate pagination
  const totalItems = results.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const currentItems = results.slice(startIndex, endIndex)

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of grid when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
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

  return (
    <main className="flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-screen-xl mx-auto">
        {/* Search Bar */}
        <div className="w-full max-w-lg mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={UI_MESSAGES.searchPlaceholder}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full rounded-full pl-12 pr-4 py-2 shadow-sm border border-muted-foreground/20 focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Pagination Controls - Top */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="text-sm text-muted-foreground mb-4 sm:mb-0">
            Showing {startIndex + 1}-{endIndex} of {totalItems} items
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Items per page:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
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
        ) : results.length === 0 ? (
          <div className="flex flex-col justify-center items-center mt-8 text-muted-foreground gap-2 text-sm sm:text-base">
            <PackageSearch className="h-10 w-10" />
            <p>{UI_MESSAGES.noDealsFound}</p>
          </div>
        ) : null}

        {/* Pagination Controls - Bottom */}
        {totalPages > 1 && (
          <Pagination className="mt-8 w-full overflow-x-auto">
            <PaginationContent className="flex flex-wrap justify-center gap-1 text-sm">
              {/* Previous */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) handlePageChange(currentPage - 1)
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {/* Page Numbers */}
              {getPageNumbers().map((page, index) =>
                page === "ellipsis-start" || page === "ellipsis-end" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={`page-${page}`}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(page as number)
                      }}
                      isActive={currentPage === page}
                      className="min-w-8 text-center"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) handlePageChange(currentPage + 1)
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

      </div>
    </main>
  )
}