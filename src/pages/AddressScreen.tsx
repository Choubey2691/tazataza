import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout, MobileHeader, MobileContent } from "@/components/layout/MobileLayout";
import { TazaButton } from "@/components/ui/taza-button";
import { TazaInput } from "@/components/ui/taza-input";
import { TazaCard } from "@/components/ui/taza-card";
import { useAppStore } from "@/store/appStore";
import { useAddresses, useAddAddress } from "@/hooks/useAddresses";
import { ArrowLeft, MapPin, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const AddressScreen: React.FC = () => {
  const navigate = useNavigate();
  const { data: addresses = [], isLoading } = useAddresses();
  const addAddressMutation = useAddAddress();
  const selectedAddress = useAppStore((state) => state.selectedAddress);
  const setSelectedAddress = useAppStore((state) => state.setSelectedAddress);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", house_no: "", landmark: "", area: "", pincode: "", is_default: true });
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => { if (!isLoading && addresses.length === 0) setShowForm(true); }, [isLoading, addresses.length]);

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
      } catch { toast.error("Failed to save address"); }
    }
  };

  if (isLoading) return <MobileLayout><MobileHeader title="Delivery Address" leftAction={<button onClick={() => navigate(-1)} className="p-2 -ml-2"><ArrowLeft className="w-5 h-5 text-foreground" /></button>} /><MobileContent className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></MobileContent></MobileLayout>;

  return (
    <MobileLayout>
      <MobileHeader title="Delivery Address" leftAction={<button onClick={() => navigate(-1)} className="p-2 -ml-2"><ArrowLeft className="w-5 h-5 text-foreground" /></button>} />
      <MobileContent className="pt-4 pb-32">
        {addresses.length > 0 && !showForm && (
          <div className="space-y-3 mb-6">
            <h2 className="text-lg font-semibold text-foreground">Saved Addresses</h2>
            {addresses.map((address) => (
              <TazaCard key={address.id} variant={selectedAddress?.id === address.id ? "default" : "outlined"} className={cn("p-4 cursor-pointer transition-all", selectedAddress?.id === address.id && "ring-2 ring-primary")} onClick={() => setSelectedAddress(address)}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-primary" /></div>
                  <div className="flex-1"><p className="font-medium text-foreground">{address.house_no}, {address.area}</p>{address.landmark && <p className="text-sm text-muted-foreground">Near {address.landmark}</p>}<p className="text-sm text-muted-foreground">PIN: {address.pincode}</p></div>
                  {selectedAddress?.id === address.id && <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"><Check className="w-4 h-4 text-primary-foreground" /></div>}
                </div>
              </TazaCard>
            ))}
          </div>
        )}
        {!showForm && <button onClick={() => setShowForm(true)} className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:border-primary hover:text-primary transition-colors"><Plus className="w-5 h-5" /><span className="font-medium">Add New Address</span></button>}
        {showForm && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Add New Address</h2>
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
      </MobileContent>
      {!showForm && selectedAddress && <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] bg-card border-t border-border p-4 safe-area-bottom"><TazaButton size="full" onClick={() => navigate("/delivery-slots")}>Continue</TazaButton></div>}
    </MobileLayout>
  );
};

export default AddressScreen;
