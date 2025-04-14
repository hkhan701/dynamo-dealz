import fs from "fs"
import path from "path"

import ProductCard from "@/components/product-card"
import Header from "@/components/header"

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
}

export default async function Home() {
  const filePath = path.join(process.cwd(), "public", "data", "Canada_garage_tools.json")
  const fileContent = fs.readFileSync(filePath, "utf-8")
  const fileStats = fs.statSync(filePath)
  const products: Product[] = JSON.parse(fileContent)

  // Get the last updated time
  const lastUpdated = fileStats.mtime

  return (
    <div className="min-h-screen">
      <Header />
  
      <main className="flex flex-col items-center justify-center px-4 py-8">
  <div className="w-full max-w-screen-xl mx-auto">
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} lastUpdated={lastUpdated} />
      ))}
    </div>
  </div>
</main>


    </div>
  );
}
