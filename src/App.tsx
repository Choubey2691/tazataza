import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { RecentProductsProvider } from "@/contexts/RecentProductsContext";

// Screens
import SplashScreen from "./pages/SplashScreen";
import LoginScreen from "./pages/LoginScreen";
import OTPScreen from "./pages/OTPScreen";
import HomeScreen from "./pages/HomeScreen";
import CategoriesScreen from "./pages/CategoriesScreen";
import ProductListScreen from "./pages/ProductListScreen";
import ProductDetailScreen from "./pages/ProductDetailScreen";
import SearchScreen from "./pages/SearchScreen";
import CartScreen from "./pages/CartScreen";
import AddressScreen from "./pages/AddressScreen";
import DeliverySlotsScreen from "./pages/DeliverySlotsScreen";
import PaymentScreen from "./pages/PaymentScreen";
import OrderSummaryScreen from "./pages/OrderSummaryScreen";
import OrderSuccessScreen from "./pages/OrderSuccessScreen";
import OrderHistoryScreen from "./pages/OrderHistoryScreen";
import ProfileScreen from "./pages/ProfileScreen";
import RecentProductsScreen from "./pages/RecentProductsScreen";
import NotFound from "./pages/NotFound";
import { FloatingCart } from "./components/FloatingCart";

const queryClient = new QueryClient();

// Root Route component that checks auth status
const RootRoute = () => {
  const { isLoggedIn, loading, user } = useAuth();

  console.log("RootRoute: Checking auth status - loading:", loading, "isLoggedIn:", isLoggedIn, "user:", !!user);

  if (loading) {
    console.log("RootRoute: Still loading, showing splash screen");
    return <SplashScreen autoNavigate={false} />;
  }

  if (isLoggedIn && user) {
    console.log("RootRoute: User is logged in, showing home screen directly");
    return <HomeScreen />;
  } else {
    console.log("RootRoute: User not logged in, showing login screen directly");
    return <LoginScreen />;
  }
};

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RecentProductsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/otp" element={<OTPScreen />} />

          {/* Protected Routes */}
          <Route path="/home" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute><CategoriesScreen /></ProtectedRoute>} />
          <Route path="/category/:categoryId" element={<ProtectedRoute><ProductListScreen /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetailScreen /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchScreen /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><CartScreen /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><PaymentScreen /></ProtectedRoute>} />
          <Route path="/order-summary" element={<ProtectedRoute><OrderSummaryScreen /></ProtectedRoute>} />
          <Route path="/order-success/:orderId" element={<ProtectedRoute><OrderSuccessScreen /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderHistoryScreen /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
          <Route path="/recent-products" element={<ProtectedRoute><RecentProductsScreen /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingCart />
        </BrowserRouter>
      </TooltipProvider>
    </RecentProductsProvider>
  </QueryClientProvider>
);

export default App;
