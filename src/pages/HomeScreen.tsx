import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout, MobileContent } from "@/components/layout/MobileLayout";
import { TazaCard } from "@/components/ui/taza-card";
import { useAppStore } from "@/store/appStore";
import { useAuth } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useCategories";
import { useRecentProducts } from "@/contexts/RecentProductsContext";
import { useHomepage } from "@/hooks/useHomepage";
import { CategorySection } from "@/components/CategorySection";
import { Search, ShoppingCart, MapPin, Bell, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/ProductImage";
import { ProductCard } from "@/components/ProductCard";

const CATEGORY_IMAGES: Record<string, string> = {
  Vegetables: "/category-icons/vegetables.png",
  Fruits: "/category-icons/fruits.png",
  Dairy: "/category-icons/dairy.png",
  Snacks: "/category-icons/snacks.png",
  Grocery: "/category-icons/grocery.png"
};

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const cart = useAppStore((state) => state.cart);
  const cartCount = useAppStore((state) => state.getCartCount());
  const addToCart = useAppStore((state) => state.addToCart);
  const updateQuantity = useAppStore((state) => state.updateQuantity);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: categories = [] } = useCategories();
  const { recentProducts } = useRecentProducts();
  const { data: homepageData, isLoading: loadingHomepage, error } = useHomepage();

  return (
    <MobileLayout>
      <MobileContent className="pb-20" padded={false}>
        <div className="bg-primary px-4 pt-4 pb-6 safe-area-top">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-primary-foreground/80 text-sm">Welcome back,</p>
              <h1 className="text-xl font-bold text-primary-foreground">
                {profile?.name || "Guest"} 👋
              </h1>
            </div>
            <button className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>
          <button className="flex items-center gap-2 text-primary-foreground/90">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Delivery to your location</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="mt-4">
            <button
              onClick={() => navigate("/search")}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-card text-muted-foreground text-left flex items-center hover:bg-secondary/50 transition-colors"
            >
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              Search vegetables, fruits, dairy...
            </button>
          </div>
        </div>
        <div className="px-4 -mt-2">
          <section className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Categories</h2>
              <button onClick={() => navigate("/categories")} className="text-primary text-sm font-medium">See All</button>
            </div>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {categories.length > 0 ? categories.map((cat) => (
                <button key={cat.id} onClick={() => { console.log('Selected category ID:', cat.id); navigate(`/category/${cat.id}`); }} className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                  <img
                    src={CATEGORY_IMAGES[cat.name] || "/category-icons/default.png"}
                    alt={cat.name}
                    className="w-10 h-10 object-contain"
                    loading="lazy"
                  />
                  <span className="text-xs font-medium">
                    {cat.name}
                  </span>
                </button>
              )) : (
                <div className="text-center text-muted-foreground">Loading categories...</div>
              )}
            </div>
          </section>
          <section className="mt-6">
            <TazaCard className="bg-accent p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center"><span className="text-2xl">🚚</span></div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Free Delivery above ₹99</p>
                <p className="text-sm text-muted-foreground">On orders below ₹99, delivery fee ₹19</p>
              </div>
            </TazaCard>
          </section>
          {recentProducts.length > 0 && (
            <section className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recently Viewed</h2>
              <button onClick={() => navigate("/recent-products")} className="text-primary text-sm font-medium">See All</button>
            </div>
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                {recentProducts.map((product) => (
                  <div key={product.id} className="min-w-[120px]">
                    <ProductCard product={product} size="small" />
                  </div>
                ))}
              </div>
            </section>
          )}
          {error ? (
            <section className="mt-6">
              <div className="flex flex-col items-center justify-center py-12">
                <span className="text-5xl mb-4">⚠️</span>
                <p className="text-muted-foreground text-center">Unable to load products</p>
              </div>
            </section>
          ) : (
            <>
              <CategorySection
                title="Vegetables"
                products={homepageData?.vegetables || []}
                categoryId="vegetables"
                loading={loadingHomepage}
              />
              <CategorySection
                title="Fruits"
                products={homepageData?.fruits || []}
                categoryId="fruits"
                loading={loadingHomepage}
              />
              <CategorySection
                title="Dairy"
                products={homepageData?.dairy || []}
                categoryId="dairy"
                loading={loadingHomepage}
              />
              <CategorySection
                title="Snacks"
                products={homepageData?.snacks || []}
                categoryId="snacks"
                loading={loadingHomepage}
              />
              <CategorySection
                title="Grocery"
                products={homepageData?.grocery || []}
                categoryId="grocery"
                loading={loadingHomepage}
              />
            </>
          )}
          <div className="h-8" />
        </div>
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] bg-card border-t border-border px-4 py-2 safe-area-bottom">
          <div className="flex items-center justify-around">
            <button className="flex flex-col items-center gap-1 py-2 px-4 text-primary"><span className="text-xl">🏠</span><span className="text-xs font-medium">Home</span></button>
            <button onClick={() => navigate("/categories")} className="flex flex-col items-center gap-1 py-2 px-4 text-muted-foreground"><span className="text-xl">📦</span><span className="text-xs font-medium">Categories</span></button>
            <button onClick={() => navigate("/cart")} className="relative flex flex-col items-center gap-1 py-2 px-4 text-muted-foreground">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && <span className="absolute -top-1 right-2 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
              <span className="text-xs font-medium">Cart</span>
            </button>
            <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-1 py-2 px-4 text-muted-foreground"><span className="text-xl">👤</span><span className="text-xs font-medium">Profile</span></button>
          </div>
        </nav>
      </MobileContent>
    </MobileLayout>
  );
};

export default HomeScreen;
