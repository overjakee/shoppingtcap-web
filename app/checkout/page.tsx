"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { cartService } from "@/services/cartService";
import { CheckoutResponse } from "@/models/dto/cart";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const doCheckout = async () => {
      try {
        const response: CheckoutResponse = await cartService.checkoutCartAll();
        if (response.isSuccess) {
          clearCart();
          setCheckoutMessage(`ชำระเงินสำเร็จ! ยอดที่ชำระทั้งหมด: ${response.totalAmount.toFixed(2)} บาท`);
          setTotal(response.totalAmount);
          setIsSuccess(true);
        } else {
          setCheckoutMessage("การชำระเงินล้มเหลว กรุณาลองใหม่อีกครั้ง");
          setIsSuccess(false);
        }
      } catch (err) {
        console.error(err);
        setCheckoutMessage("เกิดข้อผิดพลาดระหว่างการชำระเงิน");
        setIsSuccess(false);
      } finally {
        if (cartItems.length > 0) {
          const sum = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
          setTotal(sum);
        }
        setLoading(false);
      }
    };

    doCheckout();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-8 text-lg animate-pulse">
        กำลังดำเนินการชำระเงิน...
      </div>
    );

  return (
    <div className="max-w-md mx-auto text-center bg-white shadow-lg rounded-lg p-8 mt-10">
      {isSuccess ? (
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
      ) : (
        <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
      )}

      <h1 className="text-2xl font-bold mb-2">
        {isSuccess ? "ขอบคุณสำหรับการสั่งซื้อ!" : "การชำระเงินล้มเหลว"}
      </h1>

      <p
        className={`mb-4 font-semibold ${
          isSuccess ? "text-green-600" : "text-red-600"
        }`}
      >
        {checkoutMessage}
      </p>

      {isSuccess && (
        <p className="text-gray-600 mb-6">
          การชำระเงินจำนวน <span className="font-bold">{total.toFixed(2)} บาท</span>{" "}
          ของคุณเสร็จสิ้นเรียบร้อยแล้ว
        </p>
      )}

      <Link
        href="/"
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
      >
        กลับไปที่หน้าสินค้า
      </Link>
    </div>
  );
}
