import Header from "@/components/header"
import ProductGrid from "@/components/product-grid"
import { getAllProductsFromLocalFiles } from "@/lib/data"

export default async function Home() {
  const allProducts = await getAllProductsFromLocalFiles("USA");

  return (
    <div className="min-h-screen">
      <Header />
      <ProductGrid products={allProducts} />
    </div>
  );
}