import React from "react";
import { useNavigate } from "react-router-dom";
import { TazaCard } from "@/components/ui/taza-card";
import { ProductImage } from "@/components/ProductImage";
import { useAppStore } from "@/store/appStore";
import { useRecentProducts } from "@/contexts/RecentProductsContext";

interface Product {
  id: string;
  name: string;
  brand?: string;
  price: number;
  price_mrp?: number;
  unit: string;
  image_url?: string;
  category: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  className?: string;
  size?: 'normal' | 'small';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className, size = 'normal' }) => {
  const navigate = useNavigate();
  const addToCart = useAppStore((state) => state.addToCart);
  const updateQuantity = useAppStore((state) => state.updateQuantity);
  const cart = useAppStore((state) => state.cart);
  const { saveRecentProduct } = useRecentProducts();

  const cartItem = cart.find(item => item.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const price = product.price_selling || product.price || 0;
  const hasDiscount = product.price_mrp && price < product.price_mrp;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(price),
      unit: product.unit,
      image: product.image_url || "",
      category: product.category || product.categories?.[0] || "",
      description: product.description || undefined
    });
  };

  const handleUpdateQuantity = (e: React.MouseEvent, newQuantity: number) => {
    e.stopPropagation();
    updateQuantity(product.id, newQuantity);
  };

  const handleProductClick = () => {
    saveRecentProduct(product);
    navigate(`/product/${product.id}`);
  };

  const isSmall = size === 'small';

  return (
    <TazaCard className={`rounded-xl shadow-sm border ${isSmall ? 'p-2' : 'p-3'} bg-white overflow-hidden ${className || ''}`}>
      <button onClick={handleProductClick} className="w-full text-left">
        <div className="aspect-square w-full mb-3 rounded-lg overflow-hidden shadow-sm relative">
          <ProductImage
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.is_selling_fast && (
            <div className="hidden absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
              🔥 Selling Fast
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className={`font-bold ${isSmall ? 'text-xs' : 'text-sm'} line-clamp-2 ${isSmall ? 'min-h-[1.5rem]' : 'min-h-[2.5rem]'}`}>{product.name}</p>
          {product.brand && <p className="text-xs text-gray-500">{product.brand}</p>}
          <div className="flex items-center mt-2">
            <div className="flex flex-col">
              <p className={`font-bold text-green-600 ${isSmall ? 'text-sm' : ''}`}>₹{price}</p>
              {hasDiscount && <p className="text-xs text-gray-400 line-through">₹{product.price_mrp}</p>}
            </div>
          </div>
          <p className="text-xs text-gray-600">{product.unit}</p>
        </div>
      </button>
      <div className={`${isSmall ? 'mt-2' : 'mt-3'} flex justify-center`}>
        {quantity > 0 ? (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => handleUpdateQuantity(e, quantity - 1)}
              className={`${isSmall ? 'w-6 h-6' : 'w-8 h-8'} rounded-full border flex items-center justify-center text-green-600`}
            >
              -
            </button>
            <span className="text-sm font-medium min-w-[20px] text-center">{quantity}</span>
            <button
              onClick={handleAddToCart}
              className={`${isSmall ? 'w-6 h-6' : 'w-8 h-8'} rounded-full border flex items-center justify-center text-green-600`}
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className={`w-full ${isSmall ? 'h-8' : 'h-10'} rounded border flex items-center justify-center text-green-600 bg-green-50 hover:bg-green-100`}
          >
            ADD
          </button>
        )}
      </div>
    </TazaCard>
  );
};
