import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  brand?: string;
  price: number;
  price_mrp?: number;
  unit: string;
  image_url?: string;
  category: string;
  description?: string;
  in_stock: boolean;
  stock?: number;
}

export function useSearch(searchQuery: string, enabled: boolean = true) {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) {
        // Return empty array for empty search
        return [];
      }

      console.log("Searching for:", debouncedQuery);

      const searchTerm = `%${debouncedQuery.trim()}%`;

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .ilike("name", searchTerm)
          .eq("in_stock", true)
          .order("name")
          .limit(20);

        console.log("Search results:", data, "Error:", error);

        if (error) {
          console.error("Search error:", error);
          return [];
        }
        return data as Product[];
      } catch (error) {
        console.error("Search error:", error);
        return [];
      }
    },
    enabled: enabled && !!debouncedQuery.trim(),
  });
}
