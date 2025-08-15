"use client";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const { cartItems } = useCart();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white">
      <Link href="/" className="text-xl font-bold">My Shop</Link>
      <Link href="/cart" className="relative">
        <ShoppingCart size={28} />
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
      </Link>
    </header>
  );
}
