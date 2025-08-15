import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header";

export const metadata = {
  title: "Shopping App",
  description: "Next.js Shopping Cart Example",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main className="p-6">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
