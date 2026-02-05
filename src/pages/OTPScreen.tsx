import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout, MobileContent } from "@/components/layout/MobileLayout";
import { TazaButton } from "@/components/ui/taza-button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OTPScreen: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const tempPhone = sessionStorage.getItem("tempPhone");
    const tempName = sessionStorage.getItem("tempName");

    if (!tempPhone || !tempName) {
      navigate("/login");
      return;
    }

    setPhone(tempPhone);
    setName(tempName);

    // Send OTP
    const sendOTP = async () => {
      const { error } = await supabase.auth.signInWithOtp({
        phone: `+91${tempPhone}`, // Assuming Indian numbers, adjust as needed
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to send OTP. Please try again.",
          variant: "destructive",
        });
        navigate("/login");
      } else {
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the OTP.",
        });
      }
    };

    sendOTP();
  }, [navigate, toast]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.verifyOtp({
      phone: `+91${phone}`,
      token: otp,
      type: "sms",
    });

    if (error) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Check if profile exists, if not create it
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (!profile) {
        await supabase.from("profiles").insert({
          user_id: data.user.id,
          name: name,
          phone: phone,
        });
      }

      // Clear temp data
      sessionStorage.removeItem("tempName");
      sessionStorage.removeItem("tempPhone");

      toast({
        title: "Success",
        description: "Logged in successfully!",
      });

      navigate("/home");
    }

    setLoading(false);
  };

  const handleResendOTP = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      phone: `+91${phone}`,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "OTP Resent",
        description: "Please check your phone for the new OTP.",
      });
    }
  };

  return (
    <MobileLayout>
      <MobileContent className="flex flex-col min-h-screen px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/login")}
            className="p-2 rounded-full hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold ml-4">Verify Phone Number</h1>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Phone className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">Enter OTP</h2>
          <p className="text-muted-foreground text-center mb-8">
            We've sent a 6-digit code to +91 {phone}
          </p>

          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            className="mb-8"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <TazaButton
            size="full"
            onClick={handleVerifyOTP}
            disabled={loading || otp.length !== 6}
            className="mb-4"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </TazaButton>

          <button
            onClick={handleResendOTP}
            className="text-primary text-sm underline"
          >
            Resend OTP
          </button>
        </div>
      </MobileContent>
    </MobileLayout>
  );
};

export default OTPScreen;
