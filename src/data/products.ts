export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  description?: string;
}



export const deliverySlots = [
  { id: "morning", label: "Morning", time: "6:00 AM - 10:00 AM", icon: "🌅" },
  { id: "evening", label: "Evening", time: "5:00 PM - 9:00 PM", icon: "🌆" },
];

export const paymentModes = [
  { id: "upi-qr", label: "UPI QR Code", description: "Scan & Pay", icon: "📱" },
  { id: "upi-app", label: "UPI App", description: "PhonePe, GPay, Paytm", icon: "💳" },
  { id: "cod", label: "Cash on Delivery", description: "Pay when delivered", icon: "💵" },
];
