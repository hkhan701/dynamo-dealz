import fs from "fs";
import path from "path";
import { Product, ProductData } from "@/types/product";

const dataFolderPath = path.join(process.cwd(), "public", "data");

export async function getAllProductsFromLocalFiles(): Promise<Product[]> {
  try {
    const files = fs.readdirSync(dataFolderPath);
    const allProducts: (Product & { last_updated_time: string })[] = [];

    files
      .filter((file) => file.endsWith(".json"))
      .forEach((file) => {
        const filePath = path.join(dataFolderPath, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const jsonData: ProductData = JSON.parse(fileContent);

        const productsWithUpdatedTime = jsonData.products.map((product) => ({
          ...product,
          last_updated_time: jsonData.last_updated_time,
        }));
        allProducts.push(...productsWithUpdatedTime);
      });

    // Sort products by last_updated_time (optional - can also sort client-side if needed)
    allProducts.sort((a, b) => {
      const dateA = new Date(a.last_updated_time);
      const dateB = new Date(b.last_updated_time);
      return dateB.getTime() - dateA.getTime();
    });

    return allProducts as Product[]; // Type assertion to Product[]
  } catch (error) {
    console.error("Error reading local JSON files:", error);
    return []; // Or handle error more gracefully
  }
}