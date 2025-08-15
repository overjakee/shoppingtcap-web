import Link from "next/link";
import { productService } from "@/services/productService";

export default async function ProductListPage() {
  const products = await productService.getAllProduct();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">หน้าร้าน</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.productId}
            className="bg-white border rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
          >
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-lg font-semibold mb-1">{product.productName}</h2>
              <p className="text-green-600 font-bold text-lg mb-2">
                {product.price.toFixed(2)} บาท
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Stock: {product.stockQuantity} {product.unit}
              </p>

              <div className="mt-auto">
                <Link
                  href={`/product/${product.productId}`}
                  className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
