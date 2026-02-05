import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useAppStore } from "@/store/appStore";

export const FloatingCart: React.FC = () => {
  const navigate = useNavigate();
  const cartCount = useAppStore((state) => state.getCartCount());

  if (cartCount === 0) {
    return null;
  }

  return (
    <button
      onClick={() => navigate("/cart")}
      className="fixed bottom-16 right-6 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow duration-200"
      aria-label={`View cart with ${cartCount} items`}
    >
      <div className="relative">
        <ShoppingCart className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </div>
    </button>
  );
};
