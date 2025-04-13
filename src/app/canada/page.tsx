/* eslint-disable @next/next/no-img-element */

import fs from "fs"
import path from "path"
import Image from "next/image"

interface Product {
  name: string
  hyperlink: string
  final_price: number
  image_link: string
  percent_off_list_price: string
}

export default async function GarageToolsPage() {
  const filePath = path.join(process.cwd(), "public", "data", "Canada_garage_tools.json")
  const fileContent = fs.readFileSync(filePath, "utf-8")
  const products: Product[] = JSON.parse(fileContent)

  return (
    <div className="min-h-screen bg-red-50">
      <header className="bg-red-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <div className="flex items-center">
            <Image src="/logo-png.png" alt="Canadian Deals Logo" width={40} height={40} className="mr-3" />
            <h1 className="text-2xl font-bold">Canada Garage Tools Deals</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item, index) => (
            <a
              key={index}
              href={item.hyperlink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-red-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <div className="h-48 bg-white p-4 flex items-center justify-center">
                <img src={item.image_link || "/placeholder.svg"} alt={item.name} className="h-full object-contain" />
              </div>
              <div className="p-4 border-t border-red-100 flex-grow">
                <p className="font-medium text-gray-800 mb-2 line-clamp-2">{item.name}</p>
                <div className="flex justify-between items-center">
                  <p className="text-red-600 font-bold">${item.final_price}</p>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                    {item.percent_off_list_price}% OFF
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}
