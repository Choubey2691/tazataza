import React from "react";
import { TazaCard } from "@/components/ui/taza-card";
import { TazaButton } from "@/components/ui/taza-button";
import { useAppStore } from "@/store/appStore";
import { deliverySlots } from "@/data/products";
import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlotSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SlotSelectionModal: React.FC<SlotSelectionModalProps> = ({ isOpen, onClose }) => {
  const selectedSlot = useAppStore((state) => state.selectedSlot);
  const setSelectedSlot = useAppStore((state) => state.setSelectedSlot);

  const handleSelectSlot = (slotId: string) => {
    setSelectedSlot(slotId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full max-w-[400px] mx-auto bg-card rounded-t-3xl max-h-[80vh] overflow-hidden">
        <div className="p-6">
          <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4" />
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-accent mx-auto flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Choose Delivery Time</h2>
            <p className="text-muted-foreground mt-1">When should we deliver your order?</p>
          </div>

          <div className="space-y-3">
            {deliverySlots.map((slot) => (
              <TazaCard
                key={slot.id}
                variant={selectedSlot === slot.id ? "default" : "outlined"}
                className={cn(
                  "p-4 cursor-pointer transition-all",
                  selectedSlot === slot.id && "ring-2 ring-primary"
                )}
                onClick={() => handleSelectSlot(slot.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center">
                    <span className="text-3xl">{slot.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{slot.label}</h3>
                    <p className="text-muted-foreground">{slot.time}</p>
                  </div>
                  {selectedSlot === slot.id && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </TazaCard>
            ))}
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-accent rounded-2xl">
            <p className="text-sm text-accent-foreground">
              <span className="font-medium">Note:</span> Delivery times may vary based on your location and order size.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotSelectionModal;
