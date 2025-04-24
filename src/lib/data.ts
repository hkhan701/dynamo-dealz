import fs from "fs";
import path from "path";
import { Product, ProductData } from "@/types/product";
import { CATEGORY_MAP } from "@/lib/category";

const dataFolderPath = path.join(process.cwd(), "public", "data");

export async function getAllProductsFromLocalFiles(): Promise<Product[]> {
  try {
    const files = fs.readdirSync(dataFolderPath);
    const allProducts: (Product & { category: string; last_updated_time: string })[] = [];

    files
      .filter((file) => file.endsWith(".json"))
      .forEach((file) => {
        const filePath = path.join(dataFolderPath, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const jsonData: ProductData = JSON.parse(fileContent);

        // Extract category from filename
        const specificCategory = path.basename(file, ".json").replace(/^Canada_/, "");
        const category = CATEGORY_MAP[specificCategory] ?? "Other";

        const productsWithMetadata = jsonData.products.map((product) => ({
          ...product,
          last_updated_time: jsonData.last_updated_time,
          category,
        }));

        allProducts.push(...productsWithMetadata);
      });

    // Sort by most recent
    allProducts.sort((a, b) => new Date(b.last_updated_time).getTime() - new Date(a.last_updated_time).getTime());

    return allProducts;
  } catch (error) {
    console.error("Error reading local JSON files:", error);
    return [];
  }
}