'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';
import { loginUser } from '@/lib/api';

// Hardcoded demo user — no Firebase needed
const DEMO_USER = {
  email: 'diveshpatil9104@gmail.com',
  uid: 'divesh_001',
  name: 'Divesh',
};

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const data = await loginUser(DEMO_USER.email, DEMO_USER.uid);

      if (typeof window !== 'undefined') {
        localStorage.setItem('betaal_uid', data.uid || DEMO_USER.uid);
        localStorage.setItem('betaal_user_name', data.name || DEMO_USER.name);
        if (data.session_token) {
          localStorage.setItem('betaal_session', data.session_token);
        }
        window.dispatchEvent(new Event('betaal-session-update'));
      }
    } catch (err) {
      console.warn('Login failed', err);
      // Fallback: set locally even if backend is down
      if (typeof window !== 'undefined') {
        localStorage.setItem('betaal_uid', DEMO_USER.uid);
        localStorage.setItem('betaal_user_name', DEMO_USER.name);
        localStorage.setItem('betaal_session', 'sess_demo');
        window.dispatchEvent(new Event('betaal-session-update'));
      }
    } finally {
      setIsLoading(false);
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-md rounded-3xl border border-[#e0e0e0] bg-[#FAFAFA] p-10 text-center transition-all duration-500 hover:border-[#1C1C1C] hover:shadow-2xl">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1C1C1C] text-white shadow-xl">
          <Mail size={32} />
        </div>

        <h1 className="mb-4 text-3xl font-black tracking-tighter text-[#1C1C1C] uppercase">
          Welcome to Betaal AI
        </h1>
        <p className="mb-10 text-[11px] leading-relaxed font-black tracking-[0.2em] text-[#1C1C1C]/40 uppercase">
          Sign in to access your digital rehab dashboard and track your progress today.
        </p>

        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#1C1C1C] py-5 text-xs font-black tracking-[0.15em] text-white uppercase transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95 disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Signing in...
            </>
          ) : (
            'Continue as Divesh'
          )}
        </button>

        <div className="mt-8">
          <p className="text-[9px] font-bold text-[#1C1C1C]/25 uppercase">
            Secure, Science-Backed, Focused
          </p>
        </div>
      </div>
    </div>
  );
}
