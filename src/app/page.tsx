import fs from "fs"
import path from "path"

import Header from "@/components/header"
import ProductGrid from "@/components/product-grid"

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

interface ProductData {
  last_updated_time: string
  products: Product[]
}

export default async function Home() {
  const dataFolderPath = path.join(process.cwd(), "public", "data");
  const files = fs.readdirSync(dataFolderPath); // Get all files in the folder

  // Combine all products into a single array
  const allProducts: (Product & { last_updated_time: string })[] = [];

  files
    .filter((file) => file.endsWith(".json")) // Only process JSON files
    .forEach((file) => {
      const filePath = path.join(dataFolderPath, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const jsonData: ProductData = JSON.parse(fileContent);

      // Add products to the combined array, attaching their respective last_updated_time
      const productsWithUpdatedTime = jsonData.products.map((product) => ({
        ...product,
        last_updated_time: jsonData.last_updated_time,
      }));
      allProducts.push(...productsWithUpdatedTime);
    });

  return (
    <div className="min-h-screen">
      <Header />
      <ProductGrid products={allProducts} />
    </div>
  );
}