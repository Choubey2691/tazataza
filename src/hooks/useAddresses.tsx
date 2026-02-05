import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Address {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  house_no: string;
  landmark: string | null;
  area: string;
  pincode: string;
  is_default: boolean | null;
  created_at: string;
}

export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Address[];
    },
  });
}

export function useAddAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (address: {
      name: string;
      phone: string;
      house_no: string;
      landmark?: string;
      area: string;
      pincode: string;
      is_default?: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // If this is set as default, unset other defaults first
      if (address.is_default) {
        await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", user.id);
      }

      const { data, error } = await supabase
        .from("addresses")
        .insert({
          user_id: user.id,
          name: address.name,
          phone: address.phone,
          house_no: address.house_no,
          landmark: address.landmark || null,
          area: address.area,
          pincode: address.pincode,
          is_default: address.is_default || false,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Address;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}
