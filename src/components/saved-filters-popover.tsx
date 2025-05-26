"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import {
  Trash2,
  Save,
  Sliders,
  Search,
  Filter,
  Clock,
  Star,
  StarOff,
  MoreHorizontal,
  Eye,
  Gift,
  Tag,
  Ticket,
} from "lucide-react"
import type { FilterState, SavedFilter } from "@/types/filter-state"
import { GENERAL_CATEGORIES } from "@/lib/category"

interface Props {
  filters: FilterState
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
}

const LOCAL_STORAGE_KEY = "savedFilters"

export default function SavedFiltersPopover({ filters, setFilters }: Props) {
  const [saved, setSaved] = useState<SavedFilter[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newFilterName, setNewFilterName] = useState("")
  const [newFilterDescription, setNewFilterDescription] = useState("")
  const [previewFilter, setPreviewFilter] = useState<SavedFilter | null>(null)


  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (raw) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsed = JSON.parse(raw).map((f: any) => ({
          ...f,
          createdAt: new Date(f.createdAt),
          isFavorite: f.isFavorite || false,
        }))
        setSaved(parsed)
      } catch (error) {
        console.error("Failed to parse saved filters:", error)
        setSaved([])
      }
    }
  }, [])

  const saveToLocalStorage = (filters: SavedFilter[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filters))
  }

  const saveCurrent = () => {
    if (!newFilterName.trim()) {
      toast.error("Please enter a name for your filter.")
      return
    }

    const newEntry: SavedFilter = {
      id: Date.now(),
      label: newFilterName.trim(),
      description: newFilterDescription.trim() || undefined,
      value: filters,
      createdAt: new Date(),
      isFavorite: false,
    }

    const updated = [...saved, newEntry]
    saveToLocalStorage(updated)
    setSaved(updated)
    setNewFilterName("")
    setNewFilterDescription("")
    setIsDialogOpen(false)

    toast.success(`"${newEntry.label}" has been saved successfully.`)
  }

  const applyFilter = (f: SavedFilter) => {
    setFilters(f.value)
    toast(`"${f.label}" filter has been applied.`)
  }

  const deleteFilter = (id: number) => {
    const filterToDelete = saved.find((f) => f.id === id)
    const updated = saved.filter((f) => f.id !== id)
    saveToLocalStorage(updated)
    setSaved(updated)

    toast(`"${filterToDelete?.label}" has been deleted.`)
  }

  const toggleFavorite = (id: number) => {
    const updated = saved.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f))
    saveToLocalStorage(updated)
    setSaved(updated)
  }

  const getFilterSummary = (filterState: FilterState) => {
    const summary = []

    if (filterState.priceRange[0] > 0 || filterState.priceRange[1] < 1000) {
      summary.push(`$${filterState.priceRange[0]}-$${filterState.priceRange[1]}`)
    }

    if (filterState.minDiscount > 0) {
      summary.push(`${filterState.minDiscount}%+ discount`)
    }

    if (filterState.categories.length > 0) {
      summary.push(`${filterState.categories.length} categories`)
    }

    const specialOffers = Object.values(filterState.specialOffers).filter(Boolean).length
    if (specialOffers > 0) {
      summary.push(`${specialOffers} special offers`)
    }

    return summary.slice(0, 3) // Show max 3 items
  }

  const filteredSaved = saved.filter(
    (f) =>
      f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const favoriteFilters = filteredSaved.filter((f) => f.isFavorite)
  const regularFilters = filteredSaved.filter((f) => !f.isFavorite)

  const resetDialog = () => {
    setNewFilterName("")
    setNewFilterDescription("")
    setIsDialogOpen(false)
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Sliders className="h-4 w-4 mr-2" />
            Saved Filters
            {saved.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                {saved.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start" sideOffset={2}>
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-sm">Saved Filters</h4>
                <p className="text-xs text-muted-foreground">Manage your saved filter presets</p>
              </div>
              <div className="flex gap-1">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm" onClick={() => setIsDialogOpen(true)}>
                      <Save className="w-4 h-4 mr-1" />
                      Save Current
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>

            {saved.length > 3 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search filters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-8"
                />
              </div>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {filteredSaved.length === 0 ? (
              <div className="p-8 text-center">
                <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <h3 className="font-medium text-sm mb-1">
                  {saved.length === 0 ? "No saved filters" : "No matching filters"}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {saved.length === 0
                    ? "Save your current filter settings to quickly apply them later."
                    : "Try adjusting your search terms."}
                </p>
                {saved.length === 0 && (
                  <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
                    <Save className="w-4 h-4 mr-1" />
                    Save Current Filter
                  </Button>
                )}
              </div>
            ) : (
              <div className="p-2">
                {favoriteFilters.length > 0 && (
                  <>
                    <div className="px-2 py-1 mb-2">
                      <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Favorites</h5>
                    </div>
                    {favoriteFilters.map((filter) => (
                      <FilterItem
                        key={filter.id}
                        filter={filter}
                        onApply={applyFilter}
                        onDelete={deleteFilter}
                        onToggleFavorite={toggleFavorite}
                        onPreview={setPreviewFilter}
                        getFilterSummary={getFilterSummary}
                      />
                    ))}
                    {regularFilters.length > 0 && <Separator className="my-2" />}
                  </>
                )}

                {regularFilters.length > 0 && (
                  <>
                    {favoriteFilters.length > 0 && (
                      <div className="px-2 py-1 mb-2">
                        <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          All Filters
                        </h5>
                      </div>
                    )}
                    {regularFilters.map((filter) => (
                      <FilterItem
                        key={filter.id}
                        filter={filter}
                        onApply={applyFilter}
                        onDelete={deleteFilter}
                        onToggleFavorite={toggleFavorite}
                        onPreview={setPreviewFilter}
                        getFilterSummary={getFilterSummary}
                      />
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Save Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open: boolean | ((prevState: boolean) => boolean)) => {
          if (!open) resetDialog()
          setIsDialogOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{"Save Current Filter"}</DialogTitle>
            <DialogDescription>
              {"Give your current filter settings a name and description."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="filter-name">Name *</Label>
              <Input
                id="filter-name"
                value={newFilterName}
                onChange={(e) => setNewFilterName(e.target.value)}
                placeholder="e.g., Electronics Under $100"
                maxLength={50}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-description">Description</Label>
              <Input
                id="filter-description"
                value={newFilterDescription}
                onChange={(e) => setNewFilterDescription(e.target.value)}
                placeholder="Optional description..."
                maxLength={100}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetDialog}>
              Cancel
            </Button>
            <Button onClick={saveCurrent}>
              {"Save Filter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewFilter} onOpenChange={() => setPreviewFilter(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Filter Details: {previewFilter?.label}
            </DialogTitle>
            {previewFilter?.description && (
              <DialogDescription>{previewFilter.description}</DialogDescription>
            )}
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price Range:</span>
                <span>
                  ${previewFilter?.value.priceRange[0]} - ${previewFilter?.value.priceRange[1]}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Min Discount:</span>
                <span>{previewFilter?.value.minDiscount}%</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Sort By:</span>
                <span className="capitalize">
                  {previewFilter?.value.sortBy?.replace("-", " ")}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block mb-1">Categories:</span>
                <div className="flex flex-wrap gap-2">
                  {previewFilter?.value.categories && previewFilter.value.categories.length > 0 ? (
                    previewFilter.value.categories.map((cat) => (
                      <Badge key={cat} variant="outline">
                        {GENERAL_CATEGORIES[cat as keyof typeof GENERAL_CATEGORIES]?.label ?? cat}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-xs italic">No categories selected</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-muted-foreground block mb-1">Special Offers:</span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(previewFilter?.value.specialOffers || {})
                    .filter(([, enabled]) => enabled)
                    .map(([key]) => {
                      const iconMap = {
                        coupon: <Gift className="w-3 h-3" />,
                        promoCode: <Ticket className="w-3 h-3" />,
                        lightningDeals: <Tag className="w-3 h-3" />
                      }
                      const labelMap = {
                        coupon: "Clip Coupon",
                        promoCode: "Promo Code",
                        lightningDeals: "Lightning Deals"
                      }
                      return (
                        <Badge key={key} variant="secondary" className="flex items-center gap-1">
                          {iconMap[key as keyof typeof iconMap]}
                          {labelMap[key as keyof typeof labelMap]}
                        </Badge>
                      )
                    })}
                  {Object.values(previewFilter?.value.specialOffers || {}).every(v => !v) && (
                    <span className="text-muted-foreground text-xs italic">None enabled</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Saved {previewFilter?.createdAt.toLocaleDateString()}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewFilter(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (previewFilter) {
                  applyFilter(previewFilter)
                  setPreviewFilter(null)
                }
              }}
            >
              Apply Filter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface FilterItemProps {
  filter: SavedFilter
  onApply: (filter: SavedFilter) => void
  onDelete: (id: number) => void
  onToggleFavorite: (id: number) => void
  onPreview: (filter: SavedFilter) => void
  getFilterSummary: (filterState: FilterState) => string[]
}

function FilterItem({
  filter,
  onApply,
  onDelete,
  onToggleFavorite,
  onPreview,
  getFilterSummary,
}: FilterItemProps) {
  const [showActions, setShowActions] = useState(false)

  return (
    <div
      className="group p-3 rounded-lg border hover:bg-muted/50 transition-colors mb-3"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-sm truncate">{filter.label}</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onToggleFavorite(filter.id)}
            >
              {filter.isFavorite ? (
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              ) : (
                <StarOff className="h-3 w-3" />
              )}
            </Button>
          </div>

          {filter.description && (
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{filter.description}</p>
          )}

          <div className="flex flex-wrap gap-1 mb-2">
            {getFilterSummary(filter.value).map((item, index) => (
              <Badge key={index} variant="outline" className="text-xs h-5">
                {item}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {filter.createdAt.toLocaleDateString()}
          </div>
        </div>

        <div className="flex items-center gap-1 ml-2">
          <Button variant="default" size="sm" onClick={() => onApply(filter)} className="h-7 px-2 text-xs">
            Apply
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 w-7 p-0 transition-opacity ${showActions ? "opacity-100" : "opacity-0"}`}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1" align="end">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8"
                  onClick={() => onPreview(filter)}
                >
                  <Eye className="h-3 w-3 mr-2" />
                  Details
                </Button>
                <Separator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Filter</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &quot;{filter.label}&quot;? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(filter.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
