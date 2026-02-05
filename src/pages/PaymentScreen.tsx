import React from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout, MobileHeader, MobileContent } from "@/components/layout/MobileLayout";
import { TazaCard } from "@/components/ui/taza-card";
import { TazaButton } from "@/components/ui/taza-button";
import { useAppStore } from "@/store/appStore";
import { paymentModes } from "@/data/products";
import { ArrowLeft, Check, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const PaymentScreen: React.FC = () => {
  const navigate = useNavigate();
  const paymentMode = useAppStore((state) => state.paymentMode);
  const setPaymentMode = useAppStore((state) => state.setPaymentMode);

  const handleContinue = () => {
    if (paymentMode) {
      navigate("/order-summary");
    }
  };

  return (
    <MobileLayout>
      <MobileHeader
        title="Payment"
        leftAction={
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        }
      />
      <MobileContent className="pt-4 pb-32">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-accent mx-auto flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Select Payment Method</h2>
          <p className="text-muted-foreground mt-1">Choose how you'd like to pay</p>
        </div>

        <div className="space-y-3">
          {paymentModes.map((mode) => (
            <TazaCard
              key={mode.id}
              variant={paymentMode === mode.id ? "default" : "outlined"}
              className={cn(
                "p-4 cursor-pointer transition-all",
                paymentMode === mode.id && "ring-2 ring-primary"
              )}
              onClick={() => setPaymentMode(mode.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center">
                  <span className="text-3xl">{mode.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{mode.label}</h3>
                  <p className="text-sm text-muted-foreground">{mode.description}</p>
                </div>
                {paymentMode === mode.id && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            </TazaCard>
          ))}
        </div>

        {/* COD Note */}
        {paymentMode === "cod" && (
          <div className="mt-6 p-4 bg-accent rounded-2xl">
            <p className="text-sm text-accent-foreground">
              <span className="font-medium">💵 Cash on Delivery:</span> Please keep exact change ready at the time of delivery.
            </p>
          </div>
        )}
      </MobileContent>

      {/* Bottom Button */}
      {paymentMode && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] bg-card border-t border-border p-4 safe-area-bottom">
          <TazaButton size="full" onClick={handleContinue}>
            Review Order
          </TazaButton>
        </div>
      )}
    </MobileLayout>
  );
};

export default PaymentScreen;
