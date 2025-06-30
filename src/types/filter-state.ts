export interface FilterState {
  priceRange: [number, number];
  minDiscount: number;
  sortBy?: string;
  categories: string[];
  specialOffers: {
    coupon: boolean;
    promoCode: boolean;
    lightningDeals: boolean;
    extraOffer: boolean;
  };
}

export interface SavedFilter {
  id: number
  label: string
  value: FilterState
  createdAt: Date
  isFavorite: boolean
  description?: string
}