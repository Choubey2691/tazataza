import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface RecentProduct {
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

interface RecentProductsContextType {
  recentProducts: RecentProduct[];
  saveRecentProduct: (product: RecentProduct) => void;
}

const RecentProductsContext = createContext<RecentProductsContextType | undefined>(undefined);

const RECENT_PRODUCTS_KEY = 'recent_products';

export const RecentProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_PRODUCTS_KEY);
    if (stored) {
      try {
        const products = JSON.parse(stored) as RecentProduct[];
        setRecentProducts(products.slice(0, 10));
      } catch (error) {
        console.error('Error parsing recent products from localStorage:', error);
        setRecentProducts([]);
      }
    }
  }, []);

  const saveRecentProduct = (product: RecentProduct) => {
    setRecentProducts(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 10);
      localStorage.setItem(RECENT_PRODUCTS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <RecentProductsContext.Provider value={{ recentProducts, saveRecentProduct }}>
      {children}
    </RecentProductsContext.Provider>
  );
};

export const useRecentProducts = (): RecentProductsContextType => {
  const context = useContext(RecentProductsContext);
  if (!context) {
    throw new Error('useRecentProducts must be used within a RecentProductsProvider');
  }
  return context;
};
