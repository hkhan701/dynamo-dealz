export interface Product {
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
  rating: number
  rating_count: number
}

export interface ProductData {
  last_updated_time: string
  products: Product[]
}
