import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout, MobileHeader, MobileContent } from "@/components/layout/MobileLayout";
import { TazaCard } from "@/components/ui/taza-card";
import { TazaButton } from "@/components/ui/taza-button";
import { useAppStore } from "@/store/appStore";
import { useCreateOrder } from "@/hooks/useOrders";
import { deliverySlots, paymentModes } from "@/data/products";
import { calculateDeliveryFee, getDeliveryFeeDisplay } from "@/lib/delivery";
import { ArrowLeft, MapPin, Clock, CreditCard } from "lucide-react";
import { toast } from "sonner";
import AddressSelectionModal from "@/components/AddressSelectionModal";
import SlotSelectionModal from "@/components/SlotSelectionModal";

const OrderSummaryScreen: React.FC = () => {
  const navigate = useNavigate();
  const cart = useAppStore((state) => state.cart);
  const selectedAddress = useAppStore((state) => state.selectedAddress);
  const selectedSlot = useAppStore((state) => state.selectedSlot);
  const paymentMode = useAppStore((state) => state.paymentMode);
  const getCartTotal = useAppStore((state) => state.getCartTotal);
  const resetCheckout = useAppStore((state) => state.resetCheckout);
  const createOrderMutation = useCreateOrder();

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);

  const subtotal = getCartTotal();
  const deliveryFee = calculateDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;
  const slot = deliverySlots.find((s) => s.id === selectedSlot);
  const payment = paymentModes.find((p) => p.id === paymentMode);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { toast.error("Please select a delivery address"); return; }
    try {
      const { orderNumber } = await createOrderMutation.mutateAsync({ address_id: selectedAddress.id, delivery_slot: selectedSlot, payment_mode: paymentMode, subtotal: subtotal, delivery_fee: deliveryFee, total: total, items: cart.map((item) => ({ product_id: item.id, product_name: item.name, product_image: item.image, price: item.price, quantity: item.quantity })) });
      navigate(`/order-success/${orderNumber}`, { state: { selectedSlot } });
      resetCheckout();
    } catch { toast.error("Failed to place order. Please try again."); }
  };

  return (
    <MobileLayout>
      <MobileHeader title="Order Summary" leftAction={<button onClick={() => navigate(-1)} className="p-2 -ml-2"><ArrowLeft className="w-5 h-5 text-foreground" /></button>} />
      <MobileContent className="pt-4 pb-40">
        <TazaCard variant="outlined" className="p-4 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-primary" /></div>
            <div className="flex-1"><p className="text-sm text-muted-foreground">Delivery Address</p><p className="font-medium text-foreground mt-1">{selectedAddress?.house_no}, {selectedAddress?.area}</p>{selectedAddress?.landmark && <p className="text-sm text-muted-foreground">Near {selectedAddress.landmark}</p>}</div>
            <button onClick={() => setShowAddressModal(true)} className="text-primary text-sm font-medium">Change</button>
          </div>
        </TazaCard>
        <TazaCard variant="outlined" className="p-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center"><Clock className="w-5 h-5 text-primary" /></div>
            <div className="flex-1"><p className="text-sm text-muted-foreground">Delivery Slot</p><p className="font-medium text-foreground mt-1">{slot?.label} ({slot?.time})</p></div>
            <button onClick={() => setShowSlotModal(true)} className="text-primary text-sm font-medium">Change</button>
          </div>
        </TazaCard>
        <TazaCard variant="outlined" className="p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center"><CreditCard className="w-5 h-5 text-primary" /></div>
            <div className="flex-1"><p className="text-sm text-muted-foreground">Payment Method</p><p className="font-medium text-foreground mt-1">{payment?.label}</p></div>
            <button onClick={() => navigate("/payment")} className="text-primary text-sm font-medium">Change</button>
          </div>
        </TazaCard>
        <h3 className="font-semibold text-foreground mb-3">Order Items ({cart.length})</h3>
        <TazaCard variant="outlined" className="p-4">
          <div className="space-y-3">
            {cart.map((item, index) => (
              <div key={item.id}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary"><img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" /></div>
                  <div className="flex-1"><p className="font-medium text-foreground text-sm">{item.name}</p><p className="text-xs text-muted-foreground">{item.unit} × {item.quantity}</p></div>
                  <p className="font-medium text-foreground">₹{item.price * item.quantity}</p>
                </div>
                {index < cart.length - 1 && <div className="border-b border-border mt-3" />}
              </div>
            ))}
          </div>
        </TazaCard>
      </MobileContent>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] bg-card border-t border-border p-4 safe-area-bottom">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">₹{subtotal}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Delivery Fee</span><span className={deliveryFee === 0 ? "text-primary font-medium" : "text-foreground"}>{getDeliveryFeeDisplay(deliveryFee)}</span></div>
          <div className="flex justify-between pt-2 border-t border-border"><span className="font-semibold text-foreground">Total</span><span className="font-bold text-primary text-lg">₹{total}</span></div>
        </div>
        <TazaButton size="full" onClick={handlePlaceOrder} loading={createOrderMutation.isPending}>Place Order</TazaButton>
      </div>

      {/* Modals */}
      <AddressSelectionModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
      />
      <SlotSelectionModal
        isOpen={showSlotModal}
        onClose={() => setShowSlotModal(false)}
      />
    </MobileLayout>
  );
};

export default OrderSummaryScreen;
