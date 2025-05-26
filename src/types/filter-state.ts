export interface FilterState {
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