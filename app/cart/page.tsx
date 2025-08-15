"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { cartService } from "@/services/cartService";
import { GetCartResponse, UpdateCartRequest } from "@/models/dto/cart";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<GetCartResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { clearCart, removeFromCart, addToCart } = useCart();

  const fetchCart = async () => {
    try {
      const data = await cartService.getAllCart();
      setCartItems(data);
    } catch (err) {
      console.error(err);
      alert("โหลดตะกร้าไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (cartId: number) => {
    if (!confirm("คุณแน่ใจจะลบสินค้านี้ออกจากตะกร้า?")) return;

    try {
      const res = await cartService.removeCart(cartId);
      if (res.isSuccess) {
        setCartItems((prev) => prev.filter((item) => item.id !== cartId));
        removeFromCart(cartId);
      } else {
        alert("ลบสินค้าไม่สำเร็จ");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleClearAll = async () => {
    if (!confirm("คุณแน่ใจจะลบสินค้าทั้งหมดจากตะกร้า?")) return;

    try {
      const res = await cartService.removeCartAll();
      if (res.isSuccess) {
        setCartItems([]);
        clearCart();
      } else {
        alert("ลบสินค้าทั้งหมดไม่สำเร็จ");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleChangeQuantity = async (cartId: number, newQty: number) => {
    const item = cartItems.find((c) => c.id === cartId);
    if (!item) return;

    if (newQty < 1) return alert("จำนวนต้องมากกว่า 0");

    try {
      const request: UpdateCartRequest = {
        productId: item.productId,
        quantity: newQty,
      };
      const res = await cartService.updateCart(cartId, request);
      if (res.isSuccess) {
        setCartItems((prev) =>
          prev.map((c) => (c.id === cartId ? { ...c, quantity: newQty } : c))
        );
        addToCart({
          id: cartId,
          productId: item.productId,
          name: item.productName,
          quantity: newQty,
          price: item.price,
        });
      } else {
        alert("อัปเดตจำนวนสินค้าไม่สำเร็จ");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-lg text-gray-500">
        Loading cart...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">ตะกร้าสินค้าของคุณ</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-white shadow-md rounded-lg">
          <p className="text-gray-500 mb-4">ตะกร้าสินค้าของคุณวางเปล่า</p>
          <Link
            href="/"
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <div>
                  <h2 className="font-semibold text-lg">{item.productName}</h2>
                  <p className="text-gray-500 text-sm">Unit: {item.unit}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => handleChangeQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      −
                    </button>
                    <span className="min-w-[30px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleChangeQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{(item.price * item.quantity).toFixed(2)} บาท</p>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:underline text-sm mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow flex justify-between items-center font-bold text-lg">
            <span>Total:</span>
            <span>{total.toFixed(2)} บาท</span>
          </div>

          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <button
              onClick={handleClearAll}
              className="flex-1 bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition"
            >
              Clear All
            </button>
            <Link
              href="/checkout"
              onClick={(e) => {
                if (cartItems.length === 0) {
                  e.preventDefault();
                  alert("ไม่มีสินค้าในตะกร้า");
                } else if (!confirm("คุณแน่ใจจะไปหน้าชำระเงิน?")) {
                  e.preventDefault();
                }
              }}
              className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition text-center"
            >
              Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
