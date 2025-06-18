import { X, DollarSign, Percent, Tag, Gift, Ticket, Zap, ArrowDown, ArrowUp, Star, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FilterState } from "@/types/filter-state"
import { GENERAL_CATEGORIES } from "@/lib/category"

// Helper function to get active filters
const getActiveFilters = (filters: FilterState) => {
  const activeFilters: Array<{
    id: string
    label: string
    type: 'price' | 'discount' | 'category' | 'offer' | 'sort'
    value?: string | number | [number, number]
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  }> = []

  // Price range
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 9999) {
    activeFilters.push({
      id: 'price',
      label: `$${filters.priceRange[0]} - $${filters.priceRange[1]}`,
      type: 'price',
      value: filters.priceRange,
      icon: DollarSign
    })
  }

  // Minimum discount
  if (filters.minDiscount > 0) {
    activeFilters.push({
      id: 'discount',
      label: `${filters.minDiscount}%+ discount`,
      type: 'discount',
      value: filters.minDiscount,
      icon: Percent
    })
  }

  // Categories
  filters.categories.forEach(category => {
    const categoryData = GENERAL_CATEGORIES[category as keyof typeof GENERAL_CATEGORIES]
    if (categoryData) {
      activeFilters.push({
        id: `category-${category}`,
        label: categoryData.label,
        type: 'category',
        value: category,
        icon: categoryData.icon
      })
    }
  })

  // Special offers
  if (filters.specialOffers.coupon) {
    activeFilters.push({
      id: 'coupon',
      label: 'Clip Coupon',
      type: 'offer',
      value: 'coupon',
      icon: Gift
    })
  }

  if (filters.specialOffers.promoCode) {
    activeFilters.push({
      id: 'promo',
      label: 'Promo Code',
      type: 'offer',
      value: 'promoCode',
      icon: Ticket
    })
  }

  if (filters.specialOffers.lightningDeals) {
    activeFilters.push({
      id: 'lightning',
      label: 'Lightning Deals',
      type: 'offer',
      value: 'lightningDeals',
      icon: Zap
    })
  }

  // Sort (only show if not default)
  if (filters.sortBy !== 'newest') {
    const sortLabels = {
      rating: { label: 'Top Rated', icon: Star },
      reviews: { label: 'Most Reviewed', icon: MessageSquare },
      'price-asc': { label: 'Price: Low to High', icon: ArrowDown },
      'price-desc': { label: 'Price: High to Low', icon: ArrowUp },
      discount: { label: 'Discount Amount', icon: Percent }
    }

    const sortData = sortLabels[filters.sortBy as keyof typeof sortLabels]
    if (sortData) {
      activeFilters.push({
        id: 'sort',
        label: `Sort: ${sortData.label}`,
        type: 'sort',
        value: filters.sortBy,
        icon: sortData.icon
      })
    }
  }

  return activeFilters
}

// Component to render individual filter badge
const FilterBadge = ({
  filter,
  onRemove
}: {
  filter: ReturnType<typeof getActiveFilters>[0]
  onRemove: () => void
}) => {
  const Icon = filter.icon

  const getVariantColor = (type: string) => {
    switch (type) {
      case 'price': return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
      case 'discount': return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
      case 'category': return 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
      case 'offer': return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
      case 'sort': return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
      default: return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
    }
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${getVariantColor(filter.type)}`}>
      {Icon && <Icon className="h-3.5 w-3.5" />}
      <span className="truncate max-w-[200px]">{filter.label}</span>
      <button
        onClick={onRemove}
        className="ml-1 p-0.5 rounded-full hover:bg-black/10 transition-colors"
        aria-label={`Remove ${filter.label} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}

// Main Active Filters Section Component
const ActiveFiltersSection = ({
  filters,
  setFilters,
  clearFilters
}: {
  filters: FilterState
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
  clearFilters: () => void
}) => {
  const activeFilters = getActiveFilters(filters)

  const removeFilter = (filterType: string, value?: string | number | [number, number]) => {
    switch (filterType) {
      case 'price':
        setFilters(prev => ({ ...prev, priceRange: [0, 9999] }))
        break
      case 'discount':
        setFilters(prev => ({ ...prev, minDiscount: 0 }))
        break
      case 'category':
        setFilters(prev => ({
          ...prev,
          categories: prev.categories.filter(c => c !== value)
        }))
        break
      case 'offer':
        setFilters(prev => ({
          ...prev,
          specialOffers: {
            ...prev.specialOffers,
            [value as string]: false
          }
        }))
        break
      case 'sort':
        setFilters(prev => ({ ...prev, sortBy: 'newest' }))
        break
    }
  }

  if (activeFilters.length === 0) {
    return null
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <Tag className="h-4 w-4 text-slate-500" />
          Active Filters ({activeFilters.length})
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-slate-500 hover:text-slate-700 text-xs h-7 px-2"
        >
          Clear All
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter) => (
          <FilterBadge
            key={filter.id}
            filter={filter}
            onRemove={() => removeFilter(filter.type, filter.value)}
          />
        ))}
      </div>
    </div>
  )
}

export default ActiveFiltersSection