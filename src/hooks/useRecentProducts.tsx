import { useState, useEffect } from 'react';

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

const RECENT_PRODUCTS_KEY = 'recent_products';
const RECENT_PRODUCTS_UPDATE_EVENT = 'recentProductsUpdate';

export const useRecentProducts = (): { recentProducts: RecentProduct[]; saveRecentProduct: (product: RecentProduct) => void } => {
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);

  const loadRecentProducts = () => {
    const stored = localStorage.getItem(RECENT_PRODUCTS_KEY);
    if (stored) {
      try {
        const products = JSON.parse(stored) as RecentProduct[];
        setRecentProducts(products.slice(0, 10));
      } catch (error) {
        console.error('Error parsing recent products from localStorage:', error);
        setRecentProducts([]);
      }
    } else {
      setRecentProducts([]);
    }
  };

  useEffect(() => {
    loadRecentProducts();

    const handleUpdate = () => {
      loadRecentProducts();
    };

    window.addEventListener(RECENT_PRODUCTS_UPDATE_EVENT, handleUpdate);

    return () => {
      window.removeEventListener(RECENT_PRODUCTS_UPDATE_EVENT, handleUpdate);
    };
  }, []);

  const saveRecentProduct = (product: RecentProduct) => {
    const stored = localStorage.getItem(RECENT_PRODUCTS_KEY);
    let currentProducts: RecentProduct[] = [];
    if (stored) {
      try {
        currentProducts = JSON.parse(stored) as RecentProduct[];
      } catch (error) {
        console.error('Error parsing recent products from localStorage:', error);
      }
    }

    const filtered = currentProducts.filter(p => p.id !== product.id);
    const updated = [product, ...filtered].slice(0, 10);
    localStorage.setItem(RECENT_PRODUCTS_KEY, JSON.stringify(updated));
    setRecentProducts(updated);
    window.dispatchEvent(new Event(RECENT_PRODUCTS_UPDATE_EVENT));
  };

  return { recentProducts, saveRecentProduct };
};
