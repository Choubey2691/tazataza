import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HomepageProduct {
  id: string;
  name: string;
  unit: string;
  image_url: string;
  price_selling: number;
  priority_score: number;
  is_selling_fast: boolean;
  stock: number;
  categories: string[];
}

export interface HomepageData {
  vegetables: HomepageProduct[];
  fruits: HomepageProduct[];
  dairy: HomepageProduct[];
  snacks: HomepageProduct[];
  grocery: HomepageProduct[];
}

export function useHomepage() {
  return useQuery({
    queryKey: ["homepage"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc("get_homepage_products");

      if (error) throw error;
      return data as HomepageData;
    },
  });
}
