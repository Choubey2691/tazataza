import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { MobileLayout, MobileContent } from "@/components/layout/MobileLayout";
import { TazaButton } from "@/components/ui/taza-button";
import { useAppStore } from "@/store/appStore";
import { deliverySlots } from "@/data/products";
import { Check, Package } from "lucide-react";

const OrderSuccessScreen: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();
  const [showCheck, setShowCheck] = useState(false);
  const selectedSlot = location.state?.selectedSlot || useAppStore((state) => state.selectedSlot);
  const slot = deliverySlots.find((s) => s.id === selectedSlot);

  useEffect(() => {
    setTimeout(() => setShowCheck(true), 300);
  }, []);

  const estimatedTime = new Date();
  estimatedTime.setHours(estimatedTime.getHours() + 2);

  return (
    <MobileLayout>
      <MobileContent className="flex flex-col items-center justify-center min-h-screen px-6">
        {/* Success Animation */}
        <div
          className={`relative transition-all duration-500 ${
            showCheck ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          <div className="w-28 h-28 rounded-full bg-primary flex items-center justify-center shadow-button">
            <Check className="w-14 h-14 text-primary-foreground" strokeWidth={3} />
          </div>
          <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-accent flex items-center justify-center">
            <Package className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center mt-8">
          <h1 className="text-2xl font-bold text-foreground">Order Placed!</h1>
          <p className="text-muted-foreground mt-2">
            Your fresh vegetables are on the way
          </p>
        </div>

        {/* Order Details */}
        <div className="w-full mt-8 p-4 bg-secondary rounded-2xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-mono font-bold text-foreground">{orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Delivery Slot</span>
            <span className="font-medium text-primary">
              {slot ? `${slot.id === 'morning' ? 'Tomorrow' : 'Today'} • ${slot.label}` : "Slot not selected"}
            </span>
          </div>
        </div>

        {/* Fun Message */}
        <div className="mt-6 p-4 bg-accent rounded-2xl text-center">
          <p className="text-lg">🥬🥕🍅</p>
          <p className="text-sm text-accent-foreground mt-2">
            Fresh & healthy veggies coming your way!
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full mt-8 space-y-3">
          <TazaButton
            size="full"
            onClick={() => navigate("/orders")}
          >
            Track Order
          </TazaButton>
          <TazaButton
            size="full"
            variant="secondary"
            onClick={() => navigate("/home")}
          >
            Continue Shopping
          </TazaButton>
        </div>
      </MobileContent>
    </MobileLayout>
  );
};

export default OrderSuccessScreen;
