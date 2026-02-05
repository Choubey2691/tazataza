import React from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout, MobileHeader, MobileContent } from "@/components/layout/MobileLayout";
import { TazaCard } from "@/components/ui/taza-card";
import { TazaButton } from "@/components/ui/taza-button";
import { useOrders } from "@/hooks/useOrders";
import { ArrowLeft, Package, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const OrderHistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { data: orders = [], isLoading } = useOrders();

  const getStatusColor = (status: string) => {
    switch (status) { case "confirmed": return "bg-primary/20 text-primary"; case "delivered": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"; case "cancelled": return "bg-destructive/20 text-destructive"; default: return "bg-muted text-muted-foreground"; }
  };
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  if (isLoading) return <MobileLayout><MobileHeader title="My Orders" leftAction={<button onClick={() => navigate(-1)} className="p-2 -ml-2"><ArrowLeft className="w-5 h-5 text-foreground" /></button>} /><MobileContent className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></MobileContent></MobileLayout>;
  if (orders.length === 0) return <MobileLayout><MobileHeader title="My Orders" leftAction={<button onClick={() => navigate(-1)} className="p-2 -ml-2"><ArrowLeft className="w-5 h-5 text-foreground" /></button>} /><MobileContent className="flex flex-col items-center justify-center min-h-[60vh]"><div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6"><Package className="w-12 h-12 text-muted-foreground" /></div><h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2><p className="text-muted-foreground text-center mb-6">Start shopping fresh vegetables today!</p><TazaButton onClick={() => navigate("/home")}>Browse Products</TazaButton></MobileContent></MobileLayout>;

  return (
    <MobileLayout>
      <MobileHeader title="My Orders" leftAction={<button onClick={() => navigate(-1)} className="p-2 -ml-2"><ArrowLeft className="w-5 h-5 text-foreground" /></button>} />
      <MobileContent className="pt-4 pb-8">
        <div className="space-y-3">
          {orders.map((order) => (
            <TazaCard key={order.id} variant="elevated" className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div><p className="font-mono font-bold text-foreground">{order.order_number}</p><p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p></div>
                <span className={cn("px-3 py-1 rounded-full text-xs font-medium capitalize", getStatusColor(order.status))}>{order.status}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <p className="font-bold text-primary">₹{order.total}</p>
                <button className="flex items-center gap-1 text-primary font-medium text-sm">View Details<ChevronRight className="w-4 h-4" /></button>
              </div>
            </TazaCard>
          ))}
        </div>
      </MobileContent>
    </MobileLayout>
  );
};

export default OrderHistoryScreen;
