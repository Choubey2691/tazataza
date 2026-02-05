import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MobileLayout, MobileHeader, MobileContent } from "@/components/layout/MobileLayout";
import { TazaButton } from "@/components/ui/taza-button";
import { useAppStore } from "@/store/appStore";
import { useProduct } from "@/hooks/useProducts";
import { ArrowLeft, Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";

const ProductDetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const addToCart = useAppStore((state) => state.addToCart);
  const { data: product, isLoading, error } = useProduct(id || "");

  console.log("Product id from params:", id);

  if (isLoading) return <MobileLayout><MobileContent className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></MobileContent></MobileLayout>;
  if (error || !product) return <MobileLayout><MobileContent className="flex items-center justify-center min-h-screen"><div className="text-center"><h2 className="text-xl font-semibold text-muted-foreground mb-2">Product Not Found</h2><p className="text-muted-foreground">The product you're looking for doesn't exist or has been removed.</p><button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg">Go Back</button></div></MobileContent></MobileLayout>;

  const handleAddToCart = () => { for (let i = 0; i < quantity; i++) addToCart({ id: product.id, name: product.name, price: Number(product.price), unit: product.unit, image: product.image_url || "", category: product.category, description: product.description || undefined }); navigate("/cart"); };

  return (
    <MobileLayout>
      <MobileHeader transparent leftAction={<button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full bg-card/80 backdrop-blur-sm"><ArrowLeft className="w-5 h-5 text-foreground" /></button>} rightAction={<button onClick={() => setIsFavorite(!isFavorite)} className="p-2 -mr-2 rounded-full bg-card/80 backdrop-blur-sm"><Heart className={`w-5 h-5 ${isFavorite ? "fill-destructive text-destructive" : "text-foreground"}`} /></button>} />
      <MobileContent padded={false} className="pb-32">
        <ProductImage src={product.image_url} alt={product.name} className="h-64 -mt-14" />
        <div className="px-4 pt-6">
          <div className="flex items-start justify-between gap-4"><div><h1 className="text-2xl font-bold text-foreground">{product.name}</h1><p className="text-muted-foreground mt-1">{product.unit}</p></div><p className="text-2xl font-bold text-primary">₹{product.price}</p></div>
          <div className="flex items-center gap-4 mt-6">
            <p className="text-foreground font-medium">Quantity</p>
            <div className="flex items-center gap-3 ml-auto">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-colors"><Minus className="w-4 h-4" /></button>
              <span className="w-8 text-center font-bold text-lg text-foreground">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground"><Plus className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="mt-6"><h3 className="font-semibold text-foreground mb-2">Description</h3><p className="text-muted-foreground leading-relaxed">{product.description}</p></div>
          <div className="mt-6">
            <h3 className="font-semibold text-foreground mb-3">Why Taza Taza?</h3>
            <div className="grid grid-cols-2 gap-3">
              {[{ icon: "🌱", label: "Farm Fresh" }, { icon: "🚚", label: "Quick Delivery" }, { icon: "✅", label: "Quality Checked" }, { icon: "💯", label: "Best Price" }].map((item) => (
                <div key={item.label} className="flex items-center gap-2 p-3 bg-secondary rounded-xl"><span className="text-lg">{item.icon}</span><span className="text-sm font-medium text-foreground">{item.label}</span></div>
              ))}
            </div>
          </div>
        </div>
      </MobileContent>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] bg-card border-t border-border p-4 safe-area-bottom">
        <div className="flex items-center gap-4"><div className="flex-1"><p className="text-sm text-muted-foreground">Total Price</p><p className="text-xl font-bold text-primary">₹{Number(product.price) * quantity}</p></div><TazaButton onClick={handleAddToCart} className="flex-1"><ShoppingCart className="w-5 h-5 mr-2" />Add to Cart</TazaButton></div>
      </div>
    </MobileLayout>
  );
};

export default ProductDetailScreen;
