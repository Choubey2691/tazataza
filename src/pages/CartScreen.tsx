import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout, MobileHeader, MobileContent } from "@/components/layout/MobileLayout";
import { TazaCard } from "@/components/ui/taza-card";
import { TazaButton } from "@/components/ui/taza-button";
import { useAppStore } from "@/store/appStore";
import { useAddresses } from "@/hooks/useAddresses";
import { deliverySlots } from "@/data/products";
import { calculateDeliveryFee, getDeliveryFeeDisplay } from "@/lib/delivery";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

const CartScreen: React.FC = () => {
  const navigate = useNavigate();
  const cart = useAppStore((state) => state.cart);
  const updateQuantity = useAppStore((state) => state.updateQuantity);
  const removeFromCart = useAppStore((state) => state.removeFromCart);
  const getCartTotal = useAppStore((state) => state.getCartTotal);
  const selectedAddress = useAppStore((state) => state.selectedAddress);
  const setSelectedAddress = useAppStore((state) => state.setSelectedAddress);
  const selectedSlot = useAppStore((state) => state.selectedSlot);
  const setSelectedSlot = useAppStore((state) => state.setSelectedSlot);
  const { data: addresses = [] } = useAddresses();

  // Auto-select address and slot
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      // Select default address, or first address if no default
      const defaultAddress = addresses.find(addr => addr.is_default);
      const addressToSelect = defaultAddress || addresses[0];
      setSelectedAddress(addressToSelect);
    }

    if (!selectedSlot) {
      // Auto-select slot based on current time
      const now = new Date();
      const currentHour = now.getHours();
      // If time between 6 AM – 4 PM: Select Evening Slot (5 PM – 9 PM)
      // If time after 4 PM: Select Next Day Morning Slot (6 AM – 10 AM)
      const slotId = currentHour >= 6 && currentHour < 16 ? "evening" : "morning";
      setSelectedSlot(slotId);
    }
  }, [addresses, selectedAddress, setSelectedAddress, selectedSlot, setSelectedSlot]);

  const subtotal = getCartTotal();
  const deliveryFee = calculateDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <MobileLayout>
        <MobileHeader
          title="Cart"
          leftAction={
            <button onClick={() => navigate(-1)} className="p-2 -ml-2">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
          }
        />
        <MobileContent className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground text-center mb-6">
            Add fresh vegetables and groceries to get started
          </p>
          <TazaButton onClick={() => navigate("/home")}>
            Browse Products
          </TazaButton>
        </MobileContent>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <MobileHeader
        title={`Cart (${cart.length})`}
        leftAction={
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        }
      />
      <MobileContent className="pt-4 pb-48">
        <div className="space-y-3">
          {cart.map((item) => (
            <TazaCard key={item.id} variant="elevated" className="p-3">
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium text-foreground line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{item.unit}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-bold text-primary">₹{item.price * item.quantity}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-foreground"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-medium text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TazaCard>
          ))}
        </div>


      </MobileContent>

      {/* Bottom Summary */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] bg-card border-t border-border p-4 safe-area-bottom">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span className={deliveryFee === 0 ? "text-primary font-medium" : "text-foreground"}>
              {getDeliveryFeeDisplay(deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-bold text-primary text-lg">₹{total}</span>
          </div>
        </div>
        <TazaButton size="full" onClick={() => navigate("/payment")}>
          Proceed to Checkout
        </TazaButton>
      </div>
    </MobileLayout>
  );
};

export default CartScreen;
