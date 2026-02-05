import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MobileLayout, MobileHeader, MobileContent } from "@/components/layout/MobileLayout";
import { TazaCard } from "@/components/ui/taza-card";
import { useAppStore } from "@/store/appStore";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { ProductCard } from "@/components/ProductCard";

const ProductListScreen: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  console.log('Received categoryId from params:', categoryId);
  const addToCart = useAppStore((state) => state.addToCart);
  const cart = useAppStore((state) => state.cart);
  const updateQuantity = useAppStore((state) => state.updateQuantity);
  const cartCount = useAppStore((state) => state.getCartCount());
  const { data: categories = [] } = useCategories();
  const category = categories.find((c) => c.id === categoryId);
  console.log('Found category:', category);
  const { data: products = [], isLoading, error } = useProducts(categoryId);

  if (!category) return <MobileLayout><MobileContent className="flex items-center justify-center min-h-screen"><p>Category not found</p></MobileContent></MobileLayout>;

  return (
    <MobileLayout>
      <MobileHeader title={category.name} leftAction={<button onClick={() => navigate(-1)} className="p-2 -ml-2"><ArrowLeft className="w-5 h-5 text-foreground" /></button>} rightAction={<button onClick={() => navigate("/cart")} className="relative p-2 -mr-2"><ShoppingCart className="w-5 h-5 text-foreground" />{cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold">{cartCount}</span>}</button>} />
      <MobileContent className="pt-4 pb-24">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-destructive">Failed to load products. Please try again.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 px-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        {!isLoading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="text-5xl mb-4">{category.icon}</span>
            <p className="text-muted-foreground">No products available</p>
          </div>
        )}
      </MobileContent>
    </MobileLayout>
  );
};

export default ProductListScreen;
