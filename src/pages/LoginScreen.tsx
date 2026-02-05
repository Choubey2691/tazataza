import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout, MobileContent } from "@/components/layout/MobileLayout";
import { loginWithGoogle, onAuthStateChange } from "@/lib/auth";
import { appConfig } from "@/config/appConfig";
import { Leaf } from "lucide-react";

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session on component mount
    const checkSession = async () => {
      console.log("LoginScreen: Checking existing session...");
      const { data: { session } } = await supabase.auth.getSession();
      console.log("LoginScreen: Session found:", !!session);
      if (session) {
        console.log("LoginScreen: Redirecting to /home due to existing session");
        navigate("/home");
      } else {
        console.log("LoginScreen: No session, staying on login page");
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("LoginScreen: Auth state changed:", event, !!session);
      if (session) {
        console.log("LoginScreen: Redirecting to /home after auth state change");
        navigate("/home");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signInWithGoogle = async () => {
    const { error } = await loginWithGoogle();

    if (error) {
      console.error("LoginScreen: Google sign-in failed:", error);
      // TODO: Show user-friendly error message
    }
    // Note: Success redirect will be handled by the auth state listener
  };

  return (
    <MobileLayout>
      <MobileContent className="flex flex-col min-h-screen px-6 py-8 bg-taza-green-light">
        {/* Logo Section */}
        <div className="flex-1 flex flex-col items-center justify-center pt-8">
          <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-button">
            <Leaf className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground drop-shadow-lg">Taza Taza</h1>
          <p className="text-muted-foreground mt-2 drop-shadow-md">Fresh vegetables at your doorstep</p>
        </div>

        {/* Button Section */}
        <div className="pt-6 pb-4 safe-area-bottom">
          <button
            onClick={signInWithGoogle}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-3 font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
          >
            Continue with Google
          </button>
          <p className="text-center text-xs text-muted-foreground mt-4">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </MobileContent>
    </MobileLayout>
  );
};

export default LoginScreen;
