import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  image_url: string | null;
  category: string;
  description: string | null;
  in_stock: boolean | null;
}

export function useProducts(categoryId?: string) {
  return useQuery({
    queryKey: ["products", categoryId],
    queryFn: async () => {
      console.log("Selected Category ID:", categoryId);

      if (categoryId) {
        const { data, error } = await (supabase as any)
          .from("product_categories")
          .select(`
            category_id,
            products(*)
          `)
          .eq("category_id", categoryId);

        console.log("Raw Supabase Data:", data);
        console.log("Supabase Error:", error);

        if (error) throw error;

        const productsList = data?.map(item => item.products) || [];
        console.log("Final Products List:", productsList);

        return productsList as Product[];
      } else {
        // For all products, we still need to fetch from products table
        // since product_categories doesn't include products not in categories
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("in_stock", true)
          .order("name");

        console.log("Supabase Response (all products):", data);
        console.log("Supabase Error (all products):", error);

        if (error) throw error;
        return data as Product[];
      }
    },
  });
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      console.log("Fetching product with id:", productId);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      console.log("Supabase response:", data, "Error:", error);
      if (error) throw error;
      return data as Product;
    },
    enabled: !!productId,
  });
}
