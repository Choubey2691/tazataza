import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export interface SuggestionProduct {
  id: string;
  name: string;
  brand: string | null;
  image_url: string | null;
  price: number;
}

export function useSuggestions(searchText: string) {
  const [debouncedText, setDebouncedText] = useState(searchText);

  // Debounce search text
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(searchText);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  return useQuery({
    queryKey: ["suggestions", debouncedText],
    queryFn: async () => {
      if (!debouncedText.trim() || debouncedText.length <= 1) {
        return [];
      }

      const searchTerm = `%${debouncedText.trim()}%`;

      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, brand, image_url, price")
          .or(`name.ilike.${searchTerm},brand.ilike.${searchTerm},category.ilike.${searchTerm}`)
          .eq("in_stock", true)
          .limit(6);

        if (error) {
          console.error("Suggestions error:", error);
          return [];
        }

        return (data || []) as SuggestionProduct[];
      } catch (error) {
        console.error("Suggestions error:", error);
        return [];
      }
    },
    enabled: !!debouncedText.trim() && debouncedText.length > 1,
  });
}
