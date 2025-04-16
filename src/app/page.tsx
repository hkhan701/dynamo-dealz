import Header from "@/components/header"
import ProductGrid from "@/components/product-grid"
import { getAllProductsFromLocalFiles } from "@/lib/data"

export default async function Home() {
  const allProducts = await getAllProductsFromLocalFiles();

  return (
    <div className="min-h-screen">
      <Header />
      <ProductGrid products={allProducts} />
    </div>
  );
}