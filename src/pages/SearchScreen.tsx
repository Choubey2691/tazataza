import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout, MobileHeader, MobileContent } from "@/components/layout/MobileLayout";
import { useAppStore } from "@/store/appStore";
import { useSearch } from "@/hooks/useSearch";
import { SearchBar } from "@/components/SearchBar";
import { QuickChips } from "@/components/QuickChips";
import { ProductCard } from "@/components/ProductCard";
import { ArrowLeft, ShoppingCart, Search as SearchIcon } from "lucide-react";

const QUICK_CHIPS = ["Potato", "Tomato", "Onion", "Milk", "Banana"];

const RECENT_SEARCHES_KEY = "recentSearches";

const SearchScreen: React.FC = () => {
  const navigate = useNavigate();
  const cartCount = useAppStore((state) => state.getCartCount());
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (error) {
        console.error("Error parsing recent searches:", error);
      }
    }
  }, []);

  // Use search hook
  const { data: results = [], isLoading } = useSearch(searchQuery);

  // Add to recent searches when we have results
  useEffect(() => {
    if (searchQuery.trim() && results.length > 0 && !isLoading) {
      setRecentSearches(prev => {
        const filtered = prev.filter(s => s !== searchQuery);
        const updated = [searchQuery, ...filtered].slice(0, 5);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }, [searchQuery, results.length, isLoading]);

  const handleChipClick = (chip: string) => {
    setSearchQuery(chip);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <MobileLayout>
      <MobileHeader
        leftAction={
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        }
        rightAction={
          <button onClick={() => navigate("/cart")} className="relative p-2 -mr-2">
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        }
      />
      <MobileContent className="pt-4 pb-24">
        <div className="px-4 space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search vegetables, fruits, dairy..."
          />

          <QuickChips
            chips={QUICK_CHIPS}
            onChipClick={handleChipClick}
          />

          {recentSearches.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Recent Searches</p>
              <QuickChips
                chips={recentSearches}
                onChipClick={handleChipClick}
              />
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-secondary rounded-xl p-3">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-muted rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : searchQuery ? (
            <div className="flex flex-col items-center justify-center py-12">
              <SearchIcon className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                No products found
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <SearchIcon className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Start typing or tap a chip to search for products
              </p>
            </div>
          )}
        </div>
      </MobileContent>
    </MobileLayout>
  );
};

export default SearchScreen;
