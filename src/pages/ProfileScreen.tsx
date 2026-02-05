import React from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout, MobileHeader, MobileContent } from "@/components/layout/MobileLayout";
import { TazaCard } from "@/components/ui/taza-card";
import { TazaButton } from "@/components/ui/taza-button";
import { useAuth } from "@/hooks/useAuth";
import { useAddresses } from "@/hooks/useAddresses";
import { useOrders } from "@/hooks/useOrders";
import { ArrowLeft, Phone, MapPin, Package, ChevronRight, LogOut, Leaf } from "lucide-react";

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const { data: addresses = [] } = useAddresses();
  const { data: orders = [] } = useOrders();

  const handleLogout = async () => { await signOut(); navigate("/"); };

  const menuItems = [
    { icon: <Package className="w-5 h-5" />, label: "My Orders", value: `${orders.length} orders`, onClick: () => navigate("/orders") },
    { icon: <MapPin className="w-5 h-5" />, label: "Saved Addresses", value: `${addresses.length} addresses`, onClick: () => navigate("/address") },
  ];

  return (
    <MobileLayout>
      <MobileHeader title="Profile" leftAction={<button onClick={() => navigate(-1)} className="p-2 -ml-2"><ArrowLeft className="w-5 h-5 text-foreground" /></button>} />
      <MobileContent className="pt-4 pb-8">
        <TazaCard variant="elevated" className="p-6 text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary mx-auto flex items-center justify-center mb-4"><Leaf className="w-10 h-10 text-primary-foreground" /></div>
          <h2 className="text-xl font-bold text-foreground">{profile?.name || "Guest"}</h2>
          {profile?.phone && <p className="text-muted-foreground flex items-center justify-center gap-2 mt-1"><Phone className="w-4 h-4" />+91 {profile.phone}</p>}
        </TazaCard>
        <div className="space-y-3 mb-6">
          {menuItems.map((item, index) => (
            <TazaCard key={index} variant="outlined" className="p-4 cursor-pointer hover:bg-secondary transition-colors" onClick={item.onClick}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary">{item.icon}</div>
                <div className="flex-1"><p className="font-medium text-foreground">{item.label}</p><p className="text-sm text-muted-foreground">{item.value}</p></div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </TazaCard>
          ))}
        </div>
        <TazaCard variant="outlined" className="p-4 mb-6">
          <div className="flex items-center gap-3 mb-3"><Leaf className="w-6 h-6 text-primary" /><span className="font-bold text-foreground">Taza Taza</span></div>
          <p className="text-sm text-muted-foreground">Delivering fresh vegetables and groceries to your doorstep.</p>
        </TazaCard>
        <TazaButton variant="outline" size="full" onClick={handleLogout} className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"><LogOut className="w-5 h-5 mr-2" />Logout</TazaButton>
      </MobileContent>
    </MobileLayout>
  );
};

export default ProfileScreen;
