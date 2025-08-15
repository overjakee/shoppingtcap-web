"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { productService } from "@/services/productService";
import { cartService } from "@/services/cartService";
import { useCart } from "@/contexts/CartContext";
import { ProductResponse } from "@/models/dto/product";
import { AddCartRequest, UpdateCartRequest } from "@/models/dto/cart";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { cartItems, addToCart } = useCart();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (id) {
      productService.getProductById(Number(id)).then(setProduct);
    }
  }, [id]);

  if (!product)
    return (
      <div className="flex justify-center items-center h-64 text-lg font-medium text-gray-600">
        Loading product...
      </div>
    );

  const handleAdd = async () => {
    if (quantity < 1) return alert("จำนวนต้องมากกว่า 0");
    if (quantity > product.stockQuantity) return alert("จำนวนเกิน stock");

    const existingItem = cartItems.find((item) => item.productId === product.productId);

    try {
      if (existingItem) {
        const request: UpdateCartRequest = {
          productId: product.productId,
          quantity: existingItem.quantity + quantity,
        };
        const data = await cartService.updateCart(existingItem.id, request);
        if (data.isSuccess) {
          addToCart({
            id: existingItem.id,
            productId: product.productId,
            name: product.productName,
            quantity: existingItem.quantity + quantity,
            price: product.price,
          });
          alert("เพิ่มจำนวนสินค้าลงตะกร้าเรียบร้อย");
          router.push("/");
        } else {
          alert("อัปเดตตะกร้าไม่สำเร็จ");
        }
      } else {
        const request: AddCartRequest = {
          productId: product.productId,
          quantity: quantity,
        };
        const data = await cartService.addCart(request);
        if (data.isSuccess) {
          addToCart({
            id: data.cartId,
            productId: product.productId,
            name: product.productName,
            quantity: quantity,
            price: product.price,
          });
          alert("เพิ่มสินค้าลงตะกร้าสำเร็จ");
          router.push("/");
        } else {
          alert("เพิ่มสินค้าไม่สำเร็จ");
        }
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-lg rounded-xl p-6">
        <div>
          <h1 className="text-3xl font-bold mb-3">{product.productName}</h1>
          <p className="text-xl font-semibold text-green-600 mb-2">
            {product.price.toFixed(2)} บาท
          </p>
          <p className="text-gray-500 mb-4">
            Stock: <span className="font-medium">{product.stockQuantity}</span> {product.unit}
          </p>

          <div className="flex items-center gap-3 mb-6">
            <label className="font-medium">Quantity:</label>
            <input
              type="number"
              value={quantity}
              min={1}
              max={product.stockQuantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border rounded-lg px-3 py-2 w-24 text-center focus:ring focus:ring-green-300"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAdd}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg shadow-md transition duration-200"
            >
              Add to Cart
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-lg shadow-md transition duration-200"
            >
              Back to Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
