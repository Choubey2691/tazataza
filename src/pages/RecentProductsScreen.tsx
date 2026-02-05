import React from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout, MobileContent } from "@/components/layout/MobileLayout";
import { useRecentProducts } from "@/contexts/RecentProductsContext";
import { ProductCard } from "@/components/ProductCard";
import { ArrowLeft } from "lucide-react";

const RecentProductsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { recentProducts } = useRecentProducts();

  return (
    <MobileLayout>
      <MobileContent className="pb-20" padded={false}>
        <div className="bg-primary px-4 pt-4 pb-6 safe-area-top">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-primary-foreground" />
            </button>
            <h1 className="text-xl font-bold text-primary-foreground">Recently Viewed</h1>
          </div>
        </div>
        <div className="px-4">
          {recentProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-6">
              {recentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <span className="text-5xl mb-4">🕒</span>
              <p className="text-muted-foreground text-center">No recently viewed products</p>
              <p className="text-sm text-muted-foreground text-center">Start browsing to see your recent views here!</p>
            </div>
          )}
        </div>
      </MobileContent>
    </MobileLayout>
  );
};

export default RecentProductsScreen;
