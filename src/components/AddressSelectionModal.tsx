import React, { useState } from "react";
import { TazaButton } from "@/components/ui/taza-button";
import { TazaInput } from "@/components/ui/taza-input";
import { TazaCard } from "@/components/ui/taza-card";
import { useAppStore } from "@/store/appStore";
import { useAddresses, useAddAddress } from "@/hooks/useAddresses";
import { MapPin, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AddressSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddressSelectionModal: React.FC<AddressSelectionModalProps> = ({ isOpen, onClose }) => {
  const { data: addresses = [], isLoading } = useAddresses();
  const addAddressMutation = useAddAddress();
  const selectedAddress = useAppStore((state) => state.selectedAddress);
  const setSelectedAddress = useAppStore((state) => state.setSelectedAddress);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", house_no: "", landmark: "", area: "", pincode: "", is_default: true });
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (!isLoading && addresses.length === 0) setShowForm(true);
  }, [isLoading, addresses.length]);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Required";
    if (!formData.phone.trim()) newErrors.phone = "Required";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Must be 10 digits";
    if (!formData.house_no.trim()) newErrors.house_no = "Required";
    if (!formData.area.trim()) newErrors.area = "Required";
    if (!formData.pincode.trim()) newErrors.pincode = "Required";
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Invalid pincode";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        const newAddress = await addAddressMutation.mutateAsync({ name: formData.name, phone: formData.phone, house_no: formData.house_no, landmark: formData.landmark || undefined, area: formData.area, pincode: formData.pincode, is_default: formData.is_default });
        setSelectedAddress(newAddress);
        setShowForm(false);
        setFormData({ name: "", phone: "", house_no: "", landmark: "", area: "", pincode: "", is_default: true });
        toast.success("Address saved!");
        onClose();
      } catch { toast.error("Failed to save address"); }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full max-w-[400px] mx-auto bg-card rounded-t-3xl max-h-[80vh] overflow-hidden">
        <div className="p-6">
          <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4" />
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-accent mx-auto flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Delivery Address</h2>
            <p className="text-muted-foreground mt-1">Choose or add a delivery address</p>
          </div>

          {addresses.length > 0 && !showForm && (
            <div className="space-y-3 mb-6">
              <h3 className="text-lg font-semibold text-foreground">Saved Addresses</h3>
              {addresses.map((address) => (
                <TazaCard key={address.id} variant={selectedAddress?.id === address.id ? "default" : "outlined"} className={cn("p-4 cursor-pointer transition-all", selectedAddress?.id === address.id && "ring-2 ring-primary")} onClick={() => { setSelectedAddress(address); onClose(); }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-primary" /></div>
                    <div className="flex-1"><p className="font-medium text-foreground">{address.house_no}, {address.area}</p>{address.landmark && <p className="text-sm text-muted-foreground">Near {address.landmark}</p>}<p className="text-sm text-muted-foreground">PIN: {address.pincode}</p></div>
                    {selectedAddress?.id === address.id && <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"><Check className="w-4 h-4 text-primary-foreground" /></div>}
                  </div>
                </TazaCard>
              ))}
            </div>
          )}

          {!showForm && (
            <button onClick={() => setShowForm(true)} className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:border-primary hover:text-primary transition-colors">
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add New Address</span>
            </button>
          )}

          {showForm && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Add New Address</h3>
              <TazaInput label="Customer Name *" placeholder="e.g., Ashish Choubey" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} error={errors.name} />
              <TazaInput label="Phone Number *" placeholder="e.g., 9876543210" type="tel" maxLength={10} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })} error={errors.phone} />
              <TazaInput label="House/Flat No. *" placeholder="e.g., 123, Shanti Nagar" value={formData.house_no} onChange={(e) => setFormData({ ...formData, house_no: e.target.value })} error={errors.house_no} />
              <TazaInput label="Landmark (Optional)" placeholder="e.g., Near Hanuman Mandir" value={formData.landmark} onChange={(e) => setFormData({ ...formData, landmark: e.target.value })} />
              <TazaInput label="Area/Village *" placeholder="e.g., Rampur" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} error={errors.area} />
              <TazaInput label="Pincode *" placeholder="6-digit pincode" type="tel" maxLength={6} value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, "") })} error={errors.pincode} />
              <div className="flex gap-3 pt-4">
                {addresses.length > 0 && <TazaButton variant="secondary" onClick={() => setShowForm(false)} className="flex-1">Cancel</TazaButton>}
                <TazaButton onClick={handleSubmit} className="flex-1" loading={addAddressMutation.isPending}>Save Address</TazaButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressSelectionModal;
