/* eslint-disable @next/next/no-img-element */

import fs from 'fs';
import path from 'path';

interface Product {
  name: string;
  hyperlink: string;
  final_price: number;
  image_link: string;
  percent_off_list_price: string;
}

export default async function GarageToolsPage() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'Canada_garage_tools.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const products: Product[] = JSON.parse(fileContent);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Canada Deals</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((item, index) => (
          <a key={index} href={item.hyperlink} target="_blank" className="border p-4 rounded shadow hover:bg-gray-50">
            <img src={item.image_link} alt={item.name} className="h-48 object-contain mb-2" />
            <p className="font-medium">{item.name}</p>
            <p className="text-green-600 font-bold">${item.final_price} ({item.percent_off_list_price}% OFF)</p>
          </a>
        ))}
      </div>
    </div>
  );
}
