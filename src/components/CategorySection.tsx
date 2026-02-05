import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { HomepageProduct } from "@/hooks/useHomepage";

interface Product {
  id: string;
  name: string;
  brand?: string;
  price: number;
  price_selling?: number;
  price_mrp?: number;
  unit: string;
  image_url?: string;
  category: string;
  categories?: string[];
  description?: string;
  is_selling_fast?: boolean;
}

interface CategorySectionProps {
  title: string;
  products: HomepageProduct[];
  categoryId?: string;
  loading?: boolean;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  products,
  categoryId,
  loading = false,
}) => {
  const navigate = useNavigate();

  const handleSeeAll = () => {
    if (categoryId) {
      navigate(`/category/${categoryId}`);
    }
  };

  const displayProducts = products.slice(0, 10);

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <button
          onClick={handleSeeAll}
          className="text-primary text-sm font-medium flex items-center gap-1"
        >
          See All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      {loading ? (
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="min-w-[120px] animate-pulse">
              <div className="aspect-square w-full mb-3 rounded-lg bg-gray-200"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : displayProducts.length > 0 ? (
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {displayProducts.map((product) => (
            <div key={product.id} className="min-w-[120px]">
              <ProductCard product={product} size="small" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <span className="text-3xl mb-4">🛒</span>
          <p className="text-muted-foreground text-center">No products available</p>
        </div>
      )}
    </section>
  );
};
