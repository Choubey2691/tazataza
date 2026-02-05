import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

console.log('SUPABASE_URL:', SUPABASE_URL ? 'Set' : 'Not set');
console.log('SUPABASE_PUBLISHABLE_KEY:', SUPABASE_PUBLISHABLE_KEY ? 'Set' : 'Not set');

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error('Environment variables not set');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testOTP() {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      phone: '+911234567890', // Test phone number
    });

    if (error) {
      console.error('OTP send failed:', error.message);
    } else {
      console.log('OTP sent successfully');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testOTP();
